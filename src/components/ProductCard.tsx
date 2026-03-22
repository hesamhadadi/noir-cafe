"use client";
import { useEffect, useRef } from "react";
import type { ProductKey, ProductDef } from "@/types";
import { PRODUCT_TAGS } from "@/lib/products";

interface Props {
  productKey: ProductKey;
  def: ProductDef;
  index: number;
  selected: boolean;
  onSelect: () => void;
}

export default function ProductCard({ productKey, def, index, selected, onSelect }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef   = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const cv  = canvasRef.current;
    const par = wrapRef.current;
    if (!cv || !par) return;

    let rafId = 0, destroyed = false;

    import("three").then((THREE) => {
      if (destroyed) return;

      const sz = par.clientWidth || 220;
      const R  = new THREE.WebGLRenderer({ canvas: cv, alpha: true, antialias: true });
      R.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      R.setSize(sz, sz);

      const S = new THREE.Scene();
      const C = new THREE.PerspectiveCamera(45, 1, 0.1, 50);
      C.position.set(0, 0.5, 4); C.lookAt(0, 0, 0);

      S.add(new THREE.AmbientLight(0xffffff, 0.45));
      const kl = new THREE.PointLight(0xffd090, 3.5, 12); kl.position.set(2, 3, 2); S.add(kl);
      const fl = new THREE.PointLight(0xffc06a, 0.6, 10); fl.position.set(-2, -1, 1); S.add(fl);

      const ph = (c: number, s = 100, sp = 0x443322) =>
        new THREE.MeshPhongMaterial({ color: c, shininess: s, specular: sp });

      const G = new THREE.Group();
      G.add(new THREE.Mesh(new THREE.CylinderGeometry(0.52, 0.38, 0.95, 64), ph(def.cupC, 140)));

      const handle = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.06, 10, 28, Math.PI), ph(def.cupC, 140));
      handle.rotation.y = Math.PI / 2; handle.position.set(0.55, 0, 0); G.add(handle);

      const sau = new THREE.Mesh(new THREE.CylinderGeometry(0.78, 0.72, 0.08, 64), ph(def.sauC, 80));
      sau.position.y = -0.5; G.add(sau);

      G.add(new THREE.Mesh(
        new THREE.CylinderGeometry(0.49, 0.49, 0.85, 64),
        new THREE.MeshPhongMaterial({ color: def.liqC, shininess: 300, specular: 0x7a3a10, transparent: true, opacity: 0.97 })
      ));

      if (def.milkC) {
        const mh = def.foamC ? 0.28 : 0.35;
        const ml = new THREE.Mesh(
          new THREE.CylinderGeometry(0.49, 0.49, mh, 64),
          new THREE.MeshPhongMaterial({ color: def.milkC, shininess: 60, transparent: true, opacity: 0.9 })
        );
        ml.position.y = def.foamC ? 0.35 : 0.38; G.add(ml);
      }
      if (def.foamC) {
        const foam = new THREE.Mesh(
          new THREE.SphereGeometry(0.46, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2),
          new THREE.MeshPhongMaterial({ color: def.foamC, shininess: 18, transparent: true, opacity: 0.92 })
        );
        foam.position.y = 0.58; foam.scale.set(1, 1.25, 1); G.add(foam);
      }
      if (!def.hasIce && !def.foamC) {
        const cr = new THREE.Mesh(new THREE.CylinderGeometry(0.49, 0.49, 0.06, 64), ph(def.cremaC, 200));
        cr.position.y = 0.44; G.add(cr);
      }
      if (def.hasIce) {
        ([ [-0.16,0.32,0.1],[0.14,0.12,-0.06],[-0.05,0.5,0.04],[0.18,0.42,-0.09] ] as [number,number,number][])
          .forEach(([x,y,z]) => {
            const ice = new THREE.Mesh(
              new THREE.BoxGeometry(0.18,0.18,0.18),
              new THREE.MeshPhongMaterial({ color:0xc8e8f8, transparent:true, opacity:.52, shininess:400, specular:0xffffff })
            );
            ice.position.set(x,y,z); ice.rotation.set(Math.random(),Math.random(),Math.random()); G.add(ice);
          });
      }

      G.position.y = 0.12; S.add(G);

      let tt = 0, hov = false;
      const onEnter = () => (hov = true);
      const onLeave = () => (hov = false);
      par.addEventListener("mouseenter", onEnter);
      par.addEventListener("mouseleave", onLeave);

      const tick = () => {
        rafId = requestAnimationFrame(tick); tt += 0.01;
        G.rotation.y += hov ? 0.025 : 0.006;
        G.position.y = 0.12 + Math.sin(tt * 0.6) * 0.055;
        R.render(S, C);
      };
      tick();

      (cv as unknown as { _dispose?: () => void })._dispose = () => {
        cancelAnimationFrame(rafId);
        par.removeEventListener("mouseenter", onEnter);
        par.removeEventListener("mouseleave", onLeave);
        R.dispose();
      };
    });

    return () => {
      destroyed = true;
      cancelAnimationFrame(rafId);
      (cv as unknown as { _dispose?: () => void })?._dispose?.();
    };
  }, [def]);

  return (
    <div onClick={onSelect} style={{ position:"relative", display:"flex", flexDirection:"column", alignItems:"flex-start", overflow:"hidden", background:selected?"#120d1a":"var(--deep)", padding:"2rem 1.6rem 1.8rem", cursor:"none", transition:"background .4s" }}>
      <div style={{ position:"absolute", inset:0, pointerEvents:"none", background:"radial-gradient(ellipse 90% 90% at 50% 110%,rgba(201,153,58,.13),transparent)", opacity:selected?1:0, transition:"opacity .5s" }} />
      <div ref={wrapRef} style={{ width:"100%", aspectRatio:"1", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:"1.4rem", position:"relative" }}>
        <span style={{ fontFamily:"'Cormorant Garamond',serif", position:"absolute", top:0, right:4, fontSize:"2.8rem", fontWeight:300, fontStyle:"italic", color:selected?"var(--gold2)":"rgba(201,153,58,.2)", lineHeight:1, transition:"color .4s" }}>
          0{index + 1}
        </span>
        <canvas ref={canvasRef} style={{ width:"100%", height:"100%", display:"block" }} />
      </div>
      <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"1.45rem", fontWeight:600, color:"var(--cream)" }}>{def.label}</div>
      <div style={{ fontSize:"0.58rem", letterSpacing:"0.32em", textTransform:"uppercase", color:"var(--muted)", marginTop:"0.35rem" }}>{PRODUCT_TAGS[productKey]}</div>
      <div style={{ fontSize:"1rem", fontWeight:300, color:"var(--gold)", marginTop:"1rem" }}>{def.price}</div>
      <div style={{ marginTop:"1.2rem", width:"100%", textAlign:"center", fontSize:"0.65rem", letterSpacing:"0.25em", textTransform:"uppercase", padding:"0.5rem 1rem", border:`1px solid ${selected?"var(--gold)":"rgba(201,153,58,.25)"}`, background:selected?"var(--gold)":"transparent", color:selected?"var(--ink)":"var(--gold)", transition:"all .3s" }}>
        Watch the Process
      </div>
    </div>
  );
}
