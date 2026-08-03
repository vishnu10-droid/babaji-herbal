import React from "react";
import {
  Award,
  Sprout,
  Users,
  ShieldCheck,
  Star,
  Play,
  Mail,
  Phone,
  MapPin,
  CheckCircle2,
} from "lucide-react";

export default function HistoryPage() {
  const stats = [
    {
      icon: <Award className="w-8 h-8 text-[#0B6B3A]" />,
      count: "15+",
      label: "Award Winning In Various Fields",
    },
    {
      icon: <Sprout className="w-8 h-8 text-[#0B6B3A]" />,
      count: "131+",
      label: "Acres Organic Farms Maintained",
    },
    {
      icon: <ShieldCheck className="w-8 h-8 text-[#0B6B3A]" />,
      count: "150+",
      label: "Certified Herbal Products",
    },
    {
      icon: <Users className="w-8 h-8 text-[#0B6B3A]" />,
      count: "50k+",
      label: "Happy Customers Globally",
    },
  ];

  const timelineEvents = [
    {
      year: "2016",
      title: "How It Began",
      desc: "Babaji Herbals started with a vision to bring authentic, high-purity Ayurvedic remedies and natural wellness blends to homes everywhere.",
      image:
        "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=600&q=80",
    },
    {
      year: "2018",
      title: "Organic Farming",
      bullets: [
        "100% Organic Soil & Harvesting",
        "Premium Essential Oils & Extracts",
        "Zero Chemical Pesticides",
      ],
      desc: "Expanded our direct herbal cultivation partnerships to maintain complete purity control from farm to formulation.",
      image:
        "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&w=600&q=80",
    },
    {
      year: "2020",
      title: "Standardized Formulations",
      desc: "Integrated state-of-the-art botanical extraction methods while retaining age-old Ayurvedic principles.",
      image:
        "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80",
    },
    {
      year: "2024",
      title: "High-Quality Produce",
      desc: "Delivering pure, eco-friendly Ayurvedic blends across the world with certified quality standard compliance.",
      image:
        "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=600&q=80",
    },
  ];

  const brands = [
    "PURE CANNABO",
    "ORGANIC HERB",
    "HERBAL LIFE",
    "CANNABIS",
    "PURE LEAF",
    "MARIJUANA",
  ];

  const galleryImages = [
    "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=200&q=80",
    "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&w=200&q=80",
    "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=200&q=80",
    "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=200&q=80",
    "https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?auto=format&fit=crop&w=200&q=80",
    "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=200&q=80",
  ];

  return (
    <div className="bg-white font-sans text-gray-700 min-h-screen">
     <section
      className="relative bg-cover bg-center py-20 md:py-28 px-6 text-white"
      style={{
        backgroundImage: `linear-gradient(rgba(11, 107, 58, 0.85), rgba(0, 0, 0, 0.75)), url('https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=1200&q=80')`,
      }}
    >
      <div className="max-w-3xl mx-auto text-center space-y-4">
        {/* Main Heading */}
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
          History
        </h1>

        {/* Short Descriptive Paragraph */}
        <p className="text-sm md:text-base text-gray-200 leading-relaxed max-w-2xl mx-auto font-normal">
          Rooted in ancient Ayurvedic wisdom and backed by modern natural science, 
          Babaji Herbals has been dedicated to crafting pure, botanical wellness solutions 
          and promoting holistic health for over a decade.
        </p>

       
      </div>
    </section>

      {/* SECTION 1: OUR ACHIEVEMENTS */}
      <section className="max-w-6xl mx-auto px-4 py-16 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Column: Image with Rating Box */}
          <div className="relative">
            <div className="rounded-3xl overflow-hidden shadow-lg border border-gray-100 max-w-md mx-auto lg:mx-0">
              <img
                src="https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=800&q=80"
                alt="Herbal Researcher"
                className="w-full h-[380px] object-cover"
              />
            </div>

            {/* Rating Highlight Box */}
            <div className="mt-4 sm:mt-0 sm:absolute -bottom-8 left-6 bg-amber-400 text-gray-900 rounded-2xl p-5 shadow-xl max-w-xs flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/30 rounded-full flex items-center justify-center font-bold text-xl">
                  🌿
                </div>
                <div>
                  <h4 className="font-extrabold text-sm leading-tight">
                    No.1 Herbal Specialist
                  </h4>
                  <p className="text-xs font-semibold text-gray-800">
                    Babaji Herbals 4.9 / 5
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-emerald-900">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} fill="currentColor" />
                ))}
              </div>
              <p className="text-[11px] text-gray-800 font-medium">
                Based on 2.1k+ verified customer reviews
              </p>
            </div>
          </div>

          {/* Right Column: Achievements Content */}
          <div className="space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#0B6B3A]">
                100% NATURAL & PURE HERBAL LIFE
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-1">
                Our Achievements
              </h2>
            </div>

            <p className="text-sm text-gray-600 leading-relaxed">
              Babaji Herbals has grown into a trusted leader in herbal and Ayurvedic solutions. 
              Our commitment to standardizing natural remedies ensures high potency, safety, and consistent wellness support.
            </p>

            <p className="text-sm text-gray-600 leading-relaxed">
              By combining certified organic farming with modern quality control, we bring you remedies free from harmful chemicals or synthetic additives.
            </p>

            {/* Video Thumbnail Box */}
            <div className="relative rounded-2xl overflow-hidden shadow-md group cursor-pointer border border-gray-100">
              <img
                src="https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=80"
                alt="Video Thumbnail"
                className="w-full h-48 object-cover group-hover:scale-105 transition duration-500"
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <div className="w-14 h-14 bg-white text-[#0B6B3A] rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition">
                  <Play size={24} className="fill-current ml-1" />
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* STATS COUNTER BAR */}
      <section className="bg-gray-50 border-y border-gray-100 py-10">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map((item, idx) => (
            <div key={idx} className="flex flex-col items-center space-y-2 p-2">
              <div className="p-3 bg-green-100/60 rounded-full">
                {item.icon}
              </div>
              <h3 className="text-3xl font-extrabold text-gray-900">
                {item.count}
              </h3>
              <p className="text-xs text-gray-600 font-medium max-w-[180px]">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 2: OUR HISTORY TIMELINE */}
      <section className="max-w-6xl mx-auto px-4 py-16 md:py-24">
        <div className="text-center mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-[#0B6B3A]">
            10 YEARS OF EXPERIENCE
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-1">
            Our History
          </h2>
        </div>

        {/* Vertical Timeline */}
        <div className="relative">
          {/* Middle Line */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 bg-amber-300 -translate-x-1/2"></div>

          <div className="space-y-12 md:space-y-16">
            {timelineEvents.map((event, idx) => (
              <div
                key={idx}
                className="relative flex flex-col md:flex-row items-center justify-between gap-8"
              >
                {/* Year Badge Center */}
                <div className="md:absolute md:left-1/2 md:-translate-x-1/2 z-10 w-16 h-16 bg-[#0B6B3A] text-white font-extrabold text-base rounded-full flex items-center justify-center shadow-lg border-4 border-white">
                  {event.year}
                </div>

                {/* Left Side Content */}
                <div className="w-full md:w-[42%] text-left md:text-right space-y-2 order-2 md:order-1">
                  <h3 className="text-xl font-bold text-gray-900">
                    {event.title}
                  </h3>
                  {event.bullets ? (
                    <ul className="space-y-1.5 text-xs text-gray-600 inline-block text-left">
                      {event.bullets.map((bullet, bIdx) => (
                        <li key={bIdx} className="flex items-center gap-2">
                          <CheckCircle2 size={14} className="text-[#0B6B3A] flex-shrink-0" />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {event.desc}
                    </p>
                  )}
                </div>

                {/* Right Side Image */}
                <div className="w-full md:w-[42%] order-1 md:order-2">
                  <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-md h-48 sm:h-56">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SUBSCRIBE NEWSLETTER BANNER */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <div className="bg-amber-400 rounded-3xl p-8 md:p-12 relative overflow-hidden shadow-lg grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-7 space-y-4">
            <h2 className="text-2xl md:text-4xl font-extrabold text-gray-900 leading-tight">
              Subscribe Newsletter <br />
              For <span className="text-[#0B6B3A]">35% OFF</span> Your First Order
            </h2>
            <p className="text-xs text-gray-800 font-medium">
              Get discount code on email & exclusive herbal wellness promotions.
            </p>

            <form className="flex flex-col sm:flex-row gap-2 max-w-md pt-2">
              <input
                type="email"
                placeholder="Enter your email address..."
                className="flex-1 px-5 py-3 rounded-full text-xs bg-white text-gray-800 border-none focus:outline-none shadow-inner"
              />
              <button
                type="submit"
                className="bg-[#0B6B3A] hover:bg-[#08522c] text-white text-xs font-bold px-6 py-3 rounded-full transition"
              >
                Subscribe Now
              </button>
            </form>
          </div>

          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full h-48 sm:h-56 rounded-2xl overflow-hidden border-2 border-white/50 shadow-md">
              <img
                src="https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&w=600&q=80"
                alt="Herbal Tea Promotion"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

        </div>
      </section>

      {/* FEATURED POPULAR BRANDS */}
      <section className="max-w-6xl mx-auto px-4 py-10 border-t border-gray-100">
        <h3 className="text-center text-xl font-bold text-gray-900 mb-8">
          Featured Popular Brands
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 items-center">
          {brands.map((brand, i) => (
            <div
              key={i}
              className="border border-gray-200 rounded-xl p-4 flex items-center justify-center text-center text-xs font-extrabold tracking-wider text-emerald-800 bg-gray-50/50 hover:border-[#0B6B3A] hover:bg-emerald-50/30 transition cursor-pointer"
            >
              🌿 {brand}
            </div>
          ))}
        </div>
      </section>

   
    </div>
  );
}