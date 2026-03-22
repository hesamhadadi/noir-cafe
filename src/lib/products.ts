import type { ProductDef, ProductKey } from "@/types";

export const PRODUCTS: Record<ProductKey, ProductDef> = {
  espresso: {
    cupC: 0x100806, sauC: 0x090504, liqC: 0x0c0503, cremaC: 0xbf6020,
    milkC: null, foamC: null, hasIce: false,
    label: "Espresso", price: "45,000 T",
    desc: "Single origin Ethiopia Yirgacheffe. Intense, syrupy body with dark cherry and tobacco.",
    s3lbl: "Extraction", s3ttl: "The Shot",
    s3desc: "93°C water forced at 9 bar through the puck. 25–30 seconds. Rich crema crowns the surface.",
    s3v1: "93°C", s3k1: "Water Temp", s3v2: "9 bar", s3k2: "Pressure",
    s4ttl: "Your Espresso", s4desc: "Dark cherry, bitter chocolate, caramel finish. 30ml of pure intensity.",
    s4v1: "30ml", s4v2: "Crema",
  },
  latte: {
    cupC: 0xf4efe6, sauC: 0xece5d6, liqC: 0x6b3c18, cremaC: 0xb07038,
    milkC: 0xf8f0e2, foamC: null, hasIce: false,
    label: "Latte", price: "58,000 T",
    desc: "Double espresso with 180ml of silky micro-foam steamed whole milk. Velvety and smooth.",
    s3lbl: "Steaming", s3ttl: "The Steam",
    s3desc: "Whole milk heated to 65°C with a steam wand. Micro-foam created — velvety, glossy, pourable.",
    s3v1: "65°C", s3k1: "Milk Temp", s3v2: "3 min", s3k2: "Steam Time",
    s4ttl: "Your Latte", s4desc: "Double shot drowned in silky steamed milk. Tulip latte art on the surface.",
    s4v1: "220ml", s4v2: "Micro-foam",
  },
  cappuccino: {
    cupC: 0xfaf6ee, sauC: 0xf0e8d6, liqC: 0x3c1e0a, cremaC: 0xae6828,
    milkC: 0xfaf6f0, foamC: 0xfcf8f2, hasIce: false,
    label: "Cappuccino", price: "55,000 T",
    desc: "Equal thirds espresso, steamed milk and thick dry foam. The classic Italian ratio.",
    s3lbl: "Frothing", s3ttl: "The Foam",
    s3desc: "Milk frothed to a stiff, dry micro-foam at 65°C. Equal thirds of espresso, milk and foam.",
    s3v1: "65°C", s3k1: "Milk Temp", s3v2: "⅓/⅓/⅓", s3k2: "Ratio",
    s4ttl: "Your Cappuccino", s4desc: "Bold espresso base with equal thirds. Thick dry foam dusted with cacao.",
    s4v1: "150ml", s4v2: "Dry Foam",
  },
  coldbrew: {
    cupC: 0x0a1520, sauC: 0x070d14, liqC: 0x040c11, cremaC: 0x1a4858,
    milkC: null, foamC: null, hasIce: true,
    label: "Cold Brew", price: "65,000 T",
    desc: "Coarsely ground coffee steeped cold for 18 hours. Smooth, low-acid concentrate over ice.",
    s3lbl: "Cold Steep", s3ttl: "18 Hour Steep",
    s3desc: "Coarse grounds steeped in filtered water at 4°C for 18 hours. No heat — no bitterness.",
    s3v1: "4°C", s3k1: "Water Temp", s3v2: "18h", s3k2: "Steep Time",
    s4ttl: "Your Cold Brew", s4desc: "Smooth concentrate over hand-chipped ice. Chocolate, toffee, zero bitterness.",
    s4v1: "350ml", s4v2: "Over Ice",
  },
};

export const PRODUCT_KEYS: ProductKey[] = [
  "espresso",
  "latte",
  "cappuccino",
  "coldbrew",
];

export const PRODUCT_TAGS: Record<ProductKey, string> = {
  espresso: "Pure · Intense · Signature",
  latte: "Smooth · Creamy · Balanced",
  cappuccino: "Bold · Frothy · Classic",
  coldbrew: "Slow · Smooth · Refreshing",
};
