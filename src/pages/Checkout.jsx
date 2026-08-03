import Breadcrumb from '../components/Breadcrumb'
import Button from '../components/Button'

export default function Checkout() {
  return (
    <>
      <Breadcrumb items={[{ label: 'Checkout' }]} />
      <section className="section-shell py-10">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[2rem] bg-white p-6 shadow-lg">
            <h1 className="font-display text-3xl">Checkout</h1>
            <div className="mt-6 space-y-3">
              <input className="w-full rounded-2xl border border-[#0B6B3A]/10 px-4 py-3" placeholder="Full Name" />
              <input className="w-full rounded-2xl border border-[#0B6B3A]/10 px-4 py-3" placeholder="Address" />
              <input className="w-full rounded-2xl border border-[#0B6B3A]/10 px-4 py-3" placeholder="City" />
            </div>
          </div>
          <div className="rounded-[2rem] bg-[#eef6ef] p-6 shadow-lg">
            <h2 className="font-display text-2xl">Order Summary</h2>
            <div className="mt-4 space-y-2 text-sm text-slate-700">
              <div className="flex justify-between"><span>Green Vital Oil</span><span>$79</span></div>
              <div className="flex justify-between"><span>Shipping</span><span>$12</span></div>
              <div className="flex justify-between font-semibold"><span>Total</span><span>$91</span></div>
            </div>
            <div className="mt-6">
              <Button className="rounded-full">Place Order</Button>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
