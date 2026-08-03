import React, { useState } from 'react';
import { Star, ShoppingCart, Heart, Phone, Mail, MapPin } from 'lucide-react';

export default function ShopDetailsPage() {
  const [selectedImg, setSelectedImg] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const images = [
    'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80',
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      {/* ------------------ 1. PAGE TITLE BANNER ------------------ */}
      <section
  className="relative h-64 md:h-80 bg-cover bg-center flex items-center justify-center px-8 md:px-20 text-white"
  style={{
    backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.7), rgba(0,0,0,0.4)), url('https://images.unsplash.com/photo-1603909223429-69bb7101f420?auto=format&fit=crop&q=80')`,
  }}
>
  <div className="max-w-2xl text-center">
    <h1 className="text-4xl md:text-5xl font-bold mb-4">
      Shop Details
    </h1>

    <p className="text-sm md:text-base text-gray-200 mt-3 max-w-xl mx-auto">
  Explore our premium herbal products made with natural ingredients for a healthier and happier lifestyle.
</p>
  </div>
</section>

      {/* ------------------ 2. PRODUCT DETAILS SECTION ------------------ */}
      <section className="max-w-6xl mx-auto px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* Left - Image Gallery */}
          <div className="space-y-4">
            <div className="bg-amber-50/60 rounded-3xl p-8 flex items-center justify-center border border-amber-100/50 shadow-sm">
              <img
                src={images[selectedImg]}
                alt="Product main"
                className="max-h-80 object-contain drop-shadow-xl"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImg(idx)}
                  className={`bg-slate-100 rounded-2xl p-4 border-2 transition flex items-center justify-center ${
                    selectedImg === idx ? 'border-emerald-600 bg-white shadow-md' : 'border-transparent hover:border-slate-300'
                  }`}
                >
                  <img src={img} alt={`Thumb ${idx}`} className="h-16 object-contain" />
                </button>
              ))}
            </div>
          </div>

          {/* Right - Product Information */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
                Available
              </span>
              <div className="flex items-center text-amber-400 gap-1 text-xs">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} className="fill-current" />
                ))}
                <span className="text-slate-500 font-medium ml-1">(5 Reviews)</span>
              </div>
            </div>

            <h2 className="text-3xl font-extrabold text-slate-900 leading-tight">
              Naturecan Hemp Tea Blend 20 bags
            </h2>

            <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">
              Category: <span className="text-slate-700">Oils / Herbs</span>
            </p>

            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-slate-900">$19.85</span>
              <span className="text-sm text-slate-400 line-through">$22.50</span>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold text-slate-700 uppercase">Quantity:</span>
              <div className="flex items-center border border-slate-200 rounded-lg bg-white overflow-hidden shadow-sm">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 font-bold transition"
                >
                  -
                </button>
                <span className="px-4 py-1.5 text-sm font-semibold text-slate-800">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 font-bold transition"
                >
                  +
                </button>
              </div>
            </div>

            {/* Countdown Deal Timer */}
            <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
              <p className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-2">
                Guaranteed Best Deal Ends In:
              </p>
              <div className="grid grid-cols-4 gap-2 text-center">
                {[
                  { value: '03', label: 'DAYS' },
                  { value: '09', label: 'HOURS' },
                  { value: '00', label: 'MINS' },
                  { value: '03', label: 'SECS' },
                ].map((time, idx) => (
                  <div key={idx} className="bg-white rounded-lg p-2 shadow-sm border border-amber-100">
                    <span className="block text-lg font-extrabold text-slate-900">{time.value}</span>
                    <span className="text-[10px] font-bold text-slate-400">{time.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-2">
              <button className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-6 rounded-xl transition shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 text-sm">
                <ShoppingCart size={18} /> Add To Cart
              </button>
              <button className="p-3.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 transition shadow-sm">
                <Heart size={18} />
              </button>
            </div>

            {/* Meta */}
            <div className="pt-4 border-t border-slate-200 text-xs text-slate-500 space-y-1">
              <p><strong className="text-slate-700">SKU:</strong> Premium-12</p>
              <p><strong className="text-slate-700">Tags:</strong> Featured, Products, Natural</p>
            </div>
          </div>
        </div>

        {/* ------------------ 3. DESCRIPTION SECTION ------------------ */}
        <div className="mt-16 space-y-4">
          <h3 className="text-2xl font-bold text-slate-900">Description</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Our premium herbal tea blends are meticulously sourced from top-tier organic farms. Designed to bring balance and revitalization to your daily routine, each tea bag delivers rich aromas and pure plant extracts verified by accredited third-party laboratories.
          </p>
          <p className="text-xs text-slate-600 leading-relaxed">
            Enjoy the full spectrum of natural terpenes and botanical benefits without artificial colors or preservatives. Ideal for evening relaxation or morning calm.
          </p>
        </div>

        {/* ------------------ 4. BENEFITS & SIDE EFFECTS ------------------ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
          {/* Benefits Box */}
          <div className="bg-emerald-50/80 rounded-2xl p-6 border border-emerald-100">
            <h4 className="text-lg font-bold text-emerald-950 mb-4">Benefits</h4>
            <ul className="space-y-2 text-xs text-emerald-900">
              <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Soothing periodic relaxation and tension relief.</li>
              <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Formulated with 100% natural organic extracts.</li>
              <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Lab-tested for guaranteed safety and purity.</li>
              <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Free from synthetic fillers and artificial flavors.</li>
            </ul>
          </div>

          {/* Side Effects Box */}
          <div className="bg-amber-50/80 rounded-2xl p-6 border border-amber-100">
            <h4 className="text-lg font-bold text-amber-950 mb-4">Side Effects</h4>
            <ul className="space-y-2 text-xs text-amber-900">
              <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-amber-500"></span> Temporary mild drowsiness if consumed in excess.</li>
              <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-amber-500"></span> Slight dry mouth symptom.</li>
              <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-amber-500"></span> Consult a medical specialist if taking prescriptions.</li>
            </ul>
          </div>
        </div>

        {/* ------------------ 5. ADDITIONAL INFORMATION ------------------ */}
        <div className="mt-12 space-y-4">
          <h3 className="text-2xl font-bold text-slate-900 mb-6">Additional information</h3>
          <div className="space-y-3">
            {[
              { label: 'Weight', value: '0.2 kg' },
              { label: 'Dimensions', value: '20 x 12 x 5 cm' },
              { label: 'Weight Options', value: '0.4kg, 1.2kg, 1.8kg, 2.4kg, 3.0kg, 5kg' },
            ].map((info, i) => (
              <div key={i} className="flex bg-slate-100/70 rounded-xl p-3 text-xs">
                <span className="w-36 font-bold text-slate-800">{info.label}</span>
                <span className="text-slate-600">{info.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ------------------ 6. REVIEWS SECTION ------------------ */}
        <div className="mt-16 space-y-6">
          <h3 className="text-2xl font-bold text-slate-900">Reviews</h3>
          
          <div className="space-y-4">
            {[
              { name: 'David Mortensen', date: 'January 5, 2026', text: 'Exceptional blend quality! Fast shipping and very protective packaging. Highly recommend.', img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80' },
              { name: 'Thomas Walker', date: 'January 12, 2026', text: 'Tastes fresh and natural. A noticeable improvement in my evening tea routine.', img: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80' },
            ].map((rev, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex gap-4 items-start">
                <img src={rev.img} alt={rev.name} className="w-12 h-12 rounded-full object-cover shrink-0" />
                <div className="flex-1 space-y-1">
                  <div className="flex justify-between items-center">
                    <h5 className="font-bold text-slate-900 text-sm">{rev.name}</h5>
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} className="fill-current" />
                      ))}
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-400 font-medium">{rev.date}</p>
                  <p className="text-xs text-slate-600 pt-1">{rev.text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Add Review Form */}
          <div className="bg-slate-100/70 rounded-2xl p-6 md:p-8 mt-8 border border-slate-200/60">
            <div className="flex justify-between items-center mb-6">
              <h4 className="text-lg font-bold text-slate-900">Add Reviews</h4>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-medium">Select Rating:</span>
                <div className="flex text-slate-300 cursor-pointer">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} className="hover:text-amber-400 hover:fill-amber-400 transition" />
                  ))}
                </div>
              </div>
            </div>

            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Full Name"
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs outline-none focus:border-emerald-500 transition shadow-sm"
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs outline-none focus:border-emerald-500 transition shadow-sm"
                />
              </div>
              <textarea
                rows={4}
                placeholder="Your Review"
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs outline-none focus:border-emerald-500 transition shadow-sm resize-none"
              ></textarea>
              <button className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-6 py-3 rounded-xl transition shadow-md">
                Post Review
              </button>
            </form>
          </div>
        </div>

        {/* ------------------ 7. RELATED PRODUCTS SECTION ------------------ */}
        <div className="mt-20">
          <h3 className="text-2xl font-bold text-slate-900 mb-8">Related Products</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: 'Full Spectrum Hemp Extract 1000 mg 30 ml', price: '$30.00', status: 'Out of Stock', img: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80' },
              { name: 'Naturecan Hemp Tea Blend 20 bags', price: '$28.00', status: '', img: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&q=80' },
              { name: 'Vintage Hemp Extract Liquid', price: '$30.00', status: 'Out of Stock', img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80' },
              { name: 'Naturecan Hemp Tea Blend', price: '$28.00', status: '', img: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80' },
            ].map((prod, i) => (
              <div key={i} className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm hover:shadow-md transition flex flex-col justify-between group relative">
                {prod.status && (
                  <span className="absolute top-3 left-3 bg-emerald-500 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full z-10">
                    {prod.status}
                  </span>
                )}
                <div className="bg-amber-50/50 rounded-xl p-4 flex items-center justify-center mb-4 h-48">
                  <img src={prod.img} alt={prod.name} className="max-h-full object-contain group-hover:scale-105 transition duration-300" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-amber-500 tracking-wider">Hemp Extract</span>
                  <h5 className="font-bold text-slate-900 text-xs mt-1 line-clamp-2">{prod.name}</h5>
                  <div className="flex items-center justify-between mt-3">
                    <span className="font-extrabold text-slate-900 text-sm">{prod.price}</span>
                    <button className="w-8 h-8 rounded-full bg-amber-400 text-slate-900 flex items-center justify-center hover:bg-amber-500 transition shadow-sm">
                      <ShoppingCart size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

     
    </div>
  );
}