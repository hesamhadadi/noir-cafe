"use client";
import { useEffect, useRef } from "react";
import type { ProductKey } from "@/types";
import type { JourneyStage } from "@/types";

interface Props {
  productKey: ProductKey;
  activeStep: number;
  scrollProgress: number;
  stageProgress: number;
}

export default function JourneyCanvas({ productKey, activeStep, scrollProgress, stageProgress }: Props) {
  const canvasRef        = useRef<HTMLCanvasElement>(null);
  const wrapRef          = useRef<HTMLDivElement>(null);
  const stagesRef        = useRef<JourneyStage[]>([]);
  const rafRef           = useRef<number>(0);
  const jtRef            = useRef(0);
  const mouseRef         = useRef({ x: 0, y: 0 });
  const rendererRef      = useRef<import("three").WebGLRenderer | null>(null);
  const sceneRef         = useRef<import("three").Scene | null>(null);
  const cameraRef        = useRef<import("three").PerspectiveCamera | null>(null);

  const activeStepRef     = useRef(activeStep);
  const scrollProgressRef = useRef(scrollProgress);
  const stageProgressRef  = useRef(stageProgress);
  const productKeyRef     = useRef(productKey);

  useEffect(() => { activeStepRef.current     = activeStep;     }, [activeStep]);
  useEffect(() => { scrollProgressRef.current = scrollProgress; }, [scrollProgress]);
  useEffect(() => { stageProgressRef.current  = stageProgress;  }, [stageProgress]);
  useEffect(() => { productKeyRef.current     = productKey;     }, [productKey]);

  // ── Init renderer once (dynamic import keeps three.js client-only) ──
  useEffect(() => {
    if (typeof window === "undefined") return;
    const cv   = canvasRef.current;
    const wrap = wrapRef.current;
    if (!cv || !wrap) return;

    let destroyed = false;

    // Dynamically import THREE and scene builders — never evaluated server-side
    Promise.all([
      import("three"),
      import("@/lib/three-scenes"),
      import("@/lib/products"),
    ]).then(([THREE, scenes, { PRODUCTS }]) => {
      if (destroyed) return;

      const R = new THREE.WebGLRenderer({ canvas: cv, alpha: true, antialias: true });
      R.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      const S = new THREE.Scene();
      const w = wrap.clientWidth, h = wrap.clientHeight;
      R.setSize(w, h);

      const C = new THREE.PerspectiveCamera(50, w / h, 0.01, 100);
      C.position.z = 5;

      scenes.addJourneyLights(S);
      scenes.addBgParticles(S);

      rendererRef.current = R;
      sceneRef.current    = S;
      cameraRef.current   = C;

      // Build initial stages
      const def  = PRODUCTS[productKeyRef.current];
      const bdat = scenes.randomBeanData();
      const initial: JourneyStage[] = [
        scenes.buildStage0_Beans(bdat),
        scenes.buildStage1_Roast(bdat),
        scenes.buildStage2_Grind(),
        scenes.buildStage3_Process(productKeyRef.current, def),
        scenes.buildStage4_FinalCup(productKeyRef.current, def),
      ];
      initial.forEach((s, i) => { S.add(s.g); s.g.visible = i === 0; });
      stagesRef.current = initial;

      const onMove = (e: MouseEvent) => {
        mouseRef.current = {
          x: (e.clientX / window.innerWidth  - 0.5) * 2,
          y: (e.clientY / window.innerHeight - 0.5) * 2,
        };
      };
      document.addEventListener("mousemove", onMove);

      const onResize = () => {
        const w2 = wrap.clientWidth, h2 = wrap.clientHeight;
        R.setSize(w2, h2); C.aspect = w2 / h2; C.updateProjectionMatrix();
      };
      window.addEventListener("resize", onResize);

      const tick = () => {
        rafRef.current = requestAnimationFrame(tick);
        jtRef.current += 0.01;
        stagesRef.current[activeStepRef.current]?.tick(jtRef.current, stageProgressRef.current);
        C.position.x  += (mouseRef.current.x *  0.3 - C.position.x) * 0.04;
        C.position.y  += (-mouseRef.current.y * 0.18 - C.position.y) * 0.04;
        C.position.z   = 5 - scrollProgressRef.current * 1.15;
        C.lookAt(0, 0, 0);
        R.render(S, C);
      };
      tick();

      // Store cleanup fns on rendererRef for the destroy effect
      (rendererRef.current as unknown as { _cleanup?: () => void })._cleanup = () => {
        cancelAnimationFrame(rafRef.current);
        document.removeEventListener("mousemove", onMove);
        window.removeEventListener("resize", onResize);
        R.dispose();
      };
    });

    return () => {
      destroyed = true;
      const cleanup = (rendererRef.current as unknown as { _cleanup?: () => void })?._cleanup;
      cleanup?.();
    };
  }, []); // run once

  // ── Rebuild stages when product changes ──
  useEffect(() => {
    const S = sceneRef.current;
    if (!S) return;

    Promise.all([import("three"), import("@/lib/three-scenes"), import("@/lib/products")])
      .then(([, scenes, { PRODUCTS }]) => {
        stagesRef.current.forEach((s) => S.remove(s.g));
        const def  = PRODUCTS[productKey];
        const bdat = scenes.randomBeanData();
        const next: JourneyStage[] = [
          scenes.buildStage0_Beans(bdat),
          scenes.buildStage1_Roast(bdat),
          scenes.buildStage2_Grind(),
          scenes.buildStage3_Process(productKey, def),
          scenes.buildStage4_FinalCup(productKey, def),
        ];
        next.forEach((s, i) => { S.add(s.g); s.g.visible = i === 0; });
        stagesRef.current = next;
      });
  }, [productKey]);

  // ── Show/hide stage on step change ──
  useEffect(() => {
    stagesRef.current.forEach((s, i) => { s.g.visible = i === activeStep; });
  }, [activeStep]);

  return (
    <div
      ref={wrapRef}
      style={{ position: "relative", height: "100%", background: "radial-gradient(ellipse 70% 60% at 50% 50%, #1a0f28 0%, #060410 100%)" }}
    >
      <canvas ref={canvasRef} style={{ width: "100%", height: "100%", display: "block" }} />
    </div>
  );
}
