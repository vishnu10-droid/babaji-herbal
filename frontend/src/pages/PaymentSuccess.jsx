import { Link, useLocation } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import Button from "../components/Button";

export default function PaymentSuccess() {
  const { state } = useLocation();
  return (
    <section className="section-shell py-16 text-center">
      <CheckCircle2 size={56} className="mx-auto text-[#0B6B3A]" />
      <h1 className="mt-4 font-display text-3xl font-bold text-[#123d2a]">Payment successful!</h1>
      <p className="mt-2 text-slate-600">
        Your order {state?.orderId ? <strong>#{String(state.orderId).slice(-6).toUpperCase()}</strong> : ""} is confirmed and being prepared.
      </p>
      <div className="mt-6 flex justify-center gap-3">
        <Link to="/account/orders"><Button className="rounded-full">View my orders</Button></Link>
        <Link to="/shop" className="rounded-full border border-[#0B6B3A]/20 px-6 py-3 text-sm font-bold text-[#0B6B3A]">Continue shopping</Link>
      </div>
    </section>
  );
}
