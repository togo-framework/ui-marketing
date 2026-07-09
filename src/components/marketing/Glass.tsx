"use client";

import * as React from "react";
import { cn } from "@togo-framework/ui-core";

// Display type names Sora WITH a fallback (a bare `Sora` drops to serif when slow).
const DISPLAY: React.CSSProperties = { fontFamily: '"Sora", var(--togo-font-body, ui-sans-serif, system-ui, sans-serif)' };

// ── AuroraBackground ────────────────────────────────────────────────────────────
// Soft, slowly-drifting ToGO-gradient orbs + a faint grid, sitting behind content.
// CSS-only, GPU-friendly, and frozen under prefers-reduced-motion.
export interface AuroraBackgroundProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Dim the orbs (0–1). Default 1. */
  intensity?: number;
}
export function AuroraBackground({ className, intensity = 1, style, ...rest }: AuroraBackgroundProps) {
  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0 -z-10 overflow-hidden", className)} style={style} {...rest}>
      <style>{`
        @keyframes tg-aurora-a { 0%,100%{transform:translate3d(-6%,-4%,0) scale(1)} 50%{transform:translate3d(8%,6%,0) scale(1.15)} }
        @keyframes tg-aurora-b { 0%,100%{transform:translate3d(6%,8%,0) scale(1.1)} 50%{transform:translate3d(-8%,-6%,0) scale(.95)} }
        @keyframes tg-aurora-c { 0%,100%{transform:translate3d(0,0,0) scale(1.05)} 50%{transform:translate3d(-10%,4%,0) scale(1.2)} }
        .tg-orb{position:absolute;border-radius:9999px;filter:blur(70px);opacity:${0.5 * intensity};mix-blend-mode:screen}
        @media (prefers-reduced-motion: reduce){ .tg-orb{animation:none!important} }
      `}</style>
      <div className="tg-orb" style={{ width: "46vw", height: "46vw", top: "-12%", left: "8%", background: "radial-gradient(circle, #1FC7DC, transparent 65%)", animation: "tg-aurora-a 22s ease-in-out infinite" }} />
      <div className="tg-orb" style={{ width: "50vw", height: "50vw", top: "-18%", right: "2%", background: "radial-gradient(circle, #2D8CE6, transparent 65%)", animation: "tg-aurora-b 26s ease-in-out infinite" }} />
      <div className="tg-orb" style={{ width: "42vw", height: "42vw", top: "20%", left: "30%", background: "radial-gradient(circle, #1659C8, transparent 68%)", animation: "tg-aurora-c 30s ease-in-out infinite" }} />
      <div
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage: "linear-gradient(rgba(120,140,160,.10) 1px,transparent 1px),linear-gradient(90deg,rgba(120,140,160,.10) 1px,transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage: "radial-gradient(900px 600px at 50% 0%, #000, transparent 80%)",
          WebkitMaskImage: "radial-gradient(900px 600px at 50% 0%, #000, transparent 80%)",
        }}
      />
    </div>
  );
}
AuroraBackground.displayName = "AuroraBackground";

// ── GlassCard ───────────────────────────────────────────────────────────────────
// Frosted, translucent surface with a hairline gradient border + soft shadow.
export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  elevation?: "flat" | "raised" | "floating";
  hover?: boolean;
}
export function GlassCard({ className, elevation = "raised", hover = false, children, ...rest }: GlassCardProps) {
  const shadow =
    elevation === "floating" ? "shadow-[0_30px_80px_-30px_rgba(0,0,0,.7)]" :
    elevation === "raised" ? "shadow-[0_16px_50px_-24px_rgba(0,0,0,.6)]" : "";
  return (
    <div
      className={cn(
        "relative rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl",
        "before:pointer-events-none before:absolute before:inset-0 before:rounded-2xl before:p-px",
        "before:[background:linear-gradient(140deg,rgba(255,255,255,.18),rgba(255,255,255,0)_40%)]",
        "before:[mask:linear-gradient(#000,#000)_content-box,linear-gradient(#000,#000)] before:[mask-composite:exclude]",
        shadow,
        hover && "transition-transform duration-300 hover:-translate-y-1",
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
GlassCard.displayName = "GlassCard";

// ── Reveal ──────────────────────────────────────────────────────────────────────
// Scroll-reveal (fade + slide-up). Defaults to VISIBLE — pre-JS, during prerender
// (navigator.webdriver), and under prefers-reduced-motion it never hides, so the
// static HTML always contains the content for crawlers.
export interface RevealProps extends React.HTMLAttributes<HTMLDivElement> {
  delayMs?: number;
  as?: React.ElementType;
}
export function Reveal({ className, delayMs = 0, as: Tag = "div", children, style, ...rest }: RevealProps) {
  const ref = React.useRef<HTMLElement | null>(null);
  const [state, setState] = React.useState<"static" | "hidden" | "shown">("static");
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const noMotion = typeof window !== "undefined" &&
      ((navigator as any).webdriver || window.matchMedia?.("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window));
    if (noMotion) return; // stay visible (prerender / reduced motion / no IO)
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.92 && rect.bottom > 0) { setState("shown"); return; }
    setState("hidden");
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { setState("shown"); io.disconnect(); } }),
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const motion = state === "static" ? "" :
    state === "hidden" ? "opacity-0 translate-y-5" : "opacity-100 translate-y-0";
  return (
    <Tag
      ref={ref as any}
      style={{ transitionDelay: `${delayMs}ms`, ...style }}
      className={cn("transition-all duration-[700ms] ease-out will-change-[opacity,transform]", motion, className)}
      {...rest}
    >
      {children}
    </Tag>
  );
}
Reveal.displayName = "Reveal";

// ── MockupWindow ──────────────────────────────────────────────────────────────────
// A floating frosted "app window" (traffic-light dots + title) to frame product UI.
export interface MockupWindowProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title?: React.ReactNode;
}
export function MockupWindow({ className, title, children, ...rest }: MockupWindowProps) {
  return (
    <GlassCard elevation="floating" className={cn("overflow-hidden", className)} {...rest}>
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-white/[0.03]">
        <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
        <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
        <span className="h-3 w-3 rounded-full bg-[#28c840]" />
        {title ? <span className="ms-2 font-mono text-xs text-muted-foreground truncate">{title}</span> : null}
      </div>
      <div className="bg-[#080b0f]/80">{children}</div>
    </GlassCard>
  );
}
MockupWindow.displayName = "MockupWindow";

// ── PillButton ────────────────────────────────────────────────────────────────────
// Fully-rounded CTA. variant: "flow" (brand gradient) | "glass" (frosted).
export interface PillButtonProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: "flow" | "glass";
  size?: "md" | "lg";
}
export function PillButton({ className, variant = "flow", size = "lg", children, ...rest }: PillButtonProps) {
  const sz = size === "lg" ? "h-[52px] px-7 text-base" : "h-11 px-5 text-sm";
  const look =
    variant === "flow"
      ? "text-white shadow-[0_12px_34px_-10px_rgba(22,89,200,.7)] hover:-translate-y-0.5"
      : "text-foreground border border-white/15 bg-white/[0.06] backdrop-blur-md hover:bg-white/[0.1]";
  return (
    <a
      style={variant === "flow" ? { backgroundImage: "linear-gradient(110deg,#1FC7DC,#2D8CE6 50%,#1659C8)", ...DISPLAY } : DISPLAY}
      className={cn("inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200", sz, look, className)}
      {...rest}
    >
      {children}
    </a>
  );
}
PillButton.displayName = "PillButton";
