import Breadcrumb from '../components/Breadcrumb'

export default function ShippingPolicy() {
  return (
    <>
      <Breadcrumb items={[{ label: 'Shipping Policy' }]} />
      <section className="section-shell py-10">
        <div className="rounded-[2rem] bg-white p-8 shadow-lg">
          <h1 className="font-display text-3xl">Shipping Policy</h1>
          <div className="mt-4 space-y-3 leading-relaxed text-slate-600">
            <p>Orders are dispatched within 24–48 hours of confirmation. Standard delivery takes 3–7 working days depending on your location.</p>
            <p>For COD orders, 100 ₹ extra delivery charges are collected in advance before dispatch. Prepaid orders ship free as per applicable offers.</p>
            <p>Track your order anytime from <a href="/account/orders" className="font-semibold text-green-700 hover:underline">My Orders</a> or ask us on <a href="tel:+919956866752" className="font-semibold text-green-700 hover:underline">+91-9956866752</a>.</p>
          </div>
        </div>
      </section>
    </>
  )
}
