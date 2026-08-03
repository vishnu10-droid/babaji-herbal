import React, { useState } from "react";
import {
  Star,
  Play,
  Mail,
  Phone,
  MapPin,
  Search,
  Eye,
  X,
  Filter,
  CheckCircle2,
  Users,
  Award,
  Leaf,
  Share2,
} from "lucide-react";

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedImage, setSelectedImage] = useState(null);

  // Gallery categories
  const categories = [
    "All",
    "Herbal Oils",
    "Ayurvedic Blends",
    "Organic Farms",
    "Extracts",
    "Packaging",
  ];

  // Gallery items with category metadata
  const galleryItems = [
    {
      id: 1,
      title: "Pure Herbal Extraction Dropper",
      category: "Herbal Oils",
      image:
        "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=80",
      desc: "Cold-pressed essential botanical extracts rich in natural bio-actives.",
    },
    {
      id: 2,
      title: "Traditional Herbal Tea Preparation",
      category: "Ayurvedic Blends",
      image:
        "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&w=800&q=80",
      desc: "Hand-blended Ayurvedic herbs designed for calming daily tea rituals.",
    },
    {
      id: 3,
      title: "Senior Wellness & Oil Application",
      category: "Herbal Oils",
      image:
        "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=800&q=80",
      desc: "Sustainably produced therapeutic formulations for natural joint care.",
    },
    {
      id: 4,
      title: "Skincare Essential Tincture",
      category: "Extracts",
      image:
        "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80",
      desc: "Concentrated plant extracts targeted for deep skin nourishment.",
    },
    {
      id: 5,
      title: "Raw Organic Leaves & Salves",
      category: "Organic Farms",
      image:
        "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80",
      desc: "Freshly harvested leaves from certified organic herbal farms.",
    },
    {
      id: 6,
      title: "Precision Formula Dosing",
      category: "Extracts",
      image:
        "https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?auto=format&fit=crop&w=800&q=80",
      desc: "Rigorous quality check and measurement for every batch produced.",
    },
    {
      id: 7,
      title: "Herbal Bath Salts & Soaks",
      category: "Ayurvedic Blends",
      image:
        "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80",
      desc: "Aromatic botanical salt blends for stress relief and detox.",
    },
    {
      id: 8,
      title: "Amber Glass Dropper Packaging",
      category: "Packaging",
      image:
        "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80",
      desc: "UV-protected eco-friendly glass bottles keeping extracts fresh.",
    },
    {
      id: 9,
      title: "Botanical Infusion Oils",
      category: "Herbal Oils",
      image:
        "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&w=800&q=80",
      desc: "Multi-herb infused oils crafted using classical decoction techniques.",
    },
  ];

  // Videos
  const videoItems = [
    {
      id: 1,
      title: "Ayurvedic Herbal Oil Extractions & Process",
      author: "Posted by Babaji Studio",
      image:
        "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: 2,
      title: "Essential Oil In A Small Bottle: Nature Focus",
      author: "Posted by Pure Health",
      image:
        "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: 3,
      title: "Botanical Remedy Concept & Quality Control",
      author: "Posted by Green Lab",
      image:
        "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80",
    },
  ];

  // Footer thumbnail gallery
  const footerGallery = [
    "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=200&q=80",
    "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&w=200&q=80",
    "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=200&q=80",
    "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=200&q=80",
    "https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?auto=format&fit=crop&w=200&q=80",
    "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=200&q=80",
  ];

  const filteredItems =
    activeCategory === "All"
      ? galleryItems
      : galleryItems.filter((item) => item.category === activeCategory);

  return (
    <div className="bg-white font-sans text-gray-700 min-h-screen">
      
      {/* HERO BANNER */}
      <section
        className="relative bg-cover bg-center py-20 md:py-28 px-6 text-white"
        style={{
          backgroundImage: `linear-gradient(rgba(11, 107, 58, 0.85), rgba(0, 0, 0, 0.75)), url('https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=1200&q=80')`,
        }}
      >
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            Gallery
          </h1>
          <p className="text-sm md:text-base text-gray-200 leading-relaxed max-w-2xl mx-auto font-normal">
            Explore our visual showcase of pure organic cultivation, authentic Ayurvedic extraction techniques, and sustainable herbal formulations crafted at Babaji Herbals.
          </p>
          <p className="text-xs md:text-sm tracking-wider uppercase font-semibold text-gray-300 pt-2">
            <span>HOME</span> <span className="text-amber-400">/ GALLERY</span>
          </p>
        </div>
      </section>

      {/* FILTER TABS & SEARCH SECTION (EXTRA CONTENT) */}
      <section className="max-w-6xl mx-auto px-4 pt-12 pb-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-gray-100 pb-6">
          
          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-300 ${
                  activeCategory === cat
                    ? "bg-[#0B6B3A] text-white shadow-md scale-105"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Quick Counter */}
          <div className="text-xs font-semibold text-gray-500 bg-emerald-50 text-[#0B6B3A] px-4 py-2 rounded-full border border-emerald-100 flex items-center gap-2">
            <Leaf size={14} /> Showing {filteredItems.length} Gallery Media
          </div>
        </div>
      </section>

      {/* MAIN GALLERY GRID */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="group relative bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              {/* Image Container */}
              <div className="relative h-64 overflow-hidden bg-gray-100">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                />
                
                {/* Overlay Badge */}
                <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-[#0B6B3A] text-[10px] font-extrabold px-3 py-1 rounded-full shadow-sm">
                  {item.category}
                </span>

                {/* Hover Quick View Action */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center gap-3">
                  <button
                    onClick={() => setSelectedImage(item)}
                    className="w-10 h-10 bg-amber-400 text-gray-900 rounded-full flex items-center justify-center shadow-lg hover:bg-amber-500 hover:scale-110 transition"
                    title="View Photo"
                  >
                    <Eye size={18} />
                  </button>
                </div>
              </div>

              {/* Card Footer Text */}
              <div className="p-5 bg-white">
                <h3 className="font-bold text-gray-900 text-base mb-1 line-clamp-1 group-hover:text-[#0B6B3A] transition">
                  {item.title}
                </h3>
                <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* RATING HIGHLIGHT BANNER (NO. 1 CBD/HERBAL SPECIALIST) */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <div className="bg-amber-400 rounded-3xl p-6 md:p-8 shadow-md flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          
          <div className="flex items-center gap-5 z-10">
            <div className="w-16 h-16 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center text-3xl shadow-sm flex-shrink-0">
              🌿
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-gray-900">
                No.1 Herbal Specialist
              </h2>
              <p className="text-xs font-semibold text-gray-800 max-w-xl mt-1 leading-relaxed">
                100% pure, natural Ayurvedic formulations. Free from preservatives, additives, or synthetic chemical carriers. Certified organic.
              </p>
            </div>
          </div>

          <div className="flex flex-col items-start md:items-end z-10 flex-shrink-0 border-t md:border-t-0 border-black/10 pt-4 md:pt-0 w-full md:w-auto">
            <div className="flex items-center gap-1 text-gray-900 font-extrabold text-sm mb-1">
              <span>Rated 4.9 / 5</span>
              <div className="flex text-emerald-900 ml-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill="currentColor" />
                ))}
              </div>
            </div>
            <p className="text-[11px] text-gray-900 font-medium">
              Based on 2,400+ Trustpilot & customer reviews
            </p>
          </div>

        </div>
      </section>

      {/* NATURE & ORGANIC VIDEOS SECTION */}
      <section className="max-w-6xl mx-auto px-4 pb-20">
        <div className="flex justify-between items-end mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#0B6B3A]">
              ORGANIC IS THE WAY TO GO
            </span>
            <h2 className="text-3xl font-extrabold text-gray-900 mt-1">
              Nature & Organic Videos
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {videoItems.map((vid) => (
            <div
              key={vid.id}
              className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition duration-300"
            >
              <div className="relative h-48 overflow-hidden group cursor-pointer">
                <img
                  src={vid.image}
                  alt={vid.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <div className="w-12 h-12 bg-white text-[#0B6B3A] rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition">
                    <Play size={20} className="fill-current ml-0.5" />
                  </div>
                </div>
              </div>
              <div className="p-5">
                <h4 className="font-bold text-gray-900 text-sm mb-1 line-clamp-2">
                  {vid.title}
                </h4>
                <p className="text-xs text-gray-400 font-medium">
                  {vid.author}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* REFER YOUR FRIENDS BANNER */}
      <section className="max-w-6xl mx-auto px-4 pb-20">
        <div className="bg-gray-50 border border-gray-100 rounded-3xl p-8 md:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center shadow-sm">
          
          {/* Circular Discount Graphic */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-full border-4 border-amber-400 p-2 flex items-center justify-center bg-white shadow-md">
              <div className="w-full h-full rounded-full overflow-hidden relative">
                <img
                  src="https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=600&q=80"
                  alt="Herbal Dropper Bottle"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Floating Discount Badge */}
              <div className="absolute -top-2 -left-2 bg-amber-400 text-gray-900 rounded-full w-20 h-20 flex flex-col items-center justify-center font-extrabold text-xs shadow-lg leading-tight text-center border-2 border-white">
                <span>Refer &</span>
                <span className="text-sm text-[#0B6B3A]">20% OFF</span>
              </div>
            </div>
          </div>

          {/* Referral Text & Form */}
          <div className="lg:col-span-7 space-y-4">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight">
              Refer Your Friends, <br />
              Get <span className="text-[#0B6B3A]">30% Discount!</span>
            </h2>
            <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
              Use your referral link to earn a 30% discount code. When your friends order from our organic shop, you both get instant store rewards!
            </p>

            <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm max-w-md space-y-3">
              <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                Referral code and update will be sent to your email
              </p>
              <form className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  placeholder="Enter Your Email Address..."
                  className="flex-1 px-4 py-2.5 rounded-xl text-xs bg-gray-50 border border-gray-200 text-gray-800 focus:outline-none focus:border-[#0B6B3A]"
                />
                <button
                  type="submit"
                  className="bg-[#0B6B3A] hover:bg-[#08522c] text-white text-xs font-bold px-5 py-2.5 rounded-xl transition flex-shrink-0"
                >
                  Get Invite Link
                </button>
              </form>
            </div>
          </div>

        </div>
      </section>

      {/* ADDITIONAL CONTENT: HERBAL GALLERY METRICS */}
      <section className="max-w-6xl mx-auto px-4 pb-20">
        <div className="bg-[#0B6B3A] text-white rounded-3xl p-8 md:p-10 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="space-y-1">
            <h3 className="text-3xl font-extrabold text-amber-400">100%</h3>
            <p className="text-xs text-gray-200 font-medium">Certified Organic Formulations</p>
          </div>
          <div className="space-y-1">
            <h3 className="text-3xl font-extrabold text-amber-400">150+</h3>
            <p className="text-xs text-gray-200 font-medium">Ayurvedic Formulations</p>
          </div>
          <div className="space-y-1">
            <h3 className="text-3xl font-extrabold text-amber-400">50K+</h3>
            <p className="text-xs text-gray-200 font-medium">Satisfied Herbal Wellness Users</p>
          </div>
          <div className="space-y-1">
            <h3 className="text-3xl font-extrabold text-amber-400">0%</h3>
            <p className="text-xs text-gray-200 font-medium">Chemical Additives / Parabens</p>
          </div>
        </div>
      </section>

      {/* LIGHTBOX MODAL FOR PREVIEWING IMAGES */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl overflow-hidden max-w-2xl w-full relative shadow-2xl animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 bg-gray-900/60 hover:bg-gray-900 text-white rounded-full p-2 transition z-10"
            >
              <X size={18} />
            </button>
            <div className="h-80 bg-gray-100 overflow-hidden">
              <img
                src={selectedImage.image}
                alt={selectedImage.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6">
              <span className="text-[10px] uppercase font-extrabold tracking-wider bg-emerald-100 text-[#0B6B3A] px-3 py-1 rounded-full">
                {selectedImage.category}
              </span>
              <h3 className="text-xl font-bold text-gray-900 mt-2 mb-2">
                {selectedImage.title}
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                {selectedImage.desc}
              </p>
            </div>
          </div>
        </div>
      )}


    </div>
  );
}