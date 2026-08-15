import React from "react";
import { MapPin, Phone, Mail } from "lucide-react";

export default function Footer() {
  const galleryImages = [
    "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=200&q=80",
    "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&w=200&q=80",
    "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=200&q=80",
    "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=200&q=80",
    "https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?auto=format&fit=crop&w=200&q=80",
    "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=200&q=80",
  ];

  return (
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
            <a 
              href="#" 
              aria-label="Facebook"
              className="w-7 h-7 bg-[#08522c] rounded-full flex items-center justify-center hover:bg-amber-400 hover:text-black transition text-xs font-bold"
            >
              f
            </a>
            <a 
              href="#" 
              aria-label="Twitter"
              className="w-7 h-7 bg-[#08522c] rounded-full flex items-center justify-center hover:bg-amber-400 hover:text-black transition text-xs font-bold"
            >
              t
            </a>
            <a 
              href="#" 
              aria-label="Instagram"
              className="w-7 h-7 bg-[#08522c] rounded-full flex items-center justify-center hover:bg-amber-400 hover:text-black transition text-xs font-bold"
            >
              i
            </a>
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
            <a href="#" className="hover:text-white transition-colors">Our Services</a>
            <a href="#" className="hover:text-white transition-colors">Product Returns</a>
            <a href="#" className="hover:text-white transition-colors">Payments</a>
            <a href="#" className="hover:text-white transition-colors">About Us</a>
            <a href="#" className="hover:text-white transition-colors">Special Offers</a>
            <a href="#" className="hover:text-white transition-colors">FAQ</a>
            <a href="#" className="hover:text-white transition-colors">Shopping</a>
            <a href="#" className="hover:text-white transition-colors">Our Team</a>
            <a href="#" className="hover:text-white transition-colors">Regulations</a>
          </div>
        </div>
      </div>

      {/* Gallery Strip */}
      <div className="max-w-6xl mx-auto grid grid-cols-3 sm:grid-cols-6 gap-2 mb-6">
        {galleryImages.map((img, i) => (
          <div key={i} className="h-16 rounded-lg overflow-hidden border border-emerald-800">
            <img 
              src={img} 
              alt={`Gallery thumbnail ${i + 1}`} 
              className="w-full h-full object-cover hover:scale-110 transition duration-300" 
            />
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
  );
}