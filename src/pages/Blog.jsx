import React from 'react';
import { 
  Search, 
  MessageSquare, 
  User, 
  Play, 
  ChevronLeft, 
  ChevronRight, 
  MapPin, 
  Phone, 
  Mail, 
  ArrowRight 
} from 'lucide-react';

export default function BlogPage() {
  const posts = [
    {
      id: 1,
      date: '14',
      month: 'MAR',
      author: 'John Carter',
      comments: '0 Comments',
      title: 'Options For a Cannabis Education in All Countries',
      desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      img: 'https://images.unsplash.com/photo-1603909223429-69bb7101f420?auto=format&fit=crop&q=80',
      isVideo: false,
    },
    {
      id: 2,
      date: '24',
      month: 'MAR',
      author: 'John Carter',
      comments: '0 Comments',
      title: "Why CBD Product's Ingredients List Must Be Examined?",
      desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80',
      isVideo: false,
    },
    {
      id: 3,
      date: '28',
      month: 'MAR',
      author: 'John Carter',
      comments: '0 Comments',
      title: 'CBD oil for pain management Effects Benefits, and uses',
      desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      img: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80',
      isVideo: false,
    },
    {
      id: 4,
      date: '14',
      month: 'APR',
      author: 'John Carter',
      comments: '0 Comments',
      title: 'Cannabidiol (CBD) oil is made from the cannabis plant',
      desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      img: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&q=80',
      isVideo: true,
    },
  ];

  const recentPosts = [
    { title: 'Adding CBD in Food Tinctures and Capsules', date: 'December 24, 2025', img: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80' },
    { title: 'How Does A Lotion Containing CBD Help', date: 'December 22, 2025', img: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&q=80' },
    { title: 'Guidelines For Consuming Cannabis', date: 'February 10, 2026', img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80' },
  ];

  const categories = [
    { name: 'Anxiety Relievers', count: 1 },
    { name: 'CBD Tinctures', count: 2 },
    { name: 'Pain Relievers', count: 4 },
    { name: 'Hemp Rollers', count: 1 },
    { name: 'Plant Powders', count: 2 },
    { name: 'Wellness', count: 2 },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      
      {/* ------------------ 1. PAGE BANNER ------------------ */}
    <section
  className="relative h-64 md:h-80 bg-cover bg-center flex items-center justify-center px-8 md:px-20 text-white"
  style={{
    backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.7), rgba(0,0,0,0.3)), url('https://images.unsplash.com/photo-1603909223429-69bb7101f420?auto=format&fit=crop&q=80')`,
  }}
>
  <div className="max-w-2xl text-center">
    <h1 className="text-4xl md:text-5xl font-bold mb-3">
      Our Blog
    </h1>

    <p className="text-gray-200 text-sm md:text-base mb-4">
      Discover the latest herbal wellness tips, health insights, and natural care guides.
    </p>

    
  </div>
</section>

      {/* ------------------ 2. MAIN BLOG CONTENT & SIDEBAR ------------------ */}
      <section className="max-w-6xl mx-auto px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Left - Blog Posts Feed (2 Cols) */}
          <div className="lg:col-span-2 space-y-12">
            {posts.map((post) => (
              <article key={post.id} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-5">
                
                {/* Media Container */}
                <div className="relative rounded-2xl overflow-hidden h-64 md:h-80 bg-slate-100">
                  <img src={post.img} alt={post.title} className="w-full h-full object-cover" />
                  
                  {/* Date Badge */}
                  <div className="absolute top-4 left-4 bg-amber-400 text-slate-900 font-bold px-3 py-2 rounded-xl text-center shadow-md leading-tight">
                    <span className="block text-xl font-black">{post.date}</span>
                    <span className="text-[10px] tracking-wider uppercase">{post.month}</span>
                  </div>

                  {/* Optional Video Play Button */}
                  {post.isVideo && (
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                      <div className="w-14 h-14 rounded-full bg-white text-emerald-600 flex items-center justify-center shadow-xl cursor-pointer hover:scale-105 transition">
                        <Play className="fill-current ml-1" size={24} />
                      </div>
                    </div>
                  )}
                </div>

                {/* Post Meta */}
                <div className="flex items-center gap-4 text-xs text-slate-400 font-medium pt-1">
                  <span className="flex items-center gap-1">
                    <User size={14} className="text-emerald-500" /> Posted By {post.author}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageSquare size={14} className="text-emerald-500" /> {post.comments}
                  </span>
                </div>

                {/* Title & Excerpt */}
                <h2 className="text-xl md:text-2xl font-bold text-slate-900 leading-snug hover:text-emerald-600 transition cursor-pointer">
                  {post.title}
                </h2>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {post.desc}
                </p>

                {/* Footer / Read More & Social */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <button className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold px-5 py-2.5 rounded-full transition shadow-sm">
                    Read More
                  </button>
                  <div className="flex items-center gap-3 text-xs text-slate-400 font-semibold">
                    <span>Read More:</span>
                    <div className="flex gap-1.5">
                      {['f', 't', 'in'].map((social, idx) => (
                        <span key={idx} className="w-6 h-6 rounded-full bg-slate-100 hover:bg-emerald-100 hover:text-emerald-600 flex items-center justify-center cursor-pointer transition text-[10px]">
                          {social}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

              </article>
            ))}

            {/* Pagination Controls */}
            <div className="flex justify-center items-center gap-2 pt-6">
              <button className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-100 text-slate-500 text-xs">
                <ChevronLeft size={16} />
              </button>
              <button className="w-9 h-9 rounded-lg bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shadow">
                01
              </button>
              <button className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-100 text-slate-600 text-xs font-semibold">
                02
              </button>
              <button className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-100 text-slate-500 text-xs">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Right - Sidebar */}
          <aside className="space-y-8">
            
            {/* Widget 1: Search */}
            <div className="bg-slate-100/80 rounded-2xl p-5 border border-slate-200/60">
              <h4 className="text-sm font-bold text-slate-900 mb-3">Search</h4>
              <div className="relative flex items-center">
                <input 
                  type="text" 
                  placeholder="Search..." 
                  className="w-full bg-white rounded-xl py-2.5 pl-4 pr-10 text-xs outline-none border border-slate-200 focus:border-emerald-500 transition shadow-sm"
                />
                <button className="absolute right-2 w-7 h-7 bg-emerald-500 text-white rounded-lg flex items-center justify-center hover:bg-emerald-600 transition">
                  <Search size={14} />
                </button>
              </div>
            </div>

            {/* Widget 2: Recent Posts */}
            <div className="bg-slate-100/80 rounded-2xl p-5 border border-slate-200/60 space-y-4">
              <h4 className="text-sm font-bold text-slate-900 border-b border-slate-200/80 pb-3">Recent Posts</h4>
              <div className="space-y-3">
                {recentPosts.map((post, i) => (
                  <div key={i} className="flex gap-3 items-center group cursor-pointer">
                    <img src={post.img} alt={post.title} className="w-14 h-14 rounded-xl object-cover shrink-0" />
                    <div>
                      <h5 className="text-xs font-bold text-slate-800 group-hover:text-emerald-600 transition line-clamp-2">{post.title}</h5>
                      <span className="text-[10px] text-slate-400 font-medium">{post.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Widget 3: Categories */}
            <div className="bg-slate-100/80 rounded-2xl p-5 border border-slate-200/60 space-y-4">
              <h4 className="text-sm font-bold text-slate-900 border-b border-slate-200/80 pb-3">Categories</h4>
              <div className="space-y-2">
                {categories.map((cat, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs py-1.5 border-b border-slate-200/40 last:border-0 hover:text-emerald-600 cursor-pointer transition">
                    <span className="font-semibold text-slate-700">{cat.name}</span>
                    <span className="w-6 h-6 rounded-full bg-amber-400 text-slate-900 font-bold text-[10px] flex items-center justify-center shadow-sm">
                      {cat.count < 10 ? `0${cat.count}` : cat.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Widget 4: Quick Links */}
            <div className="bg-slate-100/80 rounded-2xl p-5 border border-slate-200/60 space-y-3">
              <h4 className="text-sm font-bold text-slate-900 border-b border-slate-200/80 pb-3">Quick Links</h4>
              <ul className="space-y-2 text-xs text-slate-600 font-medium">
                {['Affiliate Template', 'Privacy Advice', 'Legal Processing', 'Terms & Conditions', 'Cannabis Usage'].map((link, i) => (
                  <li key={i} className="flex items-center gap-1.5 hover:text-emerald-600 cursor-pointer transition">
                    <span className="text-emerald-500">&gt;</span> {link}
                  </li>
                ))}
              </ul>
            </div>

            {/* Widget 5: Get Updates Box */}
            <div className="bg-slate-800 text-white rounded-2xl p-6 border border-slate-700 space-y-4">
              <h4 className="text-base font-bold">Get Updates</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Subscribe to our newsletter for exclusive insights and weekly offers.
              </p>
              <form onSubmit={(e) => e.preventDefault()} className="space-y-3">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2.5 px-4 text-xs outline-none focus:border-emerald-500 text-white placeholder-slate-500"
                />
                <button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs py-2.5 rounded-xl transition shadow-md">
                  Subscribe
                </button>
              </form>
            </div>

          </aside>

        </div>
      </section>

    </div>
  );
}