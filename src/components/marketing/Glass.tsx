"use client";

import * as React from "react";
import { cn } from "@togo-framework/ui-core";

// Display type follows the kit's display face (Lusail on the grid).
const DISPLAY: React.CSSProperties = { fontFamily: "var(--togo-font-display, ui-sans-serif, system-ui, sans-serif)" };

// ── AuroraBackground ────────────────────────────────────────────────────────────
// The grid behind content: 1px hairlines on the ground, fading out from the top.
// No orbs, no blur, no gradient colour — fadymondy.com's lines in the ToGO palette.
// The name and `intensity` are kept so existing pages keep compiling.
export interface AuroraBackgroundProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Line strength (0–1). Default 1. */
  intensity?: number;
}
export function AuroraBackground({ className, intensity = 1, style, ...rest }: AuroraBackgroundProps) {
  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0 -z-10 overflow-hidden", className)} style={style} {...rest}>
      <div
        className="absolute inset-0"
        style={{
          opacity: 0.6 * intensity,
          backgroundImage:
            "linear-gradient(hsl(var(--border)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--border)) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage: "linear-gradient(to bottom, #000, transparent 85%)",
          WebkitMaskImage: "linear-gradient(to bottom, #000, transparent 85%)",
        }}
      />
    </div>
  );
}
AuroraBackground.displayName = "AuroraBackground";

// ── GlassCard ───────────────────────────────────────────────────────────────────
// A grid panel: a hairline box on a surface step. No frosting, no shadow, square corners.
// `elevation` picks the step: flat = transparent, raised = card, floating = popover.
export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  elevation?: "flat" | "raised" | "floating";
  hover?: boolean;
}
export function GlassCard({ className, elevation = "raised", hover = false, children, ...rest }: GlassCardProps) {
  const surface = elevation === "floating" ? "bg-popover" : elevation === "raised" ? "bg-card" : "bg-transparent";
  return (
    <div
      className={cn("relative border border-border", surface, hover && "transition-colors hover:border-foreground/30", className)}
      {...rest}
    >
      {children}
    </div>
  );
}
GlassCard.displayName = "GlassCard";

// ── Reveal ──────────────────────────────────────────────────────────────────────
// Scroll-reveal (fade). Defaults to VISIBLE — pre-JS, during prerender
// (navigator.webdriver), and under prefers-reduced-motion it never hides, so the
// static HTML always contains the content for crawlers. No slide: the grid moves colour only.
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
  const motion = state === "static" ? "" : state === "hidden" ? "opacity-0" : "opacity-100";
  return (
    <Tag
      ref={ref as any}
      style={{ transitionDelay: `${delayMs}ms`, ...style }}
      className={cn("transition-opacity duration-[700ms] ease-out", motion, className)}
      {...rest}
    >
      {children}
    </Tag>
  );
}
Reveal.displayName = "Reveal";

// ── MockupWindow ──────────────────────────────────────────────────────────────────
// A framed "app window" (three square cells + title) to show product UI on the grid.
export interface MockupWindowProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title?: React.ReactNode;
}
export function MockupWindow({ className, title, children, ...rest }: MockupWindowProps) {
  return (
    <GlassCard elevation="floating" className={cn("overflow-hidden", className)} {...rest}>
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <span className="h-2.5 w-2.5 bg-border" />
        <span className="h-2.5 w-2.5 bg-border" />
        <span className="h-2.5 w-2.5 bg-border" />
        {title ? <span className="ms-2 truncate font-mono text-xs text-muted-foreground">{title}</span> : null}
      </div>
      <div className="bg-background">{children}</div>
    </GlassCard>
  );
}
MockupWindow.displayName = "MockupWindow";

// ── PillButton ────────────────────────────────────────────────────────────────────
// Call-to-action link. On the grid it is a 6px control: "flow" is the solid teal action,
// "glass" the hairline outline. (The names are kept for existing pages.)
export interface PillButtonProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: "flow" | "glass";
  size?: "md" | "lg";
}
export function PillButton({ className, variant = "flow", size = "lg", children, ...rest }: PillButtonProps) {
  const sz = size === "lg" ? "h-12 px-6 text-base" : "h-10 px-4 text-sm";
  const look =
    variant === "flow"
      ? "bg-primary text-primary-foreground hover:bg-primary/90"
      : "border border-border bg-transparent text-foreground hover:bg-muted";
  return (
    <a
      style={DISPLAY}
      className={cn("inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors", sz, look, className)}
      {...rest}
    >
      {children}
    </a>
  );
}
PillButton.displayName = "PillButton";
