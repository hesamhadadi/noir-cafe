import type { ProductKey } from "@/types";
import { PRODUCTS } from "@/lib/products";

interface Props {
  productKey: ProductKey;
}

export default function OrderBar({ productKey }: Props) {
  const d = PRODUCTS[productKey];

  return (
    <section
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "3rem",
        padding: "5rem 5vw",
        background: "var(--deep)",
        borderTop: "1px solid var(--border)",
      }}
    >
      <div>
        <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(2.5rem,5vw,3.5rem)", fontWeight: 300, fontStyle: "italic", color: "var(--cream)" }}>
          {d.label} <span style={{ color: "var(--gold2)" }}>·</span>
        </div>
        <p style={{ fontSize: "0.82rem", fontWeight: 200, lineHeight: 1.7, marginTop: "0.6rem", maxWidth: 380, color: "var(--muted)" }}>
          {d.desc}
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "1.2rem" }}>
        <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "2.8rem", fontWeight: 700, color: "var(--gold)" }}>
          {d.price}
        </div>
        <button
          onClick={() => alert("Order placed! Thank you.")}
          style={{ background: "var(--gold)", color: "var(--ink)", border: "none", padding: "1rem 3rem", fontFamily: "'Cormorant Garamond',serif", fontSize: "1rem", fontStyle: "italic", fontWeight: 700, letterSpacing: "0.06em", cursor: "none", transition: "all .25s" }}
          onMouseEnter={(e) => { (e.target as HTMLButtonElement).style.background = "var(--gold2)"; (e.target as HTMLButtonElement).style.transform = "scale(1.02)"; }}
          onMouseLeave={(e) => { (e.target as HTMLButtonElement).style.background = "var(--gold)"; (e.target as HTMLButtonElement).style.transform = "scale(1)"; }}
        >
          Order Now
        </button>
      </div>
    </section>
  );
}
