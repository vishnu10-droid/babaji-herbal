import Breadcrumb from '../components/Breadcrumb'
import Button from '../components/Button'

export default function Wishlist() {
  return (
    <>
      <Breadcrumb items={[{ label: 'Wishlist' }]} />
      <section className="section-shell py-10">
        <div className="rounded-[2rem] bg-white p-6 shadow-lg">
          <h1 className="font-display text-3xl">Wishlist</h1>
          <div className="mt-6 rounded-2xl bg-[#eef6ef] p-4">
            <p className="font-semibold">Skin Restore Balm</p>
            <p className="text-sm text-slate-600">Save it for later and add to cart anytime.</p>
            <div className="mt-4">
              <Button className="rounded-full">Add to Cart</Button>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
