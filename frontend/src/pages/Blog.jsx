import Breadcrumb from '../components/Breadcrumb'
import { Link } from 'react-router-dom'
import {
  Calendar,
  Clock,
  ArrowRight,
  Leaf,
  Sparkles,
  Heart,
  Droplets,
} from 'lucide-react'

const articles = [
  {
    id: 1,
    title: 'The Ancient Wisdom of Ashwagandha: Your Natural Stress Reliever',
    excerpt:
      'Ashwagandha has been revered in Ayurveda for over 3,000 years. Discover how this adaptogenic herb balances cortisol, improves sleep, and restores your natural energy.',
    category: 'Herbs & Remedies',
    date: 'Mar 28, 2025',
    readTime: '6 min read',
    icon: Leaf,
    tag: 'Adaptogen',
  },
  {
    id: 2,
    title: '10 Ayurvedic Rituals to Boost Your Immunity This Season',
    excerpt:
      'Simple daily rituals — from warm turmeric milk to nasya oiling — that strengthen your body’s natural defenses against seasonal changes.',
    category: 'Wellness Guides',
    date: 'Mar 20, 2025',
    readTime: '8 min read',
    icon: Shield,
    tag: 'Immunity',
  },
  {
    id: 3,
    title: 'Skincare the Ayurvedic Way: Glow With Herbal Face Oils',
    excerpt:
      'Swap chemical serums for botanical blends. Learn how neem, turmeric, and rose extracts nourish your skin type and restore a radiant complexion.',
    category: 'Skincare & Beauty',
    date: 'Mar 12, 2025',
    readTime: '5 min read',
    icon: Sparkles,
    tag: 'Beauty',
  },
  {
    id: 4,
    title: 'Herbal Teas for Detoxification: A Brew for Every Dosha',
    excerpt:
      'From triphala to tulsi-green blends, explore soothing herbal infusions that cleanse gently and align with your dosha for deeper wellness.',
    category: 'Teas & Elixirs',
    date: 'Mar 05, 2025',
    readTime: '7 min read',
    icon: Droplets,
    tag: 'Detox',
  },
  {
    id: 5,
    title: 'Understanding the Three Doshas: Vata, Pitta, and Kapha',
    excerpt:
      'Your unique mind-body constitution shapes how you feel, digest, and rest. Decode your prakriti and harmonize it through diet and lifestyle.',
    category: 'Ayurveda Basics',
    date: 'Feb 26, 2025',
    readTime: '9 min read',
    icon: Heart,
    tag: 'Dosha',
  },
  {
    id: 6,
    title: 'Chyawanprash: The Immunity Elixir Your Grandmother Swore By',
    excerpt:
      'Packed with amla, honey, ghee, and 40+ herbs, Chyawanprash is a winter staple. Here is how to choose the purest one and take it daily.',
    category: 'Herbs & Remedies',
    date: 'Feb 18, 2025',
    readTime: '4 min read',
    icon: Leaf,
    tag: 'Staple',
  },
]

// Shield is used in the second article
function Shield({ size = 24, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  )
}

export default function Blog() {
  return (
    <>
      <Breadcrumb items={[{ label: 'Blog' }]} />

      <section className="section-shell py-10">
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#0B6B3A]/10 px-4 py-1.5 text-xs font-semibold text-[#0B6B3A]">
            <Leaf size={14} /> The Wellness Journal
          </div>
          <h1 className="mt-3 font-display text-3xl font-bold text-[#1B1B1B] sm:text-4xl">
            Herbal Insights & Ayurvedic Wisdom
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-600 sm:text-base">
            Practical guides, ancient remedies, and modern wellness tips —
            written to help you live in harmony with nature.
          </p>
        </div>

        {/* Featured Article */}
        <Link
          to="/blog-details"
          state={{ article: articles[0] }}
          className="group mb-10 block overflow-hidden rounded-3xl border border-[#0B6B3A]/10 bg-white shadow-lg transition hover:border-[#0B6B3A]/30 hover:shadow-xl"
        >
          <div className="grid overflow-hidden md:grid-cols-[1.2fr_1fr]">
            <div className="flex min-h-[220px] items-center justify-center bg-gradient-to-br from-[#0B6B3A] via-[#0B6B3A]/80 to-[#1B1B1B] p-10 text-white">
              <Leaf size={72} className="text-emerald-100/90" />
            </div>
            <div className="p-7 lg:p-10">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-[#0B6B3A]/10 px-3 py-1 text-[11px] font-bold text-[#0B6B3A]">
                  Featured
                </span>
                <span className="rounded-full bg-amber-100 px-3 py-1 text-[11px] font-semibold text-amber-700">
                  {articles[0].category}
                </span>
              </div>
              <h2 className="mt-4 text-xl font-bold leading-snug text-[#1B1B1B] transition group-hover:text-[#0B6B3A] lg:text-2xl">
                {articles[0].title}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                {articles[0].excerpt}
              </p>
              <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
                <div className="flex items-center gap-4">
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar size={14} /> {articles[0].date}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock size={14} /> {articles[0].readTime}
                  </span>
                </div>
                <span className="inline-flex items-center gap-1 font-bold text-[#0B6B3A] transition group-hover:gap-2">
                  Read Article <ArrowRight size={14} />
                </span>
              </div>
            </div>
          </div>
        </Link>

        {/* Articles Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.slice(1).map((article) => {
            const Icon = article.icon
            return (
              <Link
                key={article.id}
                to="/blog-details"
                state={{ article }}
                className="group flex flex-col overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#0B6B3A]/30 hover:shadow-xl"
              >
                <div className="flex h-44 items-center justify-center bg-gradient-to-br from-[#f4f7f2] to-[#e2ecdf] text-[#0B6B3A]">
                  <Icon
                    size={48}
                    strokeWidth={1.5}
                    className="transition group-hover:scale-110"
                  />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-[#0B6B3A]/10 px-3 py-1 text-[11px] font-semibold text-[#0B6B3A]">
                      {article.category}
                    </span>
                    <span className="text-[11px] font-medium text-slate-400">
                      {article.tag}
                    </span>
                  </div>
                  <h3 className="mt-4 text-base font-bold leading-snug text-[#1B1B1B] transition group-hover:text-[#0B6B3A]">
                    {article.title}
                  </h3>
                  <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-slate-600">
                    {article.excerpt}
                  </p>
                  <div className="mt-5 flex items-center justify-between border-t border-gray-50 pt-4 text-xs text-slate-500">
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar size={13} /> {article.date}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Clock size={13} /> {article.readTime}
                    </span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {/* Newsletter CTA */}
        <div className="mt-12 rounded-3xl bg-[#0B6B3A] p-8 text-white shadow-xl lg:p-12">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div>
              <h2 className="text-2xl font-bold">Never miss a wellness article</h2>
              <p className="mt-2 max-w-xl text-sm text-white/80">
                Join our newsletter for weekly Ayurvedic tips, seasonal remedies,
                and exclusive offers from Babaji Herbal.
              </p>
            </div>
            <Link
              to="/register"
              className="shrink-0 rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#0B6B3A] transition hover:bg-[#f4f7f2]"
            >
              Subscribe Free
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}

