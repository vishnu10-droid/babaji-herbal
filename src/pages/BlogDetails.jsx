import Breadcrumb from '../components/Breadcrumb'

export default function BlogDetails() {
  return (
    <>
      <Breadcrumb items={[{ label: 'Blog', to: '/blog' }, { label: 'Details' }]} />
      <section className="section-shell py-10">
        <article className="rounded-[2rem] bg-white p-8 shadow-lg">
          <h1 className="font-display text-4xl">How Herbal Oils Strengthen Daily Routines</h1>
          <p className="mt-4 text-slate-600">Long-form editorial content can live here with rich wellness storytelling, ingredient notes, and ritual suggestions for customers who want more guidance.</p>
        </article>
      </section>
    </>
  )
}
