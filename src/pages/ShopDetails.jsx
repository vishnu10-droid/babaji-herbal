import React, { useState } from 'react';
import {
  Star,
  Heart,
  ShoppingCart,
  Phone,
  Mail,
  MapPin,
} from 'lucide-react';

export default function ProductDetailPage() {
  const [quantity, setQuantity] = useState(1);
  const [selectedImg, setSelectedImg] = useState(0);

  // High quality working Unsplash product images
  const productImages = [
    'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80',
  ];

  // Working Unsplash images for related products
  const relatedProducts = [
    { id: 1, name: 'Full Spectrum Hemp Oil 1000 mg 10ml', price: '$30.00', status: 'In Stock', image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=400&q=80' },
    { id: 2, name: 'Naturecan Hemp Tea Blend 20 bags', price: '$28.00', status: 'In Stock', image: 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&w=400&q=80' },
    { id: 3, name: 'Vintage Hemp Tea Blend Liquid', price: '$30.00', status: 'Out of Stock', image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=400&q=80' },
    { id: 4, name: 'Naturecan Hemp Tea Blend', price: '$28.00', status: 'In Stock', image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=400&q=80' },
  ];

  return (
    <div className="bg-white font-sans text-gray-700">
      
      {/* 1. HERO BANNER (Height Increased with py-28 md:py-36) */}
      <div 
        className="relative bg-cover bg-center py-28 md:py-36 px-6 md:px-16 text-white"
        style={{ 
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=1200&q=80')` 
        }}
      >
        <div className="max-w-6xl mx-auto text-center md:text-left">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 tracking-wide">Shop Details</h1>
          <p className="text-base text-gray-200">
            <span className="text-gray-400">Home</span> / <span className="text-yellow-400 font-semibold">Shop Details</span>
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10 space-y-12">
        
        {/* 2. PRODUCT DETAILS SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          
          {/* Left: Product Images */}
          <div className="flex flex-col items-center">
            <div className="bg-gray-100 rounded-2xl p-4 mb-4 w-full flex justify-center items-center overflow-hidden h-96">
              <img 
                src={productImages[selectedImg]} 
                alt="Product" 
                className="w-full h-full object-cover rounded-xl" 
              />
            </div>
            <div className="flex gap-4">
              {productImages.map((img, idx) => (
                <button 
                  key={idx} 
                  onClick={() => setSelectedImg(idx)}
                  className={`w-20 h-20 bg-gray-100 rounded-xl overflow-hidden border-2 transition ${selectedImg === idx ? 'border-green-600 scale-105' : 'border-transparent opacity-70 hover:opacity-100'}`}
                >
                  <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Right: Product Info */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-green-100 text-green-700 text-xs px-2.5 py-1 rounded-md font-semibold">Available</span>
              <div className="flex text-yellow-400 text-sm">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} fill="currentColor" />
                ))}
              </div>
              <span className="text-xs text-gray-500">(1 Review)</span>
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Naturecan Hemp Tea Blend 20 bags
            </h2>
            <p className="text-xs text-gray-400 mb-4">Category: CBD Tea / Blend</p>

            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-3xl font-bold text-gray-900">$19.85</span>
              <span className="text-lg text-gray-400 line-through">$25.00</span>
            </div>

            {/* Quantity Counter */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-sm font-semibold text-gray-600">Quantity</span>
              <div className="flex items-center border border-gray-300 rounded-md">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                >
                  -
                </button>
                <span className="px-4 py-1 text-sm font-bold">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                >
                  +
                </button>
              </div>
            </div>

            {/* Countdown Box */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-6 text-center">
              <span className="text-xs font-semibold text-yellow-600 block mb-2">One-Time Flash Offer:</span>
              <div className="flex justify-center gap-4 text-xs font-bold text-gray-700">
                <div><span className="text-base font-bold text-black block">02</span> DAYS</div>
                <div><span className="text-base font-bold text-black block">09</span> HOURS</div>
                <div><span className="text-base font-bold text-black block">08</span> MINS</div>
                <div><span className="text-base font-bold text-black block">50</span> SECS</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mb-6">
              <button className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-md transition duration-200">
                Add To Cart
              </button>
              <button className="border border-gray-300 p-3 rounded-md hover:bg-gray-50 text-gray-600">
                <Heart size={18} />
              </button>
            </div>

            <div className="text-xs text-gray-500 space-y-1 border-t pt-4">
              <p><span className="font-semibold text-gray-700">SKU:</span> Premium 101</p>
              <p><span className="font-semibold text-gray-700">Tags:</span> Herbals, Products, Blend</p>
            </div>
          </div>
        </div>

        {/* 3. DESCRIPTION */}
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">Description</h3>
          <p className="text-sm text-gray-600 leading-relaxed mb-3">
            Natural components are extracted using state-of-the-art CO2 extraction to guarantee pure, clean, and high-quality extracts. Our products contain full-spectrum botanical compounds that enhance wellness without unnecessary additives.
          </p>
          <p className="text-sm text-gray-600 leading-relaxed">
            All ingredients are rigorously tested by third-party laboratories to verify purity, potency, and safety, providing you with full transparency and confidence in every purchase.
          </p>
        </div>

        {/* 4. BENEFITS & SIDE EFFECTS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-green-50 border border-green-100 rounded-2xl p-6">
            <h4 className="text-lg font-bold text-gray-900 mb-4">Benefits</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-center gap-2"><span className="w-2 h-2 bg-green-600 rounded-full"></span> Soothing warmth for full body relaxation</li>
              <li className="flex items-center gap-2"><span className="w-2 h-2 bg-green-600 rounded-full"></span> Managing day-to-day tension and stress</li>
              <li className="flex items-center gap-2"><span className="w-2 h-2 bg-green-600 rounded-full"></span> Promoting peaceful and restful sleep cycles</li>
              <li className="flex items-center gap-2"><span className="w-2 h-2 bg-green-600 rounded-full"></span> Natural antioxidant and herbal properties</li>
              <li className="flex items-center gap-2"><span className="w-2 h-2 bg-green-600 rounded-full"></span> Reducing soreness & general abdominal discomfort</li>
            </ul>
          </div>

          <div className="bg-orange-50 border border-orange-100 rounded-2xl p-6">
            <h4 className="text-lg font-bold text-gray-900 mb-4">Side Effects</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-center gap-2"><span className="w-2 h-2 bg-orange-500 rounded-full"></span> Changes in appetite</li>
              <li className="flex items-center gap-2"><span className="w-2 h-2 bg-orange-500 rounded-full"></span> Slight weight gain or weight loss</li>
              <li className="flex items-center gap-2"><span className="w-2 h-2 bg-orange-500 rounded-full"></span> Dizziness or temporary light-headedness</li>
              <li className="flex items-center gap-2"><span className="w-2 h-2 bg-orange-500 rounded-full"></span> Mild fatigue / drowsiness</li>
              <li className="flex items-center gap-2"><span className="w-2 h-2 bg-orange-500 rounded-full"></span> Potential dry mouth and temporary thirst</li>
            </ul>
          </div>
        </div>

        {/* 5. ADDITIONAL INFORMATION */}
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-4">Additional information</h3>
          <div className="space-y-2">
            <div className="bg-gray-100 rounded-full px-6 py-3 flex items-center justify-between text-sm">
              <span className="font-medium text-gray-700">Weight</span>
              <span className="text-gray-500">0.2 kg</span>
            </div>
            <div className="bg-gray-100 rounded-full px-6 py-3 flex items-center justify-between text-sm">
              <span className="font-medium text-gray-700">Dimensions</span>
              <span className="text-gray-500">24 × 14 × 2 cm</span>
            </div>
            <div className="bg-gray-100 rounded-full px-6 py-3 flex items-center justify-between text-sm">
              <span className="font-medium text-gray-700">Flavor</span>
              <span className="text-gray-500">Botany, Berry, Mint, Citrus, Green Tea</span>
            </div>
          </div>
        </div>

        {/* 6. REVIEWS */}
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-4">Reviews</h3>
          <div className="space-y-4">
            
            {/* Review Item 1 */}
            <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 flex gap-4">
              <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80" alt="David" className="w-12 h-12 rounded-full object-cover" />
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <h5 className="font-bold text-gray-800 text-sm">David Mortensen <span className="text-xs text-gray-400 font-normal">January 8, 2024</span></h5>
                  <div className="flex text-yellow-400 gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} fill="currentColor" />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-gray-600">Great quality product, taste is nice and soothing. Fast shipping and smooth overall delivery process.</p>
              </div>
            </div>

            {/* Review Item 2 */}
            <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 flex gap-4">
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80" alt="Thomas" className="w-12 h-12 rounded-full object-cover" />
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <h5 className="font-bold text-gray-800 text-sm">Thomas Walker <span className="text-xs text-gray-400 font-normal">January 8, 2024</span></h5>
                  <div className="flex text-yellow-400 gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} fill="currentColor" />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-gray-600">Very pleased with my purchase. Will definitely order again soon!</p>
              </div>
            </div>

          </div>
        </div>

        {/* 7. ADD REVIEWS FORM */}
        <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-bold text-gray-900">Add Reviews</h3>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <span>Overall Rating:</span>
              <div className="flex text-gray-300 cursor-pointer">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} className="hover:text-yellow-400" fill="currentColor" />
                ))}
              </div>
            </div>
          </div>
          <p className="text-xs text-gray-400 mb-4">Your email address will not be published. Required fields are marked *</p>

          <form className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input type="text" placeholder="Full Name *" className="w-full bg-white border border-gray-200 rounded-full px-4 py-2 text-xs focus:outline-none focus:border-green-600" />
              <input type="email" placeholder="Email Address *" className="w-full bg-white border border-gray-200 rounded-full px-4 py-2 text-xs focus:outline-none focus:border-green-600" />
            </div>
            <textarea rows="4" placeholder="Your Review *" className="w-full bg-white border border-gray-200 rounded-2xl p-4 text-xs focus:outline-none focus:border-green-600"></textarea>
            <button type="submit" className="bg-green-600 hover:bg-green-700 text-white text-xs font-semibold px-6 py-2.5 rounded-full">
              Post Review
            </button>
          </form>
        </div>

        {/* 8. RELATED PRODUCTS */}
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-6">Related Products</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map((item) => (
              <div key={item.id} className="border border-gray-100 rounded-2xl p-4 relative flex flex-col justify-between hover:shadow-md transition bg-white">
                <span className={`text-[10px] px-2 py-0.5 rounded absolute top-3 left-3 z-10 ${item.status === 'In Stock' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  {item.status}
                </span>
                <div className="h-44 flex items-center justify-center my-2 rounded-xl overflow-hidden">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover hover:scale-105 transition duration-300" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-800 line-clamp-2 mb-1 mt-2">{item.name}</h4>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs font-bold text-gray-900">{item.price}</span>
                    <button className="bg-yellow-400 p-2 rounded-lg text-gray-900 hover:bg-yellow-500">
                      <ShoppingCart size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}