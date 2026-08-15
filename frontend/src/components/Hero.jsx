import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight, ShieldCheck, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const slides = [
  {
    eyebrow: "Rooted in Ayurveda",
    title: "Everyday wellness,\nmade naturally.",
    description: "Thoughtfully selected herbal remedies and daily essentials for a balanced, healthier routine.",
    action: "Shop wellness",
    to: "/shop",
    image: "https://images.unsplash.com/photo-1543362906-acfc16c67564?auto=format&fit=crop&w=2000&q=88",
    position: "center",
  },
  {
    eyebrow: "Seasonal essentials",
    title: "Care that begins\nwith nature.",
    description: "Discover pure oils, teas, powders and supplements crafted for the rituals that keep you feeling your best.",
    action: "Explore products",
    to: "/shop",
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=2000&q=88",
    position: "center",
  },
  {
    eyebrow: "Wellness, delivered",
    title: "Gentle rituals.\nReal results.",
    description: "Build a feel-good routine with quality herbal care, delivered straight to your doorstep.",
    action: "Find your ritual",
    to: "/category",
    image: "https://images.unsplash.com/photo-1611073615830-928cb4c3f1fa?auto=format&fit=crop&w=2000&q=88",
    position: "center",
  },
];

export default function Hero() {
  const [active, setActive] = useState(0);
  const slide = slides[active];

  useEffect(() => {
    const timer = window.setInterval(() => setActive((current) => (current + 1) % slides.length), 6000);
    return () => window.clearInterval(timer);
  }, []);

  const changeSlide = (direction) => {
    setActive((current) => (current + direction + slides.length) % slides.length);
  };

  return (
    <section className="relative isolate overflow-hidden bg-[#174d32]">
      <div className="relative min-h-[560px] sm:min-h-[610px]">
        <AnimatePresence mode="wait">
          <motion.img
            key={slide.image}
            src={slide.image}
            alt="Natural herbal wellness products"
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.75, ease: "easeInOut" }}
            className="absolute inset-0 h-full w-full object-cover"
            style={{ objectPosition: slide.position }}
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-r from-[#123b29] via-[#123b29]/85 to-[#123b29]/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#123b29]/55 via-transparent to-transparent" />

        <div className="section-shell relative z-10 flex min-h-[560px] items-center py-16 sm:min-h-[610px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.45, delay: 0.1 }}
              className="max-w-xl text-white"
            >
              <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[#f9cd73] backdrop-blur-sm">
                <Sparkles size={14} /> {slide.eyebrow}
              </p>
              <h1 className="mt-6 whitespace-pre-line font-serif text-5xl font-semibold leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl">
                {slide.title}
              </h1>
              <p className="mt-6 max-w-md text-base leading-7 text-white/85 sm:text-lg">{slide.description}</p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link to={slide.to} className="inline-flex items-center gap-2 rounded-full bg-[#f5bd56] px-6 py-3.5 text-sm font-bold text-[#173b29] transition hover:bg-[#ffcf76]">
                  {slide.action} <ArrowRight size={17} />
                </Link>
                <a href="#our-story" className="text-sm font-bold text-white underline-offset-4 transition hover:underline">Our promise</a>
              </div>
              <div className="mt-10 flex items-center gap-2 text-sm font-medium text-white/90">
                <ShieldCheck size={18} className="text-[#f5bd56]" /> Authentic ingredients, thoughtfully sourced
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="section-shell absolute inset-x-0 bottom-6 z-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {slides.map((item, index) => (
              <button
                key={item.title}
                type="button"
                onClick={() => setActive(index)}
                aria-label={`Show slide ${index + 1}`}
                aria-current={active === index ? "true" : "false"}
                className={`h-1.5 rounded-full transition-all ${active === index ? "w-9 bg-[#f5bd56]" : "w-4 bg-white/50 hover:bg-white"}`}
              />
            ))}
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={() => changeSlide(-1)} aria-label="Previous slide" className="rounded-full border border-white/30 bg-black/10 p-2.5 text-white backdrop-blur-sm transition hover:bg-white hover:text-[#174d32]"><ChevronLeft size={19} /></button>
            <button type="button" onClick={() => changeSlide(1)} aria-label="Next slide" className="rounded-full border border-white/30 bg-black/10 p-2.5 text-white backdrop-blur-sm transition hover:bg-white hover:text-[#174d32]"><ChevronRight size={19} /></button>
          </div>
        </div>
      </div>
    </section>
  );
}
