import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Breadcrumb from "../components/Breadcrumb";
import Button from "../components/Button";
import { fetchCart } from "../store/slice/cart.slice";
import { API_URL } from "../config/config";
import { useAuth } from "../context/auth-context";

export default function Checkout() {
  const dispatch = useDispatch(); const navigate = useNavigate(); const { isAuthenticated } = useAuth(); const { items, totalAmount } = useSelector((state) => state.cart);
  const [form, setForm] = useState({ name: "", address: "", city: "" }); const [message, setMessage] = useState(""); const [saving, setSaving] = useState(false);
  useEffect(() => { if (isAuthenticated) dispatch(fetchCart()); }, [dispatch, isAuthenticated]);
  const shipping = totalAmount > 999 || !items.length ? 0 : 79;
  const placeOrder = async (event) => { event.preventDefault(); setSaving(true); setMessage(""); try { const token = localStorage.getItem("auth_token"); await axios.post(`${API_URL}/orders`, form, { headers: { Authorization: `Bearer ${token}` } }); await dispatch(fetchCart()); navigate("/cart", { state: { orderPlaced: true } }); } catch (e) { setMessage(e.response?.data?.message || "Order could not be placed."); } finally { setSaving(false); } };
  if (!isAuthenticated) return <section className="section-shell py-16 text-center"><p className="text-slate-600">Please sign in before checkout.</p><Link to="/login" className="mt-4 inline-block"><Button>Sign in</Button></Link></section>;
  return <><Breadcrumb items={[{ label: "Checkout" }]} /><section className="section-shell py-10"><form onSubmit={placeOrder} className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]"><div className="rounded-[2rem] bg-white p-6 shadow-lg"><h1 className="font-display text-3xl">Delivery details</h1><div className="mt-6 space-y-3"><input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded-2xl border border-[#0B6B3A]/10 px-4 py-3" placeholder="Full name" /><input required value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="w-full rounded-2xl border border-[#0B6B3A]/10 px-4 py-3" placeholder="Full address" /><input required value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="w-full rounded-2xl border border-[#0B6B3A]/10 px-4 py-3" placeholder="City" /></div></div><div className="rounded-[2rem] bg-[#eef6ef] p-6 shadow-lg"><h2 className="font-display text-2xl">Order summary</h2><div className="mt-4 space-y-3 text-sm text-slate-700">{items.map((item) => <div key={item._id} className="flex justify-between gap-3"><span>{item.productName} × {item.quantity}</span><span>₹{(item.price * item.quantity).toLocaleString("en-IN")}</span></div>)}<div className="flex justify-between border-t border-emerald-900/10 pt-3"><span>Shipping</span><span>{shipping ? `₹${shipping}` : "FREE"}</span></div><div className="flex justify-between text-base font-bold"><span>Total</span><span>₹{(Number(totalAmount) + shipping).toLocaleString("en-IN")}</span></div></div>{message && <p className="mt-4 text-sm text-rose-600">{message}</p>}<div className="mt-6"><Button disabled={!items.length || saving} className="rounded-full">{saving ? "Placing order…" : "Place Order"}</Button></div></div></form></section></>;
}
