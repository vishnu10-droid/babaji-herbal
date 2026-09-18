import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ArrowLeft, Lock, Minus, Plus, ShoppingBag, Trash2, Truck } from "lucide-react";
import Breadcrumb from "../components/Breadcrumb";
import Button from "../components/Button";
import { resolveImage } from "../utils/image";
import { clearCart, fetchCart, removeCartItem, updateCartItem } from "../store/slice/cart.slice";
import { useAuth } from "../context/auth-context";

const formatMoney = (amount) => `₹${Number(amount || 0).toLocaleString("en-IN")}`;

const productImage = (image) => {
  if (!image) return "https://placehold.co/180x180/eaf2ff/2563eb?text=Babaji+Herbals";
  return resolveImage(image);
};

export default function Cart() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useAuth();
  const { items, totalAmount, loading, error } = useSelector((state) => state.cart);
  const [actionError, setActionError] = useState("");

  useEffect(() => {
    if (isAuthenticated) dispatch(fetchCart());
  }, [dispatch, isAuthenticated]);

  const changeQuantity = (item, quantity) => {
    if (quantity < 1) return;
    setActionError("");
    // Optimistic update slice me turant price badha deta hai,
    // server response ka wait nahi karna padta.
    dispatch(updateCartItem({ itemId: item._id, quantity }))
      .unwrap()
      .catch((requestError) => {
        setActionError(requestError || "Cart quantity could not be updated.");
        // Server se sync wapas lao taaki galat qty na atke
        dispatch(fetchCart());
      });
  };

  const removeItem = (itemId) => {
    setActionError("");
    dispatch(removeCartItem(itemId))
      .unwrap()
      .catch((requestError) => {
        setActionError(requestError || "Product could not be removed from cart.");
        dispatch(fetchCart());
      });
  };

  const emptyCart = async () => {
    setActionError("");
    try {
      await dispatch(clearCart()).unwrap();
    } catch (requestError) {
      setActionError(requestError || "Cart could not be cleared.");
    }
  };

  const itemCount = items.reduce((total, item) => total + Number(item.quantity || 0), 0);
  const shipping = totalAmount > 999 || items.length === 0 ? 0 : 79;
  const total = Number(totalAmount || 0) + shipping;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-emerald-50/20 pb-20 font-sans text-gray-800">
      <section className="relative mb-8 bg-[#0b6b3a] px-6 py-14 text-white md:py-20">
        <div className="mx-auto max-w-6xl text-center">
          <h1 className="font-display text-4xl font-extrabold tracking-tight md:text-5xl">Shopping Cart</h1>
          <div className="mt-3 flex justify-center"><Breadcrumb items={[{ label: "Cart" }]} /></div>
        </div>
      </section>

      <section className="section-shell mx-auto max-w-6xl px-4 sm:px-6">
        {!isAuthenticated ? (
          <div className="mx-auto max-w-md space-y-4 rounded-3xl border border-gray-100 bg-white px-6 py-16 text-center shadow-sm">
            <ShoppingBag className="mx-auto text-[#0b6b3a]" size={40} />
            <h2 className="text-2xl font-bold text-gray-900">Please sign in to view your cart</h2>
            <p className="text-sm text-gray-500">Your cart is saved securely to your account.</p>
            <Link to="/login" className="inline-block"><Button className="rounded-full px-8 py-3">Sign In</Button></Link>
          </div>
        ) : loading && items.length === 0 ? (
          <p className="py-16 text-center text-sm font-semibold text-[#0b6b3a]">Loading your cart...</p>
        ) : items.length === 0 ? (
          <div className="mx-auto max-w-md space-y-4 rounded-3xl border border-gray-100 bg-white px-6 py-16 text-center shadow-sm">
            <ShoppingBag className="mx-auto text-[#0b6b3a]" size={40} />
            <h2 className="text-2xl font-bold text-gray-900">Your Cart is Empty</h2>
            <p className="text-sm text-gray-500">Add a herbal product and its pouch variation to get started.</p>
            <Link to="/shop" className="inline-block"><Button className="rounded-full px-8 py-3">Explore Products</Button></Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
            <div className="space-y-4 lg:col-span-7 xl:col-span-8">
              <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900"><ShoppingBag className="text-[#0b6b3a]" size={20} /> Your Products ({itemCount})</h2>
                <button type="button" onClick={emptyCart} className="text-xs font-semibold text-rose-600 hover:underline">Clear cart</button>
              </div>

              {items.map((item) => {
                const product = item.productId || {};
                const name = item.productName || product.name || "Product";
                const variation = item.variationName || (item.pouches ? `${item.pouches} pouches` : "");
                const lineTotal = Number(item.price || 0) * Number(item.quantity || 0);
                return <div key={item._id} className="group flex flex-col items-center gap-5 rounded-3xl border border-emerald-900/10 bg-white p-5 shadow-sm transition hover:shadow-md sm:flex-row">
                  <img src={productImage(item.image || product.images?.[0])} alt={name} className="h-24 w-24 shrink-0 rounded-2xl border border-gray-100 bg-gray-50 object-cover sm:h-28 sm:w-28" />
                  <div className="w-full flex-1 space-y-1 text-center sm:text-left">
                    <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#0b6b3a]">{product.category || "Herbal care"}</span>
                    <h3 className="text-base font-bold leading-snug text-gray-900">{name}</h3>
                    {variation && <p className="text-xs font-medium text-gray-500">{variation}</p>}
                    <div className="flex items-center justify-center gap-2 pt-1 sm:justify-start"><span className="text-base font-extrabold text-[#0b6b3a]">{formatMoney(lineTotal)}</span><span className="text-xs text-gray-500">{formatMoney(item.price)} each</span>{Number(item.mrp) > Number(item.price) && <span className="text-xs text-gray-400 line-through">{formatMoney(Number(item.mrp) * Number(item.quantity || 0))}</span>}</div>
                  </div>
                  <div className="flex w-full items-center justify-between gap-4 border-t border-gray-100 pt-3 sm:w-auto sm:flex-col sm:items-end sm:border-t-0 sm:pt-0">
                    <div className="flex items-center rounded-full border border-gray-200 bg-gray-50 p-1">
                      <button type="button" disabled={item.quantity <= 1} onClick={() => changeQuantity(item, item.quantity - 1)} className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-gray-600 shadow-sm transition hover:bg-gray-100 active:scale-90 disabled:cursor-not-allowed disabled:opacity-40"><Minus size={12} /></button>
                      <span className="w-8 text-center text-xs font-bold text-gray-800">{item.quantity}</span>
                      <button type="button" onClick={() => changeQuantity(item, item.quantity + 1)} className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0b6b3a] text-white shadow-sm transition hover:bg-[#08522c] active:scale-90"><Plus size={12} /></button>
                    </div>
                    <button type="button" onClick={() => removeItem(item._id)} className="rounded-full p-1.5 text-gray-400 transition hover:bg-red-50 hover:text-red-500" title="Remove item"><Trash2 size={16} /></button>
                  </div>
                </div>;
              })}
              <div className="flex items-center gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/60 p-3.5 text-xs font-medium text-[#0b6b3a]"><Truck size={20} className="shrink-0" /><span>{shipping === 0 ? "Free delivery applied to this order." : "Free delivery is available on orders above ₹999."}</span></div>
            </div>

            <aside className="lg:col-span-5 xl:col-span-4"><div className="sticky top-6 space-y-5 rounded-[2rem] border border-emerald-900/10 bg-white p-6 shadow-xl">
              <h2 className="border-b border-gray-100 pb-3 font-display text-2xl font-bold text-gray-900">Order Summary</h2>
              <div className="space-y-3 border-y border-gray-100 py-4 text-sm font-medium text-gray-600"><div className="flex justify-between"><span>Subtotal</span><span className="font-bold text-gray-900">{formatMoney(totalAmount)}</span></div><div className="flex justify-between"><span>Estimated Shipping</span><span className="font-bold text-gray-900">{shipping === 0 ? <span className="text-[#0b6b3a]">FREE</span> : formatMoney(shipping)}</span></div></div>
              <div className="flex items-baseline justify-between"><div><p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Total Amount</p><p className="text-[10px] text-gray-400">Taxes included</p></div><p className="text-3xl font-extrabold text-[#0b6b3a]">{formatMoney(total)}</p></div>
              <Link to="/checkout" className="block"><Button className="flex w-full items-center justify-center gap-2 rounded-full py-3.5"><Lock size={16} /> Proceed to Checkout</Button></Link>
            </div></aside>
          </div>
        )}
        {(actionError || error) && <p className="mt-5 rounded-xl bg-rose-50 p-3 text-sm text-rose-600">{actionError || error}</p>}
        {isAuthenticated && <Link to="/shop" className="mt-6 inline-flex items-center gap-1 text-xs font-semibold text-[#0b6b3a] hover:underline"><ArrowLeft size={14} /> Continue Shopping</Link>}
      </section>
    </div>
  );
}
