import { useEffect, useState } from "react";

import { AnimatePresence, motion } from "framer-motion";

import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { Link } from "react-router-dom";

import { getActiveHeroSlides } from "../service/heroSlide.api";

import { API_ORIGIN } from "../config/config";

/* Resolve local (/uploads/...) vs full ImageKit (https://...) URLs */
const resolveImage = (image) => {
  if (!image) return "";
  if (/^https?:\/\//i.test(image)) return image;
  return `${API_ORIGIN}${image.startsWith("/") ? image : `/${image}`}`;
};

/* Static fallback when no active slides exist */
const FALLBACK_SLIDE = {
  _id: "fallback",
  eyebrow: "Rooted in Ayurveda",
  title: "Everyday wellness,\nmade naturally.",
  description:
    "Thoughtfully selected herbal remedies for daily balance, calm and vitality.",
  action: "Shop wellness",
  to: "/shop",
  image: "",
};

export default function Hero() {
  const [slides, setSlides] = useState([]);

  const [active, setActive] = useState(0);

  const [loading, setLoading] = useState(true);

  /* =========================
     FETCH SLIDES
  ========================= */

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const data = await getActiveHeroSlides();

        setSlides(data?.slides || []);
      } catch (error) {
        console.error("Hero slides error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSlides();
  }, []);

  /* =========================
     AUTO SLIDER
  ========================= */

  useEffect(() => {
    if (slides.length <= 1) return;

    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % slides.length);
    }, 6000);

    return () => window.clearInterval(timer);
  }, [slides.length]);

  /* =========================
     RESET ACTIVE
  ========================= */

  useEffect(() => {
    if (active >= slides.length) {
      setActive(0);
    }
  }, [active, slides.length]);

  /* =========================
     CHANGE SLIDE
  ========================= */

  const changeSlide = (direction) => {
    if (!slides.length) return;

    setActive(
      (current) => (current + direction + slides.length) % slides.length,
    );
  };

  /* =========================
     LOADING
  ========================= */

  if (loading) {
    return (
      <section className="relative flex min-h-[560px] items-center justify-center overflow-hidden bg-[#174d32]">
        <div className="text-center text-white">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-white/30 border-t-white" />

          <p className="mt-3 text-xs text-white/70">Loading...</p>
        </div>
      </section>
    );
  }

  /* =========================
     EMPTY -> FALLBACK
  ========================= */

  const hasSlides = slides.length > 0;

  const slide = hasSlides ? slides[active] || slides[0] : FALLBACK_SLIDE;

  const imageSrc = resolveImage(slide?.image);

  return (
    <section className="relative isolate overflow-hidden bg-[#174d32]">
      <div className="relative min-h-[560px] sm:min-h-[610px]">
        {/* IMAGE */}

        <AnimatePresence mode="wait">
          {imageSrc ? (
          <motion.img
            key={slide._id || slide.image}
            src={imageSrc}
            alt={slide.title || "Hero image"}
            initial={{
              opacity: 0,
              scale: 1.06,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              scale: 1.02,
            }}
            transition={{
              duration: 0.75,
              ease: "easeInOut",
            }}
            className="absolute inset-0 h-full w-full object-cover"
            style={{
              objectPosition: slide.position || "center",
            }}
          />
          ) : null}
        </AnimatePresence>

        {/* OVERLAY */}

        <div className="absolute inset-0 bg-gradient-to-r from-[#123b29] via-[#123b29]/85 to-[#123b29]/20" />

        <div className="absolute inset-0 bg-gradient-to-t from-[#123b29]/55 via-transparent to-transparent" />

        {/* CONTENT */}

        <div className="section-shell relative z-10 flex min-h-[560px] items-center py-16 sm:min-h-[610px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={slide._id || active}
              initial={{
                opacity: 0,
                y: 22,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: -12,
              }}
              transition={{
                duration: 0.45,
                delay: 0.1,
              }}
              className="max-w-xl text-white"
            >
              {/* EYEBROW */}

              {slide.eyebrow ? (
              <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[#f9cd73] backdrop-blur-sm">
                <Sparkles size={14} />

                {slide.eyebrow}
              </p>
              ) : null}

              {/* TITLE */}

              <h1 className="mt-6 whitespace-pre-line font-serif text-5xl font-semibold leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl">
                {slide.title}
              </h1>

              {/* DESCRIPTION */}

              {slide.description ? (
              <p className="mt-6 max-w-md text-base leading-7 text-white/85 sm:text-lg">
                {slide.description}
              </p>
              ) : null}

              {/* BUTTON */}

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  to={slide.to || "/shop"}
                  className="inline-flex items-center gap-2 rounded-full bg-[#f5bd56] px-6 py-3.5 text-sm font-bold text-[#173b29] transition hover:bg-[#ffcf76]"
                >
                  {slide.action || "Explore"}

                  <ArrowRight size={17} />
                </Link>

                <a
                  href="#our-story"
                  className="text-sm font-bold text-white underline-offset-4 transition hover:underline"
                >
                  Our promise
                </a>
              </div>

              {/* TRUST */}

              <div className="mt-10 flex items-center gap-2 text-sm font-medium text-white/90">
                <ShieldCheck size={18} className="text-[#f5bd56]" />
                Authentic ingredients, thoughtfully sourced
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* CONTROLS */}

        {slides.length > 1 && (
          <div className="section-shell absolute inset-x-0 bottom-6 z-20 flex items-center justify-between">
            {/* DOTS */}

            <div className="flex items-center gap-2">
              {slides.map((item, index) => (
                <button
                  key={item._id || index}
                  type="button"
                  onClick={() => setActive(index)}
                  aria-label={`Show slide ${index + 1}`}
                  aria-current={active === index ? "true" : "false"}
                  className={`h-1.5 rounded-full transition-all ${
                    active === index
                      ? "w-9 bg-[#f5bd56]"
                      : "w-4 bg-white/50 hover:bg-white"
                  }`}
                />
              ))}
            </div>

            {/* ARROWS */}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => changeSlide(-1)}
                aria-label="Previous slide"
                className="rounded-full border border-white/30 bg-black/10 p-2.5 text-white backdrop-blur-sm transition hover:bg-white hover:text-[#174d32]"
              >
                <ChevronLeft size={19} />
              </button>

              <button
                type="button"
                onClick={() => changeSlide(1)}
                aria-label="Next slide"
                className="rounded-full border border-white/30 bg-black/10 p-2.5 text-white backdrop-blur-sm transition hover:bg-white hover:text-[#174d32]"
              >
                <ChevronRight size={19} />
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
