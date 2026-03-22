"use client";
import { useEffect, useRef } from "react";

export default function Cursor() {
  const dotRef  = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let mx = 0, my = 0, rx = 0, ry = 0, rafId = 0;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX; my = e.clientY;
      if (dotRef.current) { dotRef.current.style.left = `${mx}px`; dotRef.current.style.top = `${my}px`; }
    };
    document.addEventListener("mousemove", onMove);

    const lag = () => {
      rx += (mx - rx) * 0.1; ry += (my - ry) * 0.1;
      if (ringRef.current) { ringRef.current.style.left = `${rx}px`; ringRef.current.style.top = `${ry}px`; }
      rafId = requestAnimationFrame(lag);
    };
    rafId = requestAnimationFrame(lag);

    return () => { document.removeEventListener("mousemove", onMove); cancelAnimationFrame(rafId); };
  }, []);

  return (
    <>
      <div ref={dotRef} style={{ position:"fixed", width:10, height:10, background:"var(--gold)", borderRadius:"50%", pointerEvents:"none", zIndex:9999, transform:"translate(-50%,-50%)", mixBlendMode:"difference" }} />
      <div ref={ringRef} style={{ position:"fixed", width:32, height:32, border:"1px solid rgba(201,153,58,.35)", borderRadius:"50%", pointerEvents:"none", zIndex:9998, transform:"translate(-50%,-50%)" }} />
    </>
  );
}
