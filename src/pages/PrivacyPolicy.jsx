import Breadcrumb from '../components/Breadcrumb'

export default function PrivacyPolicy() {
  return (
    <>
      <Breadcrumb items={[{ label: 'Privacy Policy' }]} />
      <section className="section-shell py-10">
        <div className="rounded-[2rem] bg-white p-8 shadow-lg">
          <h1 className="font-display text-3xl">Privacy Policy</h1>
          <p className="mt-4 text-slate-600">This policy explains how Babaji Herbals handles personal data, payment details, and consumer communication with care and transparency.</p>
        </div>
      </section>
    </>
  )
}
