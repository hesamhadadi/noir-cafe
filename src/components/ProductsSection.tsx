"use client";
import { useEffect, useRef } from "react";
import type { ProductKey } from "@/types";
import { PRODUCTS, PRODUCT_KEYS } from "@/lib/products";
import ProductCard from "./ProductCard";

interface Props {
  selected: ProductKey;
  onSelect: (key: ProductKey) => void;
}

export default function ProductsSection({ selected, onSelect }: Props) {
  const secRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const els = secRef.current?.querySelectorAll<HTMLElement>(".reveal");
    if (!els) return;
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("in")),
      { threshold: 0.15 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={secRef} style={{ padding:"8rem 5vw 5rem" }}>
      <p className="reveal" style={{ fontSize:"0.6rem", letterSpacing:"0.5em", textTransform:"uppercase", color:"var(--gold)", marginBottom:"1rem" }}>
        Choose your drink
      </p>
      <h2 className="reveal" style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(2.4rem,5vw,4rem)", fontWeight:300, lineHeight:1, marginBottom:"3.5rem", color:"var(--cream)" }}>
        Select a product.<br />
        <em style={{ fontStyle:"italic", color:"var(--gold2)" }}>Watch it come to life.</em>
      </h2>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"1.5px", background:"var(--border)" }}>
        {PRODUCT_KEYS.map((key, i) => (
          <ProductCard
            key={key}
            productKey={key}
            def={PRODUCTS[key]}
            index={i}
            selected={selected === key}
            onSelect={() => onSelect(key)}
          />
        ))}
      </div>
    </section>
  );
}
