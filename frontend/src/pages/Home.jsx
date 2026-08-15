import { useEffect } from "react";
import { Award, ArrowRight, Headphones, Leaf, Truck } from "lucide-react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Hero from "../components/Hero";
import AboutSection from "../components/AboutSection";
import OfferBanner from "../components/OfferBanner";
import StatsSection from "../components/StatsSection";
import FAQ from "../components/FAQ";
import Newsletter from "../components/Newsletter";
import ProductCard from "../components/ProductCard";
import CategoryShowcase from "../components/CategoryShowcase";
import { fetchproduct } from "../store/slice/product.Slice";

const assurances = [
  { icon: Leaf, title: "Natural ingredients", text: "Thoughtfully sourced herbal care" },
  { icon: Award, title: "Quality checked", text: "Made with care, batch by batch" },
  { icon: Truck, title: "Easy delivery", text: "Wellness delivered to your door" },
  { icon: Headphones, title: "Here to help", text: "Friendly support when you need it" },
];

function AssuranceStrip() {
  return (
    <section className="border-y border-[#dce8dc] bg-white">
      <div className="section-shell grid divide-y divide-[#dce8dc] sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4">
        {assurances.map(({ icon: Icon, title, text }) => (
          <div key={title} className="flex items-center gap-3 py-5 sm:px-5 lg:px-7">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#edf4eb] text-[#28714a]"><Icon size={19} /></span>
            <div><p className="text-sm font-bold text-[#173b29]">{title}</p><p className="mt-0.5 text-xs text-slate-500">{text}</p></div>
          </div>
        ))}
      </div>
    </section>
  );
}

function ProductSkeleton() {
  return <div className="overflow-hidden rounded-2xl border border-[#dce8dc] bg-white p-4"><div className="h-56 animate-pulse rounded-xl bg-[#edf4eb]" /><div className="mt-5 h-3 w-20 animate-pulse rounded bg-slate-100" /><div className="mt-3 h-5 w-3/4 animate-pulse rounded bg-slate-100" /><div className="mt-5 h-5 w-1/3 animate-pulse rounded bg-slate-100" /></div>;
}

export default function Home() {
  const dispatch = useDispatch();
  const { data: products = [], loading, error } = useSelector((state) => state.product);

  useEffect(() => { dispatch(fetchproduct()); }, [dispatch]);

  return (
    <>
      <Hero />
      <AssuranceStrip />
      <CategoryShowcase limit={8} />

      <section className="bg-[#f8faf7] py-16">
        <div className="section-shell">
          <div className="mb-9 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#28714a]">Customer favourites</p>
              <h2 className="mt-3 font-serif text-4xl font-semibold text-[#173b29] sm:text-5xl">Wellness, chosen by you</h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500">Shop everyday herbal essentials loved for their purity, simplicity and feel-good results.</p>
            </div>
            <Link to="/shop" className="inline-flex shrink-0 items-center gap-2 text-sm font-bold text-[#28714a] transition hover:gap-3">View all products <ArrowRight size={17} /></Link>
          </div>

          {error && <p className="mb-6 rounded-xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-700">We couldn’t load the product collection right now. Please try again shortly.</p>}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {loading && Array.from({ length: 4 }).map((_, index) => <ProductSkeleton key={index} />)}
            {!loading && products.slice(0, 8).map((product) => <ProductCard key={product._id} item={product} />)}
          </div>
          {!loading && !error && products.length === 0 && <div className="rounded-2xl border border-dashed border-[#c8dec9] bg-white p-10 text-center text-sm text-slate-500">Our first collection is being prepared. Please check back soon.</div>}
        </div>
      </section>

      <OfferBanner />
      <AboutSection />
      <StatsSection />
      <FAQ />
      <Newsletter />
    </>
  );
}
