import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Leaf,
  Sparkles,
  Heart,
  ShieldCheck,
  ArrowRight,
  Search,
  Filter,
} from "lucide-react";


const categoryData = [
  {
    id: "herbal-supplements",
    name: "Herbal Supplements",
    description:
      "Natural daily boosters for immunity, vitality, and overall wellness.",
    itemCount: 24,
    icon: Leaf,
    badge: "Popular",
    slug: "/shop?category=supplements",
  },
  {
    id: "skincare-care",
    name: "Skincare & Beauty",
    description: "Ayurvedic soaps, face serums, and organic botanical lotions.",
    itemCount: 18,
    icon: Sparkles,
    badge: "Trending",
    slug: "/shop?category=skincare",
  },
  {
    id: "wellness-teas",
    name: "Wellness Teas & Elixirs",
    description:
      "Soothing organic herbal infusions for detoxification and stress relief.",
    itemCount: 15,
    icon: Heart,
    badge: "Organic",
    slug: "/shop?category=teas",
  },
  {
    id: "immunity-boosters",
    name: "Immunity Boosters",
    description:
      "Traditional herbal formulations, Chyawanprash, and extract drops.",
    itemCount: 12,
    icon: ShieldCheck,
    badge: "Best Seller",
    slug: "/shop?category=immunity",
  },
];

export default function Category() {
 
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCategories = categoryData.filter(
    (cat) =>
      cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.description.toLowerCase().includes(searchQuery.toLowerCase()),
  );
  return (
    <div className="min-h-screen bg-[#f4f7f2]/50 py-12">
      <div className="section-shell mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#0B6B3A]/10 px-4 py-1.5 text-xs font-semibold text-[#0B6B3A] mb-4">
            <Leaf size={14} /> Explore Our Range
          </div>
          <h1 className="text-3xl font-bold text-[#1B1B1B] sm:text-4xl">
            Herbal & Ayurvedic Categories
          </h1>
          <p className="mt-3 text-sm text-gray-600 sm:text-base">
            Browse our carefully curated collections of 100% natural, authentic
            herbal products crafted for your health and vitality.
          </p>

          {/* Search Bar */}
          <div className="mt-6 relative max-w-md mx-auto">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-full border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm outline-none transition focus:border-[#0B6B3A] focus:ring-2 focus:ring-[#0B6B3A]/20 shadow-sm"
            />
          </div>
        </div>

        {/* Categories Grid */}
        {filteredCategories.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {filteredCategories.map((category) => {
              const IconComponent = category.icon;
              return (
                <div
                  key={category.id}
                  className="group relative flex flex-col justify-between rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#0B6B3A]/30 hover:shadow-xl"
                >
                  <div>
                    {/* Top Icon & Badge */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="rounded-xl bg-[#f4f7f2] p-3 text-[#0B6B3A] transition group-hover:bg-[#0B6B3A] group-hover:text-white">
                        <IconComponent size={24} />
                      </div>
                      {category.badge && (
                        <span className="rounded-full bg-[#0B6B3A]/10 px-2.5 py-1 text-[11px] font-semibold text-[#0B6B3A]">
                          {category.badge}
                        </span>
                      )}
                    </div>

                    {/* Category Title & Description */}
                    <h2 className="text-lg font-semibold text-[#1B1B1B] group-hover:text-[#0B6B3A] transition">
                      {category.name}
                    </h2>
                    <p className="mt-2 text-xs text-gray-500 leading-relaxed">
                      {category.description}
                    </p>
                  </div>

                  {/* Footer Info & Action Link */}
                  <div className="mt-6 pt-4 border-t border-gray-50 flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-400">
                      {category.itemCount} Products
                    </span>

                    <RouterLink
                      to={category.slug}
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#0B6B3A] transition hover:gap-2"
                    >
                      Explore <ArrowRight size={14} />
                    </RouterLink>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-sm">
              No categories found matching "{searchQuery}".
            </p>
          </div>
        )}

        {/* Featured Promo Banner */}
        <div className="mt-12 rounded-3xl bg-[#0B6B3A] p-8 text-white shadow-xl lg:p-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <span className="text-xs uppercase tracking-wider text-white/80 font-semibold">
                Need Personalized Advice?
              </span>
              <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
                Not sure which herb suits your body type?
              </h2>
              <p className="mt-2 text-sm text-white/80 max-w-xl">
                Consult with our Ayurvedic specialists or browse products
                filtered specifically by wellness goals.
              </p>
            </div>

            <RouterLink
              to="/shop"
              className="shrink-0 rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#0B6B3A] transition hover:bg-[#f4f7f2]"
            >
              Browse All Products
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  );
}
