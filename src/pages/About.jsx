import React from 'react';
import { 
  CheckCircle, 
  Play, 
  Star, 
  ChevronLeft, 
  ChevronRight, 
  ShieldCheck, 
  Award, 
  Truck, 
  Clock, 
  PhoneCall, 
  Mail, 
  MapPin 
} from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">

      {/* ------------------ 1. HERO BANNER SECTION ------------------ */}
     <section
  className="relative h-72 md:h-96 bg-cover bg-center flex items-center justify-center text-white"
  style={{
    backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.7), rgba(0,0,0,0.3)), url('https://images.unsplash.com/photo-1603909223429-69bb7101f420?auto=format&fit=crop&q=80')`,
  }}
>
  {/* Optional Dark Overlay */}
  <div className="absolute inset-0 bg-black/30"></div>

  {/* Center Content */}
  <div className="relative z-10 text-center px-4">
    <h1 className="text-4xl md:text-6xl font-bold tracking-wide">
      About Us
    </h1>

    <p className="mt-4 text-lg md:text-xl text-gray-200 max-w-2xl mx-auto">
      Discover the journey of <span className="font-semibold text-emerald-400">Babaji Herbals</span>,
      where Ayurveda meets modern wellness to create natural, trusted, and
      effective healthcare solutions.
    </p>

 
  </div>
</section>
      {/* ------------------ 2. ABOUT CERTIFIED PRODUCTS SECTION ------------------ */}
      <section className="max-w-6xl mx-auto px-6 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Media Collage */}
          <div className="relative">
            <div className="relative z-10 rounded-3xl overflow-hidden shadow-xl border-4 border-white max-w-md">
              <img 
                src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80" 
                alt="Lab Specialist" 
                className="w-full h-80 object-cover"
              />
            </div>
            
            {/* Overlapping Video Thumbnail */}
            <div className="absolute -bottom-10 -right-2 md:right-10 z-20 w-52 md:w-64 rounded-2xl overflow-hidden shadow-2xl border-4 border-white group cursor-pointer">
              <img 
                src="https://images.unsplash.com/photo-1536939459926-301728717817?auto=format&fit=crop&q=80" 
                alt="Product video preview" 
                className="w-full h-36 object-cover"
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/40 transition">
                <div className="w-12 h-12 rounded-full bg-white text-emerald-600 flex items-center justify-center shadow-lg">
                  <Play className="fill-current ml-1" size={20} />
                </div>
              </div>
            </div>
          </div>

          {/* Right Content */}
          <div className="space-y-6 pt-6 lg:pt-0">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
              High Quality & Certified
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight">
              We Provide High Quality And Certified Products
            </h2>
            <p className="text-slate-600 leading-relaxed text-sm">
              We offer premium, lab-tested natural herbal solutions designed for optimum purity and effectiveness. Our dedicated approach guarantees consistency across every step.
            </p>
            
            <ul className="space-y-3 pt-2">
              <li className="flex items-center gap-3 text-slate-700 font-medium text-sm">
                <CheckCircle className="text-emerald-500 shrink-0" size={18} />
                100% Certified Organic Materials
              </li>
              <li className="flex items-center gap-3 text-slate-700 font-medium text-sm">
                <CheckCircle className="text-emerald-500 shrink-0" size={18} />
                Third-Party Tested & Approved
              </li>
              <li className="flex items-center gap-3 text-slate-700 font-medium text-sm">
                <CheckCircle className="text-emerald-500 shrink-0" size={18} />
                Fast & Secure Nationwide Delivery
              </li>
            </ul>
          </div>
        </div>

        {/* Yellow Banner Card */}
        <div className="mt-16 bg-amber-400 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-amber-500 shadow-md shrink-0">
              <Award size={32} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">No.1 Herbal Specialist</h3>
              <p className="text-xs text-slate-800 mt-1 max-w-md">
                Recognized worldwide for exceptional quality and authentic natural formulations.
              </p>
            </div>
          </div>
          
          <div className="bg-slate-900 text-white rounded-xl p-4 flex items-center gap-3 shrink-0">
            <div className="flex flex-col">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} className="fill-current" />
                ))}
              </div>
              <span className="text-xs text-slate-300 mt-1">Trustpilot 4.9 Rating</span>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------ 3. GREAT RESULTS SECTION ------------------ */}
      <section className="bg-slate-100/70 py-16 md:py-24 border-y border-slate-200">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 bg-white border border-emerald-200 px-3 py-1 rounded-full">
            Proven Benefits
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mt-3 mb-12">
            Great Results In Improving Well-Being
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center text-left">
            
            {/* Feature List */}
            <div className="space-y-6">
              {[
                { title: 'Choose Your Product', desc: 'Browse our curated collection of lab-grade pure herbal extracts and oils.' },
                { title: 'Place Your Order', desc: 'Seamlessly checkout with encrypted processing and custom packaging.' },
                { title: 'Deliver Your Goods', desc: 'Fast turnaround time with live tracking straight to your doorstep.' },
              ].map((step, idx) => (
                <div key={idx} className="flex gap-4 p-4 rounded-xl bg-white shadow-sm border border-slate-100 hover:shadow-md transition">
                  <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-600 font-bold flex items-center justify-center shrink-0">
                    0{idx + 1}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">{step.title}</h4>
                    <p className="text-xs text-slate-500 mt-1">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Circular Product Showcase */}
            <div className="relative flex justify-center">
              <div className="relative w-80 h-80 md:w-96 md:h-96 rounded-full overflow-hidden border-8 border-white shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&q=80" 
                  alt="Herbal Product" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------ 4. MEET OUR EXPERTS & STATS SECTION ------------------ */}
      <section className="max-w-6xl mx-auto px-6 py-16 md:py-24">
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
            Professional Team
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mt-3">
            Meet Our Experts
          </h2>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { name: 'Dr. Jane Walker', role: 'Chief Botanist', img: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80' },
            { name: 'Robert Smith', role: 'Lab Director', img: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80' },
            { name: 'Michael Adams', role: 'R&D Specialist', img: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80' },
            { name: 'Elena Rostova', role: 'Quality Control', img: 'https://images.unsplash.com/photo-1594824813566-78a952722610?auto=format&fit=crop&q=80' },
          ].map((member, i) => (
            <div key={i} className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-lg transition text-center p-4">
              <div className="rounded-xl overflow-hidden h-48 mb-4 bg-amber-100">
                <img src={member.img} alt={member.name} className="w-full h-full object-cover" />
              </div>
              <h4 className="font-bold text-slate-900">{member.name}</h4>
              <p className="text-xs text-emerald-600 font-medium">{member.role}</p>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 pt-10 border-t border-slate-200 text-center">
          {[
            { value: '5+', label: 'Years Experience' },
            { value: '233+', label: 'Products Tested' },
            { value: '26+', label: 'Expert Staff' },
            { value: '1k+', label: 'Happy Customers' },
          ].map((stat, idx) => (
            <div key={idx} className="p-4">
              <p className="text-3xl md:text-4xl font-extrabold text-emerald-600">{stat.value}</p>
              <p className="text-xs text-slate-500 mt-1 uppercase font-semibold">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ------------------ 5. HIGH STANDARD SOLUTIONS SECTION ------------------ */}
      <section className="bg-slate-900 text-white py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 bg-emerald-950 border border-emerald-800 px-3 py-1 rounded-full">
            Uncompromising Standards
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold mt-3 mb-16">
            High Standard And Quality Solutions
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            
            {/* Left Column Features */}
            <div className="space-y-8 text-center md:text-right">
              <div>
                <h4 className="font-bold text-lg text-emerald-400">Pure Organic Harvest</h4>
                <p className="text-xs text-slate-400 mt-1">Cultivated strictly without synthetic pesticides or chemicals.</p>
              </div>
              <div>
                <h4 className="font-bold text-lg text-emerald-400">Cold-Pressed Extraction</h4>
                <p className="text-xs text-slate-400 mt-1">Retaining natural potency and profile throughout the processing.</p>
              </div>
            </div>

            {/* Center Product Bottle */}
            <div className="flex justify-center my-6 md:my-0">
              <div className="w-56 h-72 rounded-3xl bg-emerald-950/40 p-4 border border-emerald-800/50 flex items-center justify-center shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&q=80" 
                  alt="Bottle product" 
                  className="max-h-full object-contain"
                />
              </div>
            </div>

            {/* Right Column Features */}
            <div className="space-y-8 text-center md:text-left">
              <div>
                <h4 className="font-bold text-lg text-emerald-400">Lab Batch Testing</h4>
                <p className="text-xs text-slate-400 mt-1">Verified for safety, concentration, and guaranteed authenticity.</p>
              </div>
              <div>
                <h4 className="font-bold text-lg text-emerald-400">Eco-Friendly Packaging</h4>
                <p className="text-xs text-slate-400 mt-1">Recyclable containers ensuring sustainable ecological footprint.</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ------------------ 6. CUSTOMER REVIEWS & BRANDS ------------------ */}
      <section className="max-w-6xl mx-auto px-6 py-16 md:py-24">
        
        {/* Header with Navigation Buttons */}
        <div className="flex justify-between items-end mb-10">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
              Testimonials
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mt-2">
              What Our Customers Say
            </h2>
          </div>
          <div className="flex gap-2">
            <button className="w-10 h-10 rounded-full border border-slate-300 flex items-center justify-center hover:bg-slate-100 transition">
              <ChevronLeft size={20} />
            </button>
            <button className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow hover:bg-emerald-700 transition">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Testimonial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              title: "Best Product I Have Ever Used",
              text: "The pure quality and consistency is unlike anything else I've tried. Highly recommended for daily wellness.",
              author: "Alex Rivera",
              img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80"
            },
            {
              title: "Best Tasting Oil Ever",
              text: "Smooth taste, fast delivery, and standard packaging. Will definitely continue reordering every month.",
              author: "Sarah Jenkins",
              img: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80"
            }
          ].map((review, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
              <div className="flex text-amber-400 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} className="fill-current" />
                ))}
              </div>
              <h4 className="font-bold text-slate-900 mb-2">{review.title}</h4>
              <p className="text-xs text-slate-600 leading-relaxed mb-6">{review.text}</p>
              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <img src={review.img} alt={review.author} className="w-10 h-10 rounded-full object-cover" />
                <span className="font-bold text-xs text-slate-900">{review.author}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Brand Logos */}
        <div className="mt-16 pt-10 border-t border-slate-200">
          <p className="text-center text-xs font-bold uppercase tracking-widest text-slate-400 mb-8">
            Featured Popular Brands
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60">
            {['PURE', 'HERBAL', 'NATURAL', 'ORGANIC', 'BIO'].map((brand, i) => (
              <span key={i} className="text-xl font-black text-slate-700 tracking-wider">
                🌿 {brand}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------ 7. CTA / PROMO BANNER ------------------ */}
      <section className="bg-emerald-900 text-white my-12 rounded-3xl mx-6 max-w-6xl md:mx-auto overflow-hidden relative shadow-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 items-center">
          <div className="p-8 md:p-14 space-y-6">
            <h2 className="text-3xl md:text-4xl font-extrabold leading-tight">
              What Product Is For Me?
            </h2>
            <p className="text-emerald-200 text-sm">
              Take our quick 2-minute assessment quiz to discover tailored formulations crafted for your individual routine.
            </p>
            <button className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-6 py-3 rounded-full text-sm transition shadow-lg">
              Get Started Now
            </button>
          </div>
          <div className="h-64 md:h-full min-h-[300px] relative">
            <img 
              src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80" 
              alt="Woman holding plant" 
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

   

    </div>
  );
}