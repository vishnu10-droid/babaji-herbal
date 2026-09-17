import Breadcrumb from '../components/Breadcrumb'

export default function ReturnRefundPolicy() {
  return (
    <>
      <Breadcrumb items={[{ label: 'Return & Refund Policy' }]} />
      <section className="section-shell py-10">
        <div className="rounded-[2rem] bg-white p-8 shadow-lg">
          <h1 className="font-display text-3xl">Return &amp; Refund Policy</h1>
          <div className="mt-4 space-y-3 leading-relaxed text-slate-600">
            <p>Unopened and unused products in original packaging can be returned within 7 days of delivery. To start a return, contact us on <a href="tel:+919956866752" className="font-semibold text-green-700 hover:underline">+91-9956866752</a> with your order ID and unboxing photos.</p>
            <p>Once the returned product passes quality inspection, refunds are issued to the original payment method within 5–7 working days. COD advance amounts are refunded via UPI/bank transfer.</p>
            <p>Damaged, expired, or wrong items are replaced free of charge — just share the screenshot of the issue on WhatsApp at <a href="https://wa.me/919956866752" target="_blank" rel="noreferrer" className="font-semibold text-green-700 hover:underline">9956866752</a>.</p>
          </div>
        </div>
      </section>
    </>
  )
}
