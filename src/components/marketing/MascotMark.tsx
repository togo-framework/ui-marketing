"use client";

// MascotMark — turns the ToGO head mark into a friendly, interactive character.
// On a capable (fine + hover) pointer the eyes FOLLOW THE MOUSE: light eye-whites
// with dark pupils are overlaid at the eye centres and the pupils track the cursor
// (clamped to a small travel), while the head gives a subtle tilt toward the cursor.
// A gentle idle float always plays. Fully static — no overlay, no JS tracking —
// under `prefers-reduced-motion`, on touch / no-hover devices, and during SSR /
// prerender (the overlay only mounts after a capability check), so accessibility
// and crawlers get a clean static mark.

import * as React from "react";
import { cn } from "@togo-framework/ui-core";

export interface MascotMarkProps {
  /** Source of the head mark SVG (defaults to /togo-mark.svg). */
  src?: string;
  alt?: string;
  className?: string;
}

// Eye centres as fractions of the mark's bounding box (head viewBox 579.65×370.9).
// Tweak these two points if the pupils sit off the eyes.
const EYES = [
  { x: 0.405, y: 0.45 },
  { x: 0.595, y: 0.45 },
] as const;
const EYE_W = 0.085; // eye-white diameter, fraction of box width
const PUPIL_RATIO = 0.52; // pupil diameter relative to the eye-white
const MAX_OFF = ((1 - PUPIL_RATIO) / 2) * 100; // max pupil-centre offset, % of eye-white

const KEYFRAMES = `
@keyframes tgMascotFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
.tg-mascot { will-change: transform; animation: tgMascotFloat 6s ease-in-out infinite; }
@media (prefers-reduced-motion: reduce) { .tg-mascot { animation: none !important; } }`;

export function MascotMark({ src = "/togo-mark.svg", alt = "ToGO", className }: MascotMarkProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  // `active` only flips true after mount on a hover-capable, motion-OK pointer —
  // so SSR / prerender / reduced-motion / touch render the plain static head.
  const [active, setActive] = React.useState(false);
  const [look, setLook] = React.useState({ dx: 0, dy: 0 });

  React.useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    setActive(true);

    let raf = 0;
    const onMove = (e: PointerEvent) => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height * 0.45;
      const dx = Math.max(-1, Math.min(1, (e.clientX - cx) / (r.width * 0.85)));
      const dy = Math.max(-1, Math.min(1, (e.clientY - cy) / (r.height * 0.85)));
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setLook({ dx, dy }));
    };
    const recenter = () => setLook({ dx: 0, dy: 0 });
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", recenter);
    document.addEventListener("mouseleave", recenter);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", recenter);
      document.removeEventListener("mouseleave", recenter);
      cancelAnimationFrame(raf);
    };
  }, []);

  const tilt = active ? look.dx * 4 : 0;

  return (
    <div ref={ref} className={cn("tg-mascot", className)} style={{ position: "relative", display: "inline-block" }}>
      <style>{KEYFRAMES}</style>
      <div
        style={{
          position: "relative",
          transform: active ? `rotate(${tilt}deg)` : undefined,
          transformOrigin: "50% 75%",
          transition: "transform .25s ease-out",
        }}
      >
        <img src={src} alt={alt} draggable={false} style={{ display: "block", width: "100%", height: "100%" }} />
        {active &&
          EYES.map((eye, i) => (
            <span
              key={i}
              aria-hidden="true"
              style={{
                position: "absolute",
                left: `${eye.x * 100}%`,
                top: `${eye.y * 100}%`,
                width: `${EYE_W * 100}%`,
                aspectRatio: "1",
                transform: "translate(-50%,-50%)",
                borderRadius: "9999px",
                background: "rgba(255,255,255,.94)",
                boxShadow: "inset 0 2px 4px rgba(8,16,40,.28)",
              }}
            >
              <span
                style={{
                  position: "absolute",
                  left: `${50 + look.dx * MAX_OFF}%`,
                  top: `${50 + look.dy * MAX_OFF}%`,
                  width: `${PUPIL_RATIO * 100}%`,
                  aspectRatio: "1",
                  transform: "translate(-50%,-50%)",
                  borderRadius: "9999px",
                  background: "#0a1733",
                  boxShadow: "inset 1.5px -1.5px 2px rgba(255,255,255,.35)",
                  transition: "left .12s ease-out, top .12s ease-out",
                }}
              />
            </span>
          ))}
      </div>
    </div>
  );
}
MascotMark.displayName = "MascotMark";
