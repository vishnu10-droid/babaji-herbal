import { useState } from 'react'
import { ChevronRight } from 'lucide-react'

const faqs = [
  {
    question: 'Are your products 100% natural?',
    answer: 'Yes. We focus on plant-based, toxin-free formulas and transparent ingredient sourcing.',
  },
  {
    question: 'How long does delivery take?',
    answer: 'Standard delivery typically reaches customers within 2-4 business days across major cities.',
  },
  {
    question: 'Can I return a product?',
    answer: 'We offer a 7-day return window for unopened products in original packaging.',
  },
]

export default function FAQ() {
  const [open, setOpen] = useState(0)

  return (
    <section className="section-shell py-14">
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#0B6B3A]">FAQ</p>
          <h2 className="font-display text-3xl">Frequently Asked Questions</h2>
        </div>
        <div className="space-y-3">
          {faqs.map((item, index) => (
            <div key={item.question} className="rounded-2xl border border-[#0B6B3A]/10 bg-white p-4 shadow">
              <button
                className="flex w-full items-center justify-between gap-4 text-left"
                onClick={() => setOpen(open === index ? -1 : index)}
              >
                <span className="font-semibold text-[#1B1B1B]">{item.question}</span>
                <ChevronRight className={open === index ? 'rotate-90 text-[#0B6B3A]' : ''} size={18} />
              </button>
              {open === index ? <p className="mt-3 text-sm text-slate-600">{item.answer}</p> : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
