"use client";
import { useEffect, useRef } from "react";

export default function HeroSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const cv = canvasRef.current;
    if (!cv) return;

    let rafId = 0;
    let destroyed = false;

    // Dynamic import — three.js never touches the server bundle
    import("three").then((THREE) => {
      if (destroyed) return;

      const R = new THREE.WebGLRenderer({ canvas: cv, alpha: true, antialias: true });
      R.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      R.setSize(window.innerWidth, window.innerHeight);

      const S = new THREE.Scene();
      const C = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
      C.position.z = 5;

      const cnt = 1000;
      const pos = new Float32Array(cnt * 3);
      for (let i = 0; i < cnt; i++) {
        pos[i * 3]     = (Math.random() - 0.5) * 20;
        pos[i * 3 + 1] = (Math.random() - 0.5) * 12;
        pos[i * 3 + 2] = (Math.random() - 0.5) * 6 - 2;
      }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
      const pts = new THREE.Points(geo, new THREE.PointsMaterial({ color: 0xc9993a, size: 0.022, transparent: true, opacity: 0.45 }));
      S.add(pts);

      const torii: import("three").Mesh[] = [];
      [1.8, 2.9, 4.1].forEach((r, i) => {
        const t = new THREE.Mesh(
          new THREE.TorusGeometry(r, 0.007 + i * 0.003, 8, 120),
          new THREE.MeshBasicMaterial({ color: i === 1 ? 0xc9993a : 0x4a2a08, transparent: true, opacity: 0.15 - i * 0.04 })
        );
        t.rotation.x = 0.55 + i * 0.28;
        t.rotation.y = i * 0.38;
        S.add(t); torii.push(t);
      });

      let hx = 0, hy = 0;
      const onMove = (e: MouseEvent) => {
        hx = e.clientX / window.innerWidth - 0.5;
        hy = e.clientY / window.innerHeight - 0.5;
      };
      document.addEventListener("mousemove", onMove);

      let tt = 0;
      const tick = () => {
        rafId = requestAnimationFrame(tick); tt += 0.004;
        pts.rotation.y = tt * 0.07 + hx * 0.1;
        torii.forEach((t, i) => (t.rotation.z = tt * (0.12 + i * 0.1)));
        C.position.x += (hx * 0.5 - C.position.x) * 0.04;
        C.position.y += (-hy * 0.3 - C.position.y) * 0.04;
        R.render(S, C);
      };
      tick();

      const onResize = () => {
        R.setSize(window.innerWidth, window.innerHeight);
        C.aspect = window.innerWidth / window.innerHeight;
        C.updateProjectionMatrix();
      };
      window.addEventListener("resize", onResize);

      // store dispose fn
      (cv as unknown as { _dispose?: () => void })._dispose = () => {
        cancelAnimationFrame(rafId);
        document.removeEventListener("mousemove", onMove);
        window.removeEventListener("resize", onResize);
        R.dispose();
      };
    });

    return () => {
      destroyed = true;
      cancelAnimationFrame(rafId);
      const dispose = (cv as unknown as { _dispose?: () => void })?._dispose;
      dispose?.();
    };
  }, []);

  return (
    <section style={{ height:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", position:"relative", overflow:"hidden", background:"radial-gradient(ellipse 80% 60% at 50% 40%, #180e26 0%, var(--ink) 70%)" }}>
      <canvas ref={canvasRef} style={{ position:"absolute", inset:0, width:"100%", height:"100%" }} />
      <div style={{ position:"relative", zIndex:2, textAlign:"center", padding:"0 5vw" }}>
        <p style={{ opacity:0, animation:"fadeUp 0.9s 0.3s ease forwards", fontSize:"0.6rem", letterSpacing:"0.55em", textTransform:"uppercase", color:"var(--gold)", marginBottom:"1.4rem" }}>
          The Art of Coffee
        </p>
        <h1 style={{ opacity:0, animation:"fadeUp 1s 0.55s ease forwards", fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(4rem,11vw,9rem)", fontWeight:300, lineHeight:0.9, letterSpacing:"-0.02em", color:"var(--cream)" }}>
          Every sip<br />
          <em style={{ fontStyle:"italic", color:"var(--gold2)" }}>has a story</em>
        </h1>
        <p style={{ opacity:0, animation:"fadeUp 0.8s 0.85s ease forwards", fontSize:"0.85rem", fontWeight:200, letterSpacing:"0.18em", marginTop:"1.8rem", color:"var(--muted)" }}>
          Choose a drink. Watch it come to life.
        </p>
      </div>
      <div style={{ opacity:0, animation:"fadeUp 0.8s 1.2s ease forwards", position:"absolute", bottom:"2.5rem", left:"50%", transform:"translateX(-50%)", display:"flex", flexDirection:"column", alignItems:"center", gap:"0.6rem" }}>
        <span style={{ fontSize:"0.56rem", letterSpacing:"0.45em", textTransform:"uppercase", color:"var(--gold)" }}>Explore</span>
        <div style={{ width:1, height:48, background:"linear-gradient(var(--gold),transparent)", animation:"pulse2 2s ease-in-out infinite" }} />
      </div>
    </section>
  );
}
