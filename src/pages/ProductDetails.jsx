import { useParams } from 'react-router-dom'
import Breadcrumb from '../components/Breadcrumb'
import Button from '../components/Button'

export default function ProductDetails() {
  const { id } = useParams()

  return (
    <>
      <Breadcrumb items={[{ label: 'Shop', to: '/shop' }, { label: `Product ${id}` }]} />
      <section className="section-shell py-10">
        <div className="grid gap-8 rounded-[2rem] bg-white p-6 shadow-lg lg:grid-cols-2">
          <div className="rounded-[1.5rem] bg-[#eef6ef] p-8">
            <img
              src="https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=600&q=80"
              alt="Herbal product"
              className="h-[420px] w-full rounded-[1.5rem] object-cover"
            />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#0B6B3A]">Ayurvedic</p>
            <h1 className="mt-3 font-display text-4xl">Green Vital Oil</h1>
            <p className="mt-3 text-slate-600">A premium herbal blend crafted to soothe, nourish, and restore natural balance with every use.</p>
            <div className="mt-6 flex items-center gap-4">
              <p className="text-3xl font-bold text-[#0B6B3A]">$79</p>
              <p className="text-sm text-slate-400 line-through">$99</p>
            </div>
            <div className="mt-8 flex gap-3">
              <Button className="rounded-full">Add to Cart</Button>
              <Button variant="ghost" className="rounded-full">Wishlist</Button>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
