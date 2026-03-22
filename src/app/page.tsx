"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import type { ProductKey } from "@/types";

// ── Server-safe components (no browser APIs) ──────────
import Nav from "@/components/Nav";
import OrderBar from "@/components/OrderBar";
import Footer from "@/components/Footer";

// ── Client-only components (Three.js / window / document)
// ssr: false prevents Next.js from attempting server-side render
const Cursor = dynamic(() => import("@/components/Cursor"), { ssr: false });
const HeroSection = dynamic(() => import("@/components/HeroSection"), { ssr: false });
const ProductsSection = dynamic(() => import("@/components/ProductsSection"), { ssr: false });
const JourneySection = dynamic(() => import("@/components/JourneySection"), { ssr: false });

export default function Home() {
  const [selected, setSelected] = useState<ProductKey>("espresso");

  const handleSelect = (key: ProductKey) => {
    setSelected(key);
    requestAnimationFrame(() => {
      document.getElementById("journey")?.scrollIntoView({ behavior: "smooth" });
    });
  };

  return (
    <>
      <Cursor />
      <Nav />
      <main>
        <HeroSection />
        <ProductsSection selected={selected} onSelect={handleSelect} />
        <div id="journey">
          <JourneySection productKey={selected} />
        </div>
        <OrderBar productKey={selected} />
        <Footer />
      </main>
    </>
  );
}
