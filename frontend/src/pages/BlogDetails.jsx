import { useLocation, Link } from 'react-router-dom'
import Breadcrumb from '../components/Breadcrumb'
import {
  Calendar,
  Clock,
  Leaf,
  ArrowLeft,
  Share2,
  Heart,
  Tag,
} from 'lucide-react'

const fallbackArticle = {
  id: 0,
  title: 'The Art of Balancing Health With Nature',
  excerpt:
    'Explore how ancient Ayurvedic principles can be woven into your modern daily routine for deeper vitality and balance.',
  category: 'Wellness Guides',
  date: 'Mar 28, 2025',
  readTime: '6 min read',
  content: [
    {
      heading: 'A Heritage of Healing',
      body: 'Ayurveda, the "science of life", has guided natural wellness for over five thousand years. The core belief is simple: true health emerges when body, mind, and spirit are in harmony with the rhythms of nature. This article explores how to honor that wisdom in the modern world.',
    },
    {
      heading: 'Start With Your Morning Ritual',
      body: 'Begin each day with gratitude and a glass of warm water infused with lemon and ginger. Follow with a few minutes of deep breathing and gentle stretching. These small acts ground your nervous system and set a calm tone for the hours ahead.',
    },
    {
      heading: 'Nourish With Seasonal Herbs',
      body: 'Nature offers a rotating pharmacy of herbs. In cooler months, reach for warming spices like turmeric, cinnamon, and ashwagandha. In warmer seasons, cooling botanicals like mint, coriander, and rose help balance internal heat.',
    },
    {
      heading: 'Listen to Your Body',
      body: 'The most powerful tool you have is your own awareness. Notice how certain foods, activities, and schedules make you feel. Ayurveda encourages tuning in to your unique constitution rather than following a one-size-fits-all approach.',
    },
  ],
}

export default function BlogDetails() {
  const location = useLocation()
  const article = location.state?.article || fallbackArticle

  return (
    <>
      <Breadcrumb
        items={[
          { label: 'Blog', to: '/blog' },
          { label: article.category },
        ]}
      />

      <article className="section-shell py-10">
        {/* Hero */}
        <div className="mx-auto max-w-3xl">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#0B6B3A] transition hover:gap-3"
          >
            <ArrowLeft size={16} /> Back to Blog
          </Link>

          <div className="mt-6 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-[#0B6B3A]/10 px-3 py-1 text-[11px] font-bold text-[#0B6B3A]">
              {article.category}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-[11px] font-medium text-slate-600">
              <Tag size={12} /> {article.tag || 'Wellness'}
            </span>
          </div>

          <h1 className="mt-4 font-display text-2xl font-bold leading-tight text-[#1B1B1B] sm:text-3xl lg:text-4xl">
            {article.title}
          </h1>

          <div className="mt-5 flex flex-wrap items-center gap-4 text-xs text-slate-500">
            <span className="inline-flex items-center gap-1.5">
              <Calendar size={14} /> {article.date}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock size={14} /> {article.readTime}
            </span>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-3 py-1 font-semibold text-slate-600 transition hover:border-[#0B6B3A]/40 hover:text-[#0B6B3A]"
            >
              <Share2 size={13} /> Share
            </button>
          </div>
        </div>

        {/* Cover */}
        <div className="mx-auto mt-8 flex h-64 max-w-4xl items-center justify-center rounded-3xl bg-gradient-to-br from-[#0B6B3A] via-[#0B6B3A]/80 to-[#1B1B1B] text-emerald-100 sm:h-80 lg:h-96">
          <Leaf size={96} strokeWidth={1.2} className="opacity-90" />
        </div>

        {/* Body */}
        <div className="mx-auto max-w-3xl">
          <p className="mt-8 text-lg font-medium leading-relaxed text-[#1B1B1B]">
            {article.excerpt}
          </p>

          {article.content.map((section, idx) => (
            <section key={idx} className="mt-8">
              <h2 className="text-xl font-bold text-[#0B6B3A]">
                {section.heading}
              </h2>
              <p className="mt-3 leading-relaxed text-slate-700">
                {section.body}
              </p>
            </section>
          ))}

          {/* CTA */}
          <div className="mt-10 rounded-3xl bg-[#f4f7f2] p-7 text-center">
            <Heart className="mx-auto text-[#0B6B3A]" size={28} />
            <h3 className="mt-3 text-lg font-bold text-[#1B1B1B]">
              Loved this article?
            </h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-slate-600">
              Explore our curated herbal products and bring these ancient
              practices into your everyday life.
            </p>
            <Link
              to="/shop"
              className="mt-5 inline-block rounded-full bg-[#0B6B3A] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#085a31]"
            >
              Shop Natural Products
            </Link>
          </div>
        </div>
      </article>
    </>
  )
}
