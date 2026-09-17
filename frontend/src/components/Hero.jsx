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

/* =========================================================
   RESOLVE IMAGE URL
   Local uploads:
   /uploads/hero/image.jpg

   ImageKit / external:
   https://....
========================================================= */

const resolveImage = (image) => {
  if (!image) return "";

  if (/^https?:\/\//i.test(image)) {
    return image;
  }

  return `${API_ORIGIN}${image.startsWith("/") ? image : `/${image}`}`;
};

/* =========================================================
   FALLBACK SLIDE
========================================================= */

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

/* =========================================================
   HERO COMPONENT
========================================================= */

export default function Hero() {
  const [slides, setSlides] = useState([]);

  const [active, setActive] = useState(0);

  const [loading, setLoading] = useState(true);

  /* =========================================================
     FETCH HERO SLIDES
  ========================================================= */

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

  /* =========================================================
     AUTO SLIDER
  ========================================================= */

  useEffect(() => {
    if (slides.length <= 1) return;

    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % slides.length);
    }, 6000);

    return () => {
      window.clearInterval(timer);
    };
  }, [slides.length]);

  /* =========================================================
     RESET ACTIVE INDEX
  ========================================================= */

  useEffect(() => {
    if (slides.length > 0 && active >= slides.length) {
      setActive(0);
    }
  }, [active, slides.length]);

  /* =========================================================
     CHANGE SLIDE
  ========================================================= */

  const changeSlide = (direction) => {
    if (!slides.length) return;

    setActive(
      (current) => (current + direction + slides.length) % slides.length,
    );
  };

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <section className="relative flex min-h-[300px] items-center justify-center bg-slate-900 sm:min-h-[380px] lg:min-h-[430px]">
        <div className="text-center text-white">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-white/30 border-t-white" />

          <p className="mt-3 text-xs text-white/70">Loading...</p>
        </div>
      </section>
    );
  }

  /* =========================================================
     ACTIVE SLIDE
  ========================================================= */

  const hasSlides = slides.length > 0;

  const slide = hasSlides ? slides[active] || slides[0] : FALLBACK_SLIDE;

  const imageSrc = resolveImage(slide?.image);

  /* =========================================================
     RETURN
  ========================================================= */

  return (
    <section className="relative isolate w-full overflow-hidden">
      {/* =====================================================
          HERO BANNER CONTAINER

          Original wide banner ratio maintained
      ===================================================== */}

      <div
        className="
          relative
          aspect-[3/1]
          min-h-[250px]
          w-full
          overflow-hidden
          bg-slate-900

          sm:min-h-[320px]

          md:min-h-[360px]

          lg:min-h-[400px]

          xl:min-h-[430px]
        "
      >
        {/* ===================================================
            IMAGE
        =================================================== */}

        <AnimatePresence mode="wait">
          {imageSrc ? (
            <motion.img
              key={slide._id || slide.image}
              src={imageSrc}
              alt={slide.title || "Hero image"}
              initial={{
                opacity: 0,
                scale: 1.02,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                scale: 1.01,
              }}
              transition={{
                duration: 0.65,
                ease: "easeInOut",
              }}
              className="
                absolute
                inset-0
                h-full
                w-full
                object-cover
              "
              style={{
                objectPosition: slide.position || "center",
              }}
            />
          ) : null}
        </AnimatePresence>

        {/* ===================================================
            VERY LIGHT OVERLAY

            Green overlay completely removed.
        =================================================== */}

        <div className="pointer-events-none absolute inset-0 bg-black/5" />

        {/* ===================================================
            CONTENT
        =================================================== */}

        <div
          className="
            section-shell
            relative
            z-10
            flex
            h-full
            min-h-[250px]
            items-center
            py-6

            sm:min-h-[320px]
            sm:py-8

            md:min-h-[360px]

            lg:min-h-[400px]

            xl:min-h-[430px]
          "
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={slide._id || active}
              initial={{
                opacity: 0,
                y: 18,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: -10,
              }}
              transition={{
                duration: 0.45,
                delay: 0.05,
              }}
              className="
                max-w-xl
                text-white
              "
            >
              {/* =================================================
                  EYEBROW
              ================================================= */}

              {slide.eyebrow ? (
                <p
                  className="
                    inline-flex
                    items-center
                    gap-2
                    rounded-full
                    border
                    border-white/30
                    bg-black/15
                    px-3
                    py-1.5
                    text-[9px]
                    font-bold
                    uppercase
                    tracking-[0.15em]
                    text-[#f9cd73]
                    backdrop-blur-sm

                    sm:px-4
                    sm:py-2
                    sm:text-xs
                  "
                >
                  <Sparkles size={12} className="sm:h-[14px] sm:w-[14px]" />

                  {slide.eyebrow}
                </p>
              ) : null}

              {/* =================================================
                  TITLE
              ================================================= */}

              <h1
                className="
                  mt-3
                  max-w-xl
                  whitespace-pre-line
                  font-serif
                  text-3xl
                  font-semibold
                  leading-[1.03]
                  tracking-tight
                  text-white
                  drop-shadow-lg

                  sm:mt-5
                  sm:text-4xl

                  md:text-5xl

                  lg:text-6xl

                  xl:text-7xl
                "
              >
                {slide.title}
              </h1>

              {/* =================================================
                  DESCRIPTION

                  Thoda neeche kiya gaya
              ================================================= */}

              {slide.description ? (
                <p
                  className="
                    mt-6
                    max-w-md
                    text-xs
                    leading-5
                    text-white
                    drop-shadow-md

                    sm:mt-8
                    sm:text-sm
                    sm:leading-6

                    md:text-base
                    md:leading-7
                  "
                >
                  {slide.description}
                </p>
              ) : null}

              {/* =================================================
                  BUTTON

                  Paragraph ke neeche
              ================================================= */}

              {/* =================================================
                  TRUST

                  Slightly lower
              ================================================= */}

              <div
                className="
                  mt-6
                  flex
                  items-center
                  gap-2
                  text-[10px]
                  font-medium
                  text-white
                  drop-shadow-md

                  sm:mt-8
                  sm:text-sm
                "
              >
          

              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* =====================================================
            SLIDER CONTROLS
        ===================================================== */}

        {slides.length > 1 && (
          <div
            className="
              section-shell
              absolute
              inset-x-0
              bottom-3
              z-20
              flex
              items-center
              justify-between

              sm:bottom-5
            "
          >
            {/* =================================================
                DOTS
            ================================================= */}

            <div className="flex items-center gap-1.5 sm:gap-2">
              {slides.map((item, index) => (
                <button
                  key={item._id || index}
                  type="button"
                  onClick={() => setActive(index)}
                  aria-label={`Show slide ${index + 1}`}
                  aria-current={active === index ? "true" : "false"}
                  className={`
                      h-1
                      rounded-full
                      transition-all

                      sm:h-1.5

                      ${
                        active === index
                          ? "w-7 bg-[#f5bd56] sm:w-9"
                          : "w-3 bg-white/60 hover:bg-white sm:w-4"
                      }
                    `}
                />
              ))}
            </div>

            {/* =================================================
                ARROWS
            ================================================= */}

            <div className="flex gap-1.5 sm:gap-2">
              <button
                type="button"
                onClick={() => changeSlide(-1)}
                aria-label="Previous slide"
                className="
                  rounded-full
                  border
                  border-white/40
                  bg-black/20
                  p-1.5
                  text-white
                  shadow-md
                  backdrop-blur-sm
                  transition

                  hover:bg-white
                  hover:text-[#174d32]

                  sm:p-2.5
                "
              >
                <ChevronLeft size={15} className="sm:h-[19px] sm:w-[19px]" />
              </button>

              <button
                type="button"
                onClick={() => changeSlide(1)}
                aria-label="Next slide"
                className="
                  rounded-full
                  border
                  border-white/40
                  bg-black/20
                  p-1.5
                  text-white
                  shadow-md
                  backdrop-blur-sm
                  transition

                  hover:bg-white
                  hover:text-[#174d32]

                  sm:p-2.5
                "
              >
                <ChevronRight size={15} className="sm:h-[19px] sm:w-[19px]" />
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
