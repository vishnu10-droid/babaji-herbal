import React, { useState } from "react";
import {
  Star,
  ShoppingBag,
  Heart,
  Eye,
  Grid,
  List,
  Filter,
  Search,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
} from "lucide-react";

export default function ProductListPage() {
  const [viewMode, setViewMode] = useState("grid");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("Recently Added");

  // Sample Product List Data
  const products = [
    {
      id: 1,
      name: "Exploring Hemp Extract Infused CBD Cream for Skin Care",
      dosage: "CBD 100MG",
      price: "$19.85",
      originalPrice: "$23.85",
      rating: 5,
      reviews: 24,
      image:
        "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=500&q=80",
      category: "Skin Care",
    },
    {
      id: 2,
      name: "A Closer Look at Orange County CBD Strawberry Cheesecake",
      dosage: "CBD 100MG",
      price: "$19.85",
      originalPrice: "$23.85",
      rating: 5,
      reviews: 18,
      image:
        "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=500&q=80",
      category: "Oils",
    },
    {
      id: 3,
      name: "What Makes Orange County CBD Strawberry Cheesecake Special",
      dosage: "CBD 100MG",
      price: "$19.85",
      originalPrice: "$23.85",
      rating: 5,
      reviews: 32,
      image:
        "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=500&q=80",
      category: "Capsules",
    },
    {
      id: 4,
      name: "A Deep Dive into Orange County CBD Strawberry Cheesecake",
      dosage: "CBD 100MG",
      price: "$19.85",
      originalPrice: "$23.85",
      rating: 5,
      reviews: 15,
      image:
        "https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?auto=format&fit=crop&w=500&q=80",
      category: "Capsules",
    },
    {
      id: 5,
      name: "Characteristics of Orange County CBD Strawberry Cheesecake",
      dosage: "CBD 100MG",
      price: "$19.85",
      originalPrice: "$23.85",
      rating: 5,
      reviews: 29,
      image:
        "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&w=500&q=80",
      category: "Oils",
    },
    {
      id: 6,
      name: "Why Orange County CBD Strawberry Cheesecake Stands Out",
      dosage: "CBD 100MG",
      price: "$19.85",
      originalPrice: "$23.85",
      rating: 5,
      reviews: 40,
      image:
        "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=500&q=80",
      category: "Skin Care",
    },
    {
      id: 7,
      name: "Orange County CBD Strawberry Cheesecake Taste Test",
      dosage: "CBD 100MG",
      price: "$19.85",
      originalPrice: "$23.85",
      rating: 5,
      reviews: 12,
      image:
        "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=500&q=80",
      category: "Extracts",
    },
    {
      id: 8,
      name: "An Analysis of Orange County CBD Strawberry Cheesecake",
      dosage: "CBD 100MG",
      price: "$19.85",
      originalPrice: "$23.85",
      rating: 5,
      reviews: 38,
      image:
        "https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?auto=format&fit=crop&w=500&q=80",
      category: "Capsules",
    },
    {
      id: 9,
      name: "A Review of Orange County CBD Strawberry Cheesecake",
      dosage: "CBD 100MG",
      price: "$19.85",
      originalPrice: "$23.85",
      rating: 5,
      reviews: 21,
      image:
        "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=500&q=80",
      category: "Extracts",
    },
    {
      id: 10,
      name: "Orange County CBD Strawberry Cheesecake",
      dosage: "CBD 100MG",
      price: "$19.85",
      originalPrice: "$23.85",
      rating: 5,
      reviews: 19,
      image:
        "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=500&q=80",
      category: "Oils",
    },
  ];

  const categories = ["All", "Oils", "Capsules", "Skin Care", "Extracts"];

  const galleryImages = [
    "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=200&q=80",
    "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&w=200&q=80",
    "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=200&q=80",
    "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=200&q=80",
    "https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?auto=format&fit=crop&w=200&q=80",
    "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=200&q=80",
  ];

  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter((p) => p.category === selectedCategory);

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
            Product List
          </h1>
          <p className="text-sm md:text-base text-gray-200 leading-relaxed max-w-2xl mx-auto font-normal">
            Discover our complete range of certified organic Ayurvedic extracts, herbal tinctures, natural skin remedies, and therapeutic oils.
          </p>
          <p className="text-xs md:text-sm tracking-wider uppercase font-semibold text-gray-300 pt-2">
            <span>HOME</span> <span className="text-amber-400">/ PRODUCT LIST</span>
          </p>
        </div>
      </section>

      {/* FILTER & CONTROL BAR */}
      <section className="max-w-6xl mx-auto px-4 pt-10 pb-6">
        {/* Category Pills & Quick Search */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6 pb-6 border-b border-gray-100">
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition ${
                  selectedCategory === cat
                    ? "bg-[#0B6B3A] text-white shadow-sm"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full text-xs pl-9 pr-4 py-2.5 rounded-full bg-gray-50 border border-gray-200 focus:outline-none focus:border-[#0B6B3A]"
            />
            <Search size={14} className="absolute left-3 top-3 text-gray-400" />
          </div>
        </div>

        {/* Results Counter & View Switcher */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium text-gray-600">
          <p>
            Showing Items <span className="text-[#0B6B3A] font-bold">1–{filteredProducts.length}</span> of <span className="text-gray-900 font-bold">8133</span> results
          </p>

          <div className="flex items-center gap-4">
            {/* Sorting Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-gray-400">Sort By:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-gray-50 border border-gray-200 text-gray-800 text-xs font-semibold rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#0B6B3A]"
              >
                <option>Recently Added</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Highest Rated</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-md transition ${
                  viewMode === "grid" ? "bg-amber-400 text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-900"
                }`}
              >
                <Grid size={16} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded-md transition ${
                  viewMode === "list" ? "bg-amber-400 text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-900"
                }`}
              >
                <List size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* PRODUCT GRID / LIST */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6"
              : "space-y-4"
          }
        >
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className={`bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition group relative ${
                viewMode === "list" ? "flex flex-col sm:flex-row items-center gap-6" : "flex flex-col sm:flex-row items-center gap-5"
              }`}
            >
              {/* Product Image */}
              <div className="w-full sm:w-44 h-44 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0 relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                <button 
                  className="absolute top-2 right-2 p-1.5 bg-white/80 backdrop-blur-sm rounded-full text-gray-400 hover:text-red-500 transition shadow-sm"
                  aria-label="Add to wishlist"
                >
                  <Heart size={14} />
                </button>
              </div>

              {/* Product Details */}
              <div className="flex-1 space-y-2 text-left w-full">
                {/* Rating */}
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(product.rating)].map((_, i) => (
                    <Star key={i} size={14} fill="currentColor" />
                  ))}
                  <span className="text-[11px] text-gray-400 font-normal ml-1">
                    ({product.reviews})
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-bold text-gray-900 text-sm leading-snug group-hover:text-[#0B6B3A] transition line-clamp-2">
                  {product.name}
                </h3>

                {/* Dosage Tag */}
                <span className="inline-block bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-0.5 rounded">
                  {product.dosage}
                </span>

                {/* Price & Add to Cart Action */}
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2">
                    <span className="text-base font-extrabold text-[#0B6B3A]">
                      {product.price}
                    </span>
                    <span className="text-xs text-gray-400 line-through font-medium">
                      {product.originalPrice}
                    </span>
                  </div>

                  <button
                    className="w-9 h-9 bg-amber-400 hover:bg-amber-500 text-gray-900 rounded-full flex items-center justify-center shadow transition"
                    title="Add to Cart"
                  >
                    <ShoppingBag size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* PAGINATION */}
        <div className="flex items-center justify-center gap-2 mt-12 text-xs font-bold">
          <button className="w-9 h-9 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-gray-200 transition">
            <ChevronLeft size={16} />
          </button>
          <button className="w-9 h-9 rounded-full bg-[#0B6B3A] text-white flex items-center justify-center shadow-md">
            01
          </button>
          <button className="w-9 h-9 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-gray-200 transition">
            02
          </button>
          <span className="px-1 text-gray-400">........</span>
          <button className="w-9 h-9 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-gray-200 transition">
            08
          </button>
          <button className="w-9 h-9 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-gray-200 transition">
            <ChevronRight size={16} />
          </button>
        </div>
      </section>

      {/* VALUE PROPOSITION BADGES (EXTRA PAGE CONTENT) */}
      <section className="bg-gray-50 border-y border-gray-100 py-10">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="p-3 bg-emerald-100/60 rounded-xl text-[#0B6B3A]">
              <Truck size={24} />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-xs">Free Shipping</h4>
              <p className="text-[11px] text-gray-500">On all orders over $40</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="p-3 bg-emerald-100/60 rounded-xl text-[#0B6B3A]">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-xs">100% Organic</h4>
              <p className="text-[11px] text-gray-500">Certified Ayurvedic herbs</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="p-3 bg-emerald-100/60 rounded-xl text-[#0B6B3A]">
              <RotateCcw size={24} />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-xs">Easy Returns</h4>
              <p className="text-[11px] text-gray-500">30-day money back guarantee</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="p-3 bg-emerald-100/60 rounded-xl text-[#0B6B3A]">
              <Sparkles size={24} />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-xs">Lab Tested</h4>
              <p className="text-[11px] text-gray-500">Zero synthetic contaminants</p>
            </div>
          </div>
        </div>
      </section>

      {/* SUBSCRIBE NEWSLETTER BANNER */}
      <section className="max-w-6xl mx-auto px-4 py-16">
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

      {/* FOOTER */}
      <footer className="bg-[#0B6B3A] text-gray-200 pt-12 pb-4 px-6 md:px-16 text-xs">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 border-b border-green-800 pb-8">
          
          {/* Brand Info */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-3">
              Babaji Herbals
            </h2>
            <p className="text-gray-300 mb-4 leading-relaxed">
              High-quality organic Ayurvedic and botanical products formulated for everyday balance, health, and natural wellness.
            </p>
            <div className="flex gap-2">
              <a href="#" className="w-7 h-7 bg-[#08522c] rounded-full flex items-center justify-center hover:bg-amber-400 hover:text-black transition text-xs font-bold">f</a>
              <a href="#" className="w-7 h-7 bg-[#08522c] rounded-full flex items-center justify-center hover:bg-amber-400 hover:text-black transition text-xs font-bold">t</a>
              <a href="#" className="w-7 h-7 bg-[#08522c] rounded-full flex items-center justify-center hover:bg-amber-400 hover:text-black transition text-xs font-bold">i</a>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm mb-2">Contact Information</h4>
            <div className="flex items-center gap-2">
              <MapPin size={16} className="text-amber-400 flex-shrink-0" />
              <span>715 Sunrise Highway, West Islip, NY 11795</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone size={16} className="text-amber-400 flex-shrink-0" />
              <span>+1 800 123 4567</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail size={16} className="text-amber-400 flex-shrink-0" />
              <span>support@babajiherbals.com</span>
            </div>
          </div>

          {/* Useful Links */}
          <div>
            <h4 className="text-white font-bold text-sm mb-2">Useful Links</h4>
            <div className="grid grid-cols-2 gap-2 text-gray-300">
              <a href="#" className="hover:text-white">Our Services</a>
              <a href="#" className="hover:text-white">Product Returns</a>
              <a href="#" className="hover:text-white">Payments</a>
              <a href="#" className="hover:text-white">About Us</a>
              <a href="#" className="hover:text-white">Special Offers</a>
              <a href="#" className="hover:text-white">FAQ</a>
              <a href="#" className="hover:text-white">Shopping</a>
              <a href="#" className="hover:text-white">Our Team</a>
              <a href="#" className="hover:text-white">Regulations</a>
            </div>
          </div>
        </div>

        {/* Gallery Strip */}
        <div className="max-w-6xl mx-auto grid grid-cols-3 sm:grid-cols-6 gap-2 mb-6">
          {galleryImages.map((img, i) => (
            <div key={i} className="h-16 rounded-lg overflow-hidden border border-emerald-800">
              <img src={img} alt="gallery thumbnail" className="w-full h-full object-cover" />
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="max-w-6xl mx-auto bg-amber-400 text-gray-900 py-2.5 px-4 rounded-md flex flex-col md:flex-row justify-between items-center gap-2 font-medium">
          <p>© Copyright <strong>Babaji Herbals</strong>. All Rights Reserved.</p>
          <div className="flex gap-4 text-xs font-semibold">
            <a href="#" className="hover:underline">Terms And Conditions</a>
            <a href="#" className="hover:underline">Privacy Policy</a>
          </div>
        </div>
      </footer>

    </div>
  );
}