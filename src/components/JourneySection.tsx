"use client";
import { useEffect, useRef, useState } from "react";
import type { ProductKey } from "@/types";
import JourneyCanvas from "./JourneyCanvas";
import JourneyPanel from "./JourneyPanel";

interface Props {
  productKey: ProductKey;
}

const STEP_THRESHOLDS = [0, 0.2, 0.4, 0.6, 0.8] as const;

export default function JourneySection({ productKey }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);

  const [activeStep,     setActiveStep]     = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [stageProgress,  setStageProgress]  = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const wrap = wrapRef.current;
      if (!wrap) return;

      const rect  = wrap.getBoundingClientRect();
      const total = wrap.offsetHeight - window.innerHeight;
      const p     = Math.max(0, Math.min(1, -rect.top / total));
      setScrollProgress(p);

      let step = 0;
      for (let i = STEP_THRESHOLDS.length - 1; i >= 0; i--) {
        if (p >= STEP_THRESHOLDS[i]) { step = i; break; }
      }
      const nextT = STEP_THRESHOLDS[step + 1] ?? 1;
      setActiveStep(step);
      setStageProgress((p - STEP_THRESHOLDS[step]) / (nextT - STEP_THRESHOLDS[step]));
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div ref={wrapRef} style={{ position: "relative" }}>
      {/* sticky 2-col viewport */}
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          overflow: "hidden",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
        }}
      >
        <JourneyCanvas
          productKey={productKey}
          activeStep={activeStep}
          scrollProgress={scrollProgress}
          stageProgress={stageProgress}
        />
        <JourneyPanel productKey={productKey} activeStep={activeStep} />
      </div>

      {/* 600vh spacer — gives 5 stages × 120vh each */}
      <div style={{ height: "600vh" }} aria-hidden="true" />
    </div>
  );
}
