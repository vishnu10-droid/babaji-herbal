import Breadcrumb from '../components/Breadcrumb'
import Button from '../components/Button'

export default function Contact() {
  return (
    <>
      <Breadcrumb items={[{ label: 'Contact' }]} />
      <section className="section-shell py-10">
        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[2rem] bg-white p-6 shadow-lg">
            <h1 className="font-display text-3xl">Contact Us</h1>
            <p className="mt-3 text-slate-600">Reach our wellness support team for product guidance and partnership requests.</p>
          </div>
          <div className="rounded-[2rem] bg-[#eef6ef] p-6 shadow-lg">
            <div className="space-y-3">
              <input className="w-full rounded-2xl border border-[#0B6B3A]/10 px-4 py-3" placeholder="Name" />
              <input className="w-full rounded-2xl border border-[#0B6B3A]/10 px-4 py-3" placeholder="Email" />
              <textarea className="w-full rounded-2xl border border-[#0B6B3A]/10 px-4 py-3" rows="5" placeholder="Message" />
            </div>
            <div className="mt-4">
              <Button className="rounded-full">Send Message</Button>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
