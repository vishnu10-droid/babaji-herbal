import Breadcrumb from '../components/Breadcrumb'

export default function About() {
  return (
    <>
      <Breadcrumb items={[{ label: 'About Us' }]} />
      <section className="section-shell py-10">
        <div className="rounded-[2rem] bg-white p-8 shadow-lg">
          <h1 className="font-display text-3xl">About Us — Babaji Herbals</h1>
          <p className="mt-4 leading-relaxed text-slate-600">
            Your Single Destination For All Needs. Babaji Herbals brings high-quality Ayurvedic and herbal
            products formulated for everyday balance, health, and natural wellness. Provided by AYULIFE HEALTH SOLUTION,
            our store focuses on purity, honest pricing, and dependable delivery across India.
          </p>
          <p className="mt-3 leading-relaxed text-slate-600">
            For COD orders, delivery charges of 100 ₹ extra are collected in advance. For prepaid orders, simply scan
            our QR code, pay, and send the screenshot on <a href="tel:+919956866752" className="font-semibold text-green-700 hover:underline">+91-9956866752</a>.
          </p>
        </div>
      </section>
    </>
  )
}
