import Hero from '../components/Hero'
import AboutSection from '../components/AboutSection'
import BestSeller from '../components/BestSeller'
import OfferBanner from '../components/OfferBanner'
import StatsSection from '../components/StatsSection'
import FAQ from '../components/FAQ'
import Newsletter from '../components/Newsletter'
import ProductCard from '../components/ProductCard'

const trending = [
  { id: 1, name: 'Green Vital Oil', category: 'Ayurvedic', price: 79, oldPrice: 99, rating: 4.9, discount: 20, image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=600&q=80' },
  { id: 2, name: 'Daily Immunity Capsule', category: 'Immunity', price: 55, oldPrice: 72, rating: 4.8, discount: 16, image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=600&q=80' },
  { id: 3, name: 'Skin Restore Balm', category: 'Skin Care', price: 62, oldPrice: 80, rating: 4.7, discount: 14, image: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?auto=format&fit=crop&w=600&q=80' },
  { id: 4, name: 'Hair Nourish Serum', category: 'Hair Care', price: 48, oldPrice: 66, rating: 4.6, discount: 10, image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=600&q=80' },
]

export default function Home() {
  return (
    <>
      <Hero />
      <section className="section-shell py-14">
        <div className="mb-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#0B6B3A]">Trending</p>
          <h2 className="font-display text-3xl font-semibold">Trending Products</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {trending.map((item) => (
            <ProductCard item={item} key={item.id} />
          ))}
        </div>
      </section>
      <OfferBanner />
      <AboutSection />
      <StatsSection />
      <BestSeller />
      <FAQ />
      <Newsletter />
    </>
  )
}
