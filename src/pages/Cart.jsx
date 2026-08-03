import React, { useState } from "react";
import {
  Trash2,
  Plus,
  Minus,
  ArrowLeft,
  ShieldCheck,
  Truck,
  Tag,
  Lock,
  ShoppingBag,
} from "lucide-react";
import Breadcrumb from "../components/Breadcrumb";
import Button from "../components/Button";

export default function Cart() {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Green Vital Oil",
      category: "Therapeutic Oils",
      dosage: "CBD 100MG",
      price: 79,
      originalPrice: 95,
      quantity: 1,
      image:
        "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=500&q=80",
    },
    {
      id: 2,
      name: "Ayurvedic Herbal Extract",
      category: "Botanical Tinctures",
      dosage: "50ML / PURE",
      price: 49,
      originalPrice: 60,
      quantity: 2,
      image:
        "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=500&q=80",
    },
  ]);

  const [promoCode, setPromoCode] = useState("");

  const updateQuantity = (id, delta) => {
    setCartItems((items) =>
      items.map((item) => {
        if (item.id === id) {
          const newQty = Math.max(1, item.quantity + delta);
          return { ...item, quantity: newQty };
        }
        return item;
      })
    );
  };

  const removeItem = (id) => {
    setCartItems((items) => items.filter((item) => item.id !== id));
  };

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const shipping = subtotal > 100 || cartItems.length === 0 ? 0 : 9.99;
  const discount = subtotal > 0 ? 10 : 0; // Standard $10 welcome discount
  const total = Math.max(0, subtotal + shipping - discount);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-emerald-50/20 font-sans text-gray-800 pb-20">
      
      {/* HERO BANNER */}
      <section
        className="relative bg-cover bg-center py-16 md:py-24 px-6 text-white mb-8"
        style={{
          backgroundImage: `linear-gradient(rgba(11, 107, 58, 0.88), rgba(0, 0, 0, 0.78)), url('https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=1200&q=80')`,
        }}
      >
        <div className="max-w-6xl mx-auto text-center space-y-3">
          <h1 className="font-display text-4xl md:text-5xl font-extrabold tracking-tight">
            Shopping Cart
          </h1>
          <div className="flex justify-center">
            <Breadcrumb items={[{ label: "Cart" }]} />
          </div>
        </div>
      </section>

      <section className="section-shell max-w-6xl mx-auto px-4 sm:px-6">
        {cartItems.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT COLUMN: ITEM LIST (8 cols) */}
            <div className="lg:col-span-7 xl:col-span-8 space-y-4">
              
              {/* Header Box */}
              <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-[#0B6B3A]" />
                  Your Products ({cartItems.reduce((a, b) => a + b.quantity, 0)})
                </h2>
                <a
                  href="/shop"
                  className="text-xs font-semibold text-[#0B6B3A] hover:underline flex items-center gap-1"
                >
                  <ArrowLeft size={14} /> Continue Shopping
                </a>
              </div>

              {/* Cart Items Cards */}
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="group relative rounded-3xl bg-white p-5 shadow-sm hover:shadow-md transition-all duration-300 border border-emerald-900/10 flex flex-col sm:flex-row items-center gap-5"
                  >
                    {/* Item Image */}
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gray-50 overflow-hidden flex-shrink-0 border border-gray-100">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 space-y-1 text-center sm:text-left w-full">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#0B6B3A] bg-emerald-50 px-2.5 py-0.5 rounded-full">
                        {item.category}
                      </span>
                      <h3 className="font-bold text-gray-900 text-base leading-snug">
                        {item.name}
                      </h3>
                      <p className="text-xs text-gray-400 font-medium">
                        {item.dosage}
                      </p>

                      <div className="flex items-center justify-center sm:justify-start gap-2 pt-1">
                        <span className="text-base font-extrabold text-[#0B6B3A]">
                          ${item.price}
                        </span>
                        {item.originalPrice && (
                          <span className="text-xs text-gray-400 line-through">
                            ${item.originalPrice}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Quantity & Delete Controls */}
                    <div className="flex sm:flex-col items-center justify-between sm:items-end w-full sm:w-auto gap-4 pt-3 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                      
                      {/* Plus/Minus Counter */}
                      <div className="flex items-center bg-gray-50 rounded-full border border-gray-200 p-1">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-7 h-7 rounded-full bg-white text-gray-600 flex items-center justify-center shadow-xs hover:bg-gray-100 transition"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="w-8 text-center text-xs font-bold text-gray-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-7 h-7 rounded-full bg-[#0B6B3A] text-white flex items-center justify-center shadow-xs hover:bg-[#08522c] transition"
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      {/* Trash Button */}
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-gray-400 hover:text-red-500 transition p-1.5 rounded-full hover:bg-red-50"
                        title="Remove Item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                  </div>
                ))}
              </div>

              {/* Security & Free Delivery Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4">
                <div className="flex items-center gap-3 p-3.5 bg-emerald-50/60 rounded-2xl border border-emerald-100 text-xs text-[#0B6B3A] font-medium">
                  <Truck size={20} className="flex-shrink-0" />
                  <span>Free Express Shipping applied on orders over $100</span>
                </div>
                <div className="flex items-center gap-3 p-3.5 bg-emerald-50/60 rounded-2xl border border-emerald-100 text-xs text-[#0B6B3A] font-medium">
                  <ShieldCheck size={20} className="flex-shrink-0" />
                  <span>100% Satisfaction or 30-Day Money Back Guarantee</span>
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN: ORDER SUMMARY (5 cols) */}
            <div className="lg:col-span-5 xl:col-span-4">
              <div className="rounded-[2rem] bg-white p-6 shadow-xl border border-emerald-900/10 space-y-6 sticky top-6">
                
                <h2 className="font-display text-2xl font-bold text-gray-900 pb-3 border-b border-gray-100">
                  Order Summary
                </h2>

                {/* Promo Code input */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-600 flex items-center gap-1.5">
                    <Tag size={13} className="text-[#0B6B3A]" /> Promo Code
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. BABAJI35"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="flex-1 text-xs px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:border-[#0B6B3A]"
                    />
                    <button className="bg-gray-900 hover:bg-black text-white text-xs font-bold px-4 py-2.5 rounded-xl transition">
                      Apply
                    </button>
                  </div>
                </div>

                {/* Subtotal Calculation Lines */}
                <div className="space-y-3 text-xs font-medium text-gray-600 border-t border-b border-gray-100 py-4">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-bold text-gray-900">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Estimated Shipping</span>
                    <span className="font-bold text-gray-900">
                      {shipping === 0 ? (
                        <span className="text-[#0B6B3A]">FREE</span>
                      ) : (
                        `$${shipping.toFixed(2)}`
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-[#0B6B3A]">
                    <span>Welcome Discount</span>
                    <span className="font-bold">-${discount.toFixed(2)}</span>
                  </div>
                </div>

                {/* Total Line */}
                <div className="flex items-baseline justify-between pt-1">
                  <div>
                    <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Total Amount</p>
                    <p className="text-[10px] text-gray-400">Taxes included</p>
                  </div>
                  <p className="text-3xl font-extrabold text-[#0B6B3A]">
                    ${total.toFixed(2)}
                  </p>
                </div>

                {/* Primary Checkout Action */}
                <div className="pt-2">
                  <Button className="w-full py-3.5 rounded-full bg-[#0B6B3A] hover:bg-[#08522c] text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2">
                    <Lock size={16} /> Proceed to Checkout
                  </Button>
                </div>

                {/* Accepted Payment Badges */}
                <div className="text-center space-y-2 pt-2">
                  <p className="text-[11px] text-gray-400 font-medium">Guaranteed Safe & Secure Checkout</p>
                  <div className="flex justify-center gap-2 text-xs text-gray-500 font-semibold">
                    <span className="px-2 py-1 bg-gray-100 rounded">VISA</span>
                    <span className="px-2 py-1 bg-gray-100 rounded">MC</span>
                    <span className="px-2 py-1 bg-gray-100 rounded">AMEX</span>
                    <span className="px-2 py-1 bg-gray-100 rounded">PAYPAL</span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        ) : (
          /* EMPTY CART STATE */
          <div className="max-w-md mx-auto text-center py-16 px-6 bg-white rounded-3xl shadow-sm border border-gray-100 space-y-4">
            <div className="w-16 h-16 bg-emerald-50 text-[#0B6B3A] rounded-full flex items-center justify-center mx-auto text-2xl">
              🌿
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Your Cart is Empty</h2>
            <p className="text-xs text-gray-500 leading-relaxed">
              Looks like you haven't added any organic herbal blends or wellness oils to your cart yet.
            </p>
            <a href="/shop" className="inline-block pt-2">
              <Button className="rounded-full bg-[#0B6B3A] hover:bg-[#08522c] text-white px-8 py-3 text-xs font-bold shadow-md transition">
                Explore Botanical Shop
              </Button>
            </a>
          </div>
        )}
      </section>

    </div>
  );
}