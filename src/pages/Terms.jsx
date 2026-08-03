import Breadcrumb from '../components/Breadcrumb'

export default function Terms() {
  return (
    <>
      <Breadcrumb items={[{ label: 'Terms' }]} />
      <section className="section-shell py-10">
        <div className="rounded-[2rem] bg-white p-8 shadow-lg">
          <h1 className="font-display text-3xl">Terms & Conditions</h1>
          <p className="mt-4 text-slate-600">These terms explain shopping, order processing, delivery expectations, and user responsibilities when using the Babaji Herbals storefront.</p>
        </div>
      </section>
    </>
  )
}
