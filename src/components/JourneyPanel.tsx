import type { ProductKey } from "@/types";
import { PRODUCTS } from "@/lib/products";

interface StepDef {
  num: string;
  label: string;
  titleLines: [string, string]; // [normal, italic/gold]
  desc: string;
  details: { val: string; key: string }[];
}

function getSteps(key: ProductKey): StepDef[] {
  const d = PRODUCTS[key];
  return [
    { num:"01", label:"Origin", titleLines:["Green","Beans"], desc:"Unroasted Arabica seeds from Ethiopian highlands. Hand-sorted at 1,800m altitude. Naturally dried under the African sun.", details:[{val:"1800m",key:"Altitude"},{val:"100%",key:"Arabica"},{val:"95pts",key:"SCA Score"}] },
    { num:"02", label:"Roasting", titleLines:["The","Roast"], desc:"Drum roasted at 220°C for 11 minutes. The Maillard reaction transforms sugars. First crack at 196°C signals perfection.", details:[{val:"220°C",key:"Peak Temp"},{val:"11 min",key:"Duration"}] },
    { num:"03", label:"Grinding", titleLines:["Fine","Grind"], desc:"Freshly ground 90 seconds before brewing. Burr grinder set to 200 microns. Aroma released at its absolute peak.", details:[{val:"200μm",key:"Grind Size"},{val:"18g",key:"Dose"}] },
    { num:"04", label:d.s3lbl, titleLines:[d.s3ttl.split(" ")[0], d.s3ttl.split(" ").slice(1).join(" ") || d.s3ttl], desc:d.s3desc, details:[{val:d.s3v1,key:d.s3k1},{val:d.s3v2,key:d.s3k2}] },
    { num:"05", label:"Finish", titleLines:["Your", key==="coldbrew"?"Cold Brew":key==="cappuccino"?"Cappuccino":key==="latte"?"Latte":"Espresso"], desc:d.s4desc, details:[{val:d.s4v1,key:"Volume"},{val:d.s4v2,key:"Surface"}] },
  ];
}

interface Props {
  productKey: ProductKey;
  activeStep: number;
}

export default function JourneyPanel({ productKey, activeStep }: Props) {
  const steps = getSteps(productKey);

  return (
    <div style={{ display:"flex", flexDirection:"column", justifyContent:"center", position:"relative", overflow:"hidden", padding:"0 5vw", background:"var(--deep)", borderLeft:"1px solid var(--border)" }}>
      {/* bg glow */}
      <div style={{ position:"absolute", inset:0, pointerEvents:"none", background:"radial-gradient(ellipse 60% 60% at 80% 50%, rgba(201,153,58,.05), transparent)" }} />

      {steps.map((step, i) => (
        <div key={i} style={{ position:"absolute", top:"50%", left:"5vw", right:"4vw", opacity: i === activeStep ? 1 : 0, transform: i === activeStep ? "translateY(-50%)" : "translateY(calc(-50% + 22px))", transition:"opacity .55s ease, transform .55s ease" }}>
          <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"4.5rem", fontWeight:300, fontStyle:"italic", color:"rgba(201,153,58,.1)", lineHeight:1, marginBottom:"0.4rem" }}>{step.num}</div>
          <div style={{ fontSize:"0.58rem", letterSpacing:"0.5em", textTransform:"uppercase", color:"var(--gold)", marginBottom:"0.75rem" }}>{step.label}</div>
          <h3 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(1.9rem,3.2vw,3rem)", fontWeight:600, lineHeight:1.05, marginBottom:"1.1rem", color:"var(--cream)" }}>
            {step.titleLines[0]}<br />
            <em style={{ fontStyle:"italic", color:"var(--gold2)" }}>{step.titleLines[1]}</em>
          </h3>
          <p style={{ fontSize:"0.84rem", fontWeight:200, lineHeight:1.85, maxWidth:340, color:"var(--muted)" }}>{step.desc}</p>
          <div style={{ display:"flex", gap:"2rem", marginTop:"1.5rem" }}>
            {step.details.map((d, j) => (
              <div key={j}>
                <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"1.9rem", fontWeight:700, color:"var(--gold)", lineHeight:1 }}>{d.val}</div>
                <div style={{ fontSize:"0.56rem", letterSpacing:"0.3em", textTransform:"uppercase", color:"var(--muted)", marginTop:"0.25rem" }}>{d.key}</div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* progress pips */}
      <div style={{ position:"absolute", right:"2rem", top:"50%", transform:"translateY(-50%)", display:"flex", flexDirection:"column", gap:"0.7rem" }}>
        {steps.map((_, i) => (
          <div key={i} style={{ width:3, borderRadius:2, background: i === activeStep ? "var(--gold)" : "rgba(201,153,58,.15)", height: i === activeStep ? 38 : 26, transition:"all .4s ease" }} />
        ))}
      </div>
    </div>
  );
}
