import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Breadcrumb from "../components/Breadcrumb";
import Button from "../components/Button";
import { useRazorpayCheckout } from "../components/RazorpayPayment";
import { fetchCart } from "../store/slice/cart.slice";
import { useAuth } from "../context/auth-context";
import {
  createRazorpayOrder,
  verifyRazorpayPayment,
  markPaymentFailed,
  validateCouponCode,
} from "../service/payment.api";
import { createCodOrder } from "../service/order.api";

const inr = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;

export default function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { items, totalAmount } = useSelector((state) => state.cart);
  const { openCheckout, opening } = useRazorpayCheckout();

  const [form, setForm] = useState({ name: "", address: "", city: "" });
  const [coupon, setCoupon] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponMsg, setCouponMsg] = useState("");
  const [couponChecking, setCouponChecking] = useState(false);
  const [message, setMessage] = useState("");
  const [paying, setPaying] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("razorpay"); // razorpay | cod

  useEffect(() => {
    if (isAuthenticated) dispatch(fetchCart());
  }, [dispatch, isAuthenticated]);

  const subtotal = useMemo(() => Number(totalAmount || 0), [totalAmount]);
  const discount = useMemo(() => Math.min(Number(couponDiscount || 0), subtotal), [couponDiscount, subtotal]);
  // Rule: Online (Razorpay) = 0 delivery, COD = Rs.100 extra
  const shipping = paymentMethod === "cod" ? 100 : 0;
  const payable = Math.max(0, subtotal - discount + shipping);

  const applyCoupon = async () => {
    if (!coupon.trim()) return;
    setCouponChecking(true);
    setCouponMsg("");
    try {
      const data = await validateCouponCode(coupon.trim(), subtotal);
      setCouponDiscount(Number(data.discount || 0));
      setCouponMsg(`Coupon applied: −${inr(data.discount)}`);
    } catch (e) {
      setCouponDiscount(0);
      setCouponMsg(e.response?.data?.message || "Invalid coupon code");
    } finally {
      setCouponChecking(false);
    }
  };

  const handlePayNow = async (event) => {
    event.preventDefault();
    if (paying || verifying || opening) return; // prevent duplicate order creation
    setMessage("");
    if (!items.length) {
      setMessage("Your cart is empty.");
      return;
    }
    // COD flow: backend Rs.100 add karke order confirm karta hai, no Razorpay
    if (paymentMethod === "cod") {
      setPaying(true);
      try {
        const data = await createCodOrder({
          ...form,
          couponCode: couponDiscount > 0 ? coupon.trim().toUpperCase() : "",
          discount,
        });
        await dispatch(fetchCart());
        navigate("/payment-success", { state: { orderId: data.order?._id, cod: true }, replace: true });
      } catch (e) {
        setMessage(e.response?.data?.message || "COD order failed. Please try again.");
      } finally {
        setPaying(false);
      }
      return;
    }
    setPaying(true);
    let mongoOrderId = null;
    try {
      // 1. Backend validates cart + coupon, creates pending Mongo order + Razorpay order.
      const data = await createRazorpayOrder({
        ...form,
        couponCode: couponDiscount > 0 ? coupon.trim().toUpperCase() : "",
      });
      mongoOrderId = data.orderId;

      // 2. Open official Razorpay Checkout.
      await openCheckout({
        keyId: data.keyId,
        razorpayOrderId: data.razorpayOrder.id,
        amountPaise: data.razorpayOrder.amount,
        orderId: data.orderId,
        customer: { name: form.name, email: user?.email || "" },
        onSuccess: async (rzpResponse) => {
          // 3. Verify signature on backend — only then is the order marked paid.
          setVerifying(true);
          try {
            await verifyRazorpayPayment({
              mongoOrderId,
              razorpay_order_id: rzpResponse.razorpay_order_id,
              razorpay_payment_id: rzpResponse.razorpay_payment_id,
              razorpay_signature: rzpResponse.razorpay_signature,
            });
            await dispatch(fetchCart());
            navigate("/payment-success", { state: { orderId: mongoOrderId }, replace: true });
          } catch (verifyErr) {
            setMessage(verifyErr.response?.data?.message || "Payment verification failed. Contact support with your payment ID.");
            navigate("/payment-failed", { state: { orderId: mongoOrderId, reason: "verification-failed" }, replace: true });
          } finally {
            setVerifying(false);
          }
        },
        onFailure: async (err) => {
          try {
            if (mongoOrderId) await markPaymentFailed({ mongoOrderId, reason: err?.message });
          } finally {
            navigate("/payment-failed", { state: { orderId: mongoOrderId, reason: err?.message }, replace: true });
          }
        },
        onDismiss: async () => {
          // User closed/cancelled checkout — order stays pending, NOT paid.
          try {
            if (mongoOrderId) await markPaymentFailed({ mongoOrderId, reason: "cancelled by user" });
          } finally {
            setMessage("Payment was cancelled. Your order was not charged.");
          }
        },
      });
    } catch (e) {
      if (e.response?.status === 404) {
        setMessage(
          "Payment service server par nahi mila (404). Backend ka naya code Render par deploy nahi hua hai — pehle code push karke redeploy karo, phir retry karo.",
        );
      } else {
        setMessage(e.response?.data?.message || e.message || "Could not start payment. Please try again.");
      }
    } finally {
      setPaying(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <section className="section-shell py-16 text-center">
        <p className="text-slate-600">Please sign in before checkout.</p>
        <Link to="/login" className="mt-4 inline-block"><Button>Sign in</Button></Link>
      </section>
    );
  }

  const busy = paying || verifying || opening;

  return (
    <>
      <Breadcrumb items={[{ label: "Checkout" }]} />
      <section className="section-shell py-10">
        <form onSubmit={handlePayNow} className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[2rem] bg-white p-6 shadow-lg">
            <h1 className="font-display text-3xl">Delivery details</h1>
            <div className="mt-6 space-y-3">
              <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded-2xl border border-[#0B6B3A]/10 px-4 py-3" placeholder="Full name" />
              <input required value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="w-full rounded-2xl border border-[#0B6B3A]/10 px-4 py-3" placeholder="Full address" />
              <input required value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="w-full rounded-2xl border border-[#0B6B3A]/10 px-4 py-3" placeholder="City" />
            </div>

            <div className="mt-6">
              <h2 className="font-display text-xl">Have a coupon?</h2>
              <div className="mt-2 flex gap-2">
                <input value={coupon} onChange={(e) => setCoupon(e.target.value.toUpperCase())} className="flex-1 rounded-2xl border border-[#0B6B3A]/10 px-4 py-3 uppercase" placeholder="COUPON CODE" />
                <button type="button" onClick={applyCoupon} disabled={couponChecking || !coupon.trim()} className="rounded-2xl bg-[#0B6B3A]/10 px-5 font-bold text-[#0B6B3A] disabled:opacity-50">
                  {couponChecking ? "Checking…" : "Apply"}
                </button>
              </div>
              {couponMsg && <p className="mt-2 text-sm text-slate-600">{couponMsg}</p>}
            </div>

            <div className="mt-6">
              <h2 className="font-display text-xl">Payment method</h2>
              <div className="mt-2 space-y-2">
                <label className={`flex cursor-pointer items-center justify-between rounded-2xl border px-4 py-3 ${paymentMethod === "razorpay" ? "border-[#0B6B3A] bg-[#0B6B3A]/5" : "border-[#0B6B3A]/10"}`}>
                  <span className="flex items-center gap-2 font-semibold">
                    <input type="radio" name="paymentMethod" checked={paymentMethod === "razorpay"} onChange={() => setPaymentMethod("razorpay")} />
                    Online Payment (Razorpay)
                  </span>
                  <span className="text-sm font-bold text-[#0B6B3A]">FREE delivery</span>
                </label>
                <label className={`flex cursor-pointer items-center justify-between rounded-2xl border px-4 py-3 ${paymentMethod === "cod" ? "border-[#0B6B3A] bg-[#0B6B3A]/5" : "border-[#0B6B3A]/10"}`}>
                  <span className="flex items-center gap-2 font-semibold">
                    <input type="radio" name="paymentMethod" checked={paymentMethod === "cod"} onChange={() => setPaymentMethod("cod")} />
                    Cash on Delivery
                  </span>
                  <span className="text-sm font-bold">+ ₹100 extra</span>
                </label>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] bg-[#eef6ef] p-6 shadow-lg">
            <h2 className="font-display text-2xl">Order summary</h2>
            <div className="mt-4 space-y-3 text-sm text-slate-700">
              {items.map((item) => (
                <div key={item._id} className="flex justify-between gap-3">
                  <span>
                    {item.productName}
                    {item.variationName ? <span className="text-slate-500"> ({item.variationName})</span> : null}
                    {" × "}{item.quantity}
                    <span className="block text-xs text-slate-500">{inr(item.price)} each</span>
                  </span>
                  <span className="font-semibold">{inr(item.price * item.quantity)}</span>
                </div>
              ))}
              <div className="flex justify-between border-t border-emerald-900/10 pt-3"><span>Subtotal</span><span>{inr(subtotal)}</span></div>
              <div className="flex justify-between"><span>Discount</span><span>{discount ? `−${inr(discount)}` : "—"}</span></div>
              <div className="flex justify-between"><span>Shipping {paymentMethod === "cod" ? "(COD fee)" : "(Online)"}</span><span>{shipping ? inr(shipping) : "FREE"}</span></div>
              <div className="flex justify-between text-base font-bold"><span>Payable amount</span><span>{inr(payable)}</span></div>
            </div>
            {message && <p className="mt-4 text-sm text-rose-600">{message}</p>}
            {verifying && <p className="mt-2 text-sm font-semibold text-[#0B6B3A]">Verifying payment with bank… do not close this page.</p>}
            <div className="mt-6">
              <Button disabled={!items.length || busy} className="rounded-full">
                {verifying ? "Verifying payment…" : paying || opening ? (paymentMethod === "cod" ? "Placing order…" : "Opening Razorpay…") : (paymentMethod === "cod" ? `Place COD Order ${inr(payable)}` : `Pay Now ${inr(payable)}`)}
              </Button>
              <p className="mt-3 text-xs text-slate-500">{paymentMethod === "cod" ? "Pay in cash when your order arrives. Rs.100 COD fee included." : "Secured by Razorpay (Test Mode). You will be charged only after successful verification."}</p>
            </div>
          </div>
        </form>
      </section>
    </>
  );
}
