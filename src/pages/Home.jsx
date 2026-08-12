import Hero from "../components/Hero";
import AboutSection from "../components/AboutSection";
import BestSeller from "../components/BestSeller";
import OfferBanner from "../components/OfferBanner";
import StatsSection from "../components/StatsSection";
import FAQ from "../components/FAQ";
import Newsletter from "../components/Newsletter";
import { useEffect } from "react";
import { useState } from "react";
import ProductCard from "../components/ProductCard";

export default function Home() {
  const [item, setTrending] = useState([]);
  const fetchProducts = async () => {
    const response = await fetch("http://localhost:3000/api/products", {
      method: "GET",
    });
    const data = await response.json();
    console.log(data);
    console.log("IMAGES:", data[0].images);
    setTrending(data);
  };
  useEffect(() => {
    fetchProducts();
  }, []);
  return (
    <>
      <Hero />
      <section className="section-shell py-14">
        <div className="mb-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#0B6B3A]">
            Trending
          </p>
          <h2 className="font-display text-3xl font-semibold">
            Trending Products
          </h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
         
            {item.map((product) => <ProductCard key={product._id} item={product} />)}
    
        </div>
      </section>
      <OfferBanner />
      <AboutSection />
      <StatsSection />
      <BestSeller />
      <FAQ />
      <Newsletter />
    </>
  );
}
