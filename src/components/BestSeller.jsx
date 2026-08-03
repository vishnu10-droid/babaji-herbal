import ProductCard from './ProductCard'

const products = [
  { id: 1, name: 'Organic Green Oil', category: 'Herbal Oils', price: 69, oldPrice: 89, rating: 4.8, discount: 22, image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=600&q=80' },
  { id: 2, name: 'Ayurvedic Capsule', category: 'Capsules', price: 52, oldPrice: 70, rating: 4.9, discount: 18, image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=600&q=80' },
  { id: 3, name: 'Spirulina Powder', category: 'Herbal Powder', price: 41, oldPrice: 56, rating: 4.7, discount: 12, image: 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?auto=format&fit=crop&w=600&q=80' },
]

export default function BestSeller() {
  return (
    <section className="section-shell py-14">
      <div className="mb-8 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#0B6B3A]">Best Sellers</p>
        <h2 className="font-display text-3xl font-semibold">Top Rated Herbal Staples</h2>
      </div>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {products.map((item) => (
          <ProductCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  )
}
