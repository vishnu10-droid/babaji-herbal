import { Link, useLocation } from "react-router-dom";
import { XCircle } from "lucide-react";
import Button from "../components/Button";

export default function PaymentFailed() {
  const { state } = useLocation();
  return (
    <section className="section-shell py-16 text-center">
      <XCircle size={56} className="mx-auto text-rose-500" />
      <h1 className="mt-4 font-display text-3xl font-bold text-slate-900">Payment failed</h1>
      <p className="mx-auto mt-2 max-w-md text-slate-600">
        {state?.reason
          ? `Reason: ${state.reason}. You were not charged.`
          : "Your payment could not be completed. You were not charged."}
        {state?.orderId ? " You can safely retry from checkout." : ""}
      </p>
      <div className="mt-6 flex justify-center gap-3">
        <Link to="/checkout"><Button className="rounded-full">Retry payment</Button></Link>
        <Link to="/cart" className="rounded-full border border-slate-200 px-6 py-3 text-sm font-bold text-slate-600">Back to cart</Link>
      </div>
    </section>
  );
}
