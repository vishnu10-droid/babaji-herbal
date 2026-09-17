import Breadcrumb from '../components/Breadcrumb'

export default function PaymentPolicy() {
  return (
    <>
      <Breadcrumb items={[{ label: 'Payment Policy' }]} />
      <section className="section-shell py-10">
        <div className="rounded-[2rem] bg-white p-8 shadow-lg">
          <h1 className="font-display text-3xl">Payment Policy</h1>
          <div className="mt-4 space-y-3 leading-relaxed text-slate-600">
            <p>We accept UPI payments, bank transfers, and Cash on Delivery (COD). For COD orders, delivery charges of 100 ₹ extra are collected in advance.</p>
            <p>For prepaid orders: scan the QR code shown in the website footer, complete the payment, and send the payment screenshot on <a href="https://wa.me/919956866752" target="_blank" rel="noreferrer" className="font-semibold text-green-700 hover:underline">WhatsApp — 9956866752</a>. Your order is confirmed once the screenshot is verified.</p>
            <p>Never share OTPs or card details with anyone. Our team only confirms payments on the official number +91-9956866752.</p>
          </div>
        </div>
      </section>
    </>
  )
}
