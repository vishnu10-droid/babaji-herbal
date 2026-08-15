import { Link } from 'react-router-dom'
import Button from '../components/Button'

export default function NotFound() {
  return (
    <section className="section-shell flex min-h-[60vh] items-center justify-center py-10">
      <div className="rounded-[2rem] bg-white p-8 text-center shadow-lg">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#0B6B3A]">404</p>
        <h1 className="font-display text-4xl">Page not found</h1>
        <p className="mt-3 text-slate-600">The page you were looking for is not available.</p>
        <div className="mt-6">
          <Link to="/"><Button className="rounded-full">Back to Home</Button></Link>
        </div>
      </div>
    </section>
  )
}
