"use client";

import * as React from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@togo-framework/ui-core";
import { CodeBlock } from "@togo-framework/ui-markdown";

// Display type goes through the kit's display token WITH a fallback — a bare family drops to the browser's
// serif default when the font is slow/unavailable.
const DISPLAY: React.CSSProperties = { fontFamily: "var(--togo-font-display, ui-sans-serif, system-ui, sans-serif)" };

// ── Eyebrow — small mono label with an optional icon ───────────────────────────
export interface EyebrowProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: LucideIcon;
}
export function Eyebrow({ icon: Icon, className, children, ...rest }: EyebrowProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-[hsl(var(--primary))]",
        className,
      )}
      {...rest}
    >
      {Icon ? <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden /> : null}
      <span>{children}</span>
    </div>
  );
}
Eyebrow.displayName = "Eyebrow";

// ── SectionHeading — eyebrow + display title + optional subtitle ───────────────────
export interface SectionHeadingProps {
  eyebrow?: React.ReactNode;
  eyebrowIcon?: LucideIcon;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
}
export function SectionHeading({ eyebrow, eyebrowIcon, title, subtitle, align = "center", className }: SectionHeadingProps) {
  const centered = align === "center";
  return (
    <div className={cn("max-w-2xl", centered && "mx-auto text-center", className)}>
      {eyebrow ? <Eyebrow icon={eyebrowIcon} className={cn("mb-3", centered && "justify-center")}>{eyebrow}</Eyebrow> : null}
      <h2 style={DISPLAY} className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{title}</h2>
      {subtitle ? <p className="mt-3 text-muted-foreground">{subtitle}</p> : null}
    </div>
  );
}
SectionHeading.displayName = "SectionHeading";

// ── FeatureCard — icon + display title + body ──────────────────────────────────────
export interface FeatureCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  icon?: LucideIcon;
  title: React.ReactNode;
}
export function FeatureCard({ icon: Icon, title, children, className, ...rest }: FeatureCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-card p-6 transition duration-200 hover:-translate-y-1 hover:border-border/80",
        className,
      )}
      {...rest}
    >
      {Icon ? (
        <div className="mb-4 inline-grid h-11 w-11 place-items-center rounded-xl border border-[hsl(var(--primary)/0.18)] bg-[hsl(var(--primary)/0.1)] text-[hsl(var(--primary))]">
          <Icon className="h-5 w-5" aria-hidden />
        </div>
      ) : null}
      <h3 style={DISPLAY} className="mb-2 text-[17px] font-bold text-foreground">{title}</h3>
      <div className="text-sm text-muted-foreground [&_b]:text-foreground [&_code]:rounded [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[12.5px] [&_code]:text-foreground/80">
        {children}
      </div>
    </div>
  );
}
FeatureCard.displayName = "FeatureCard";

// ── CodeShowcase — tabbed, syntax-highlighted code (e.g. a generator workflow) ──
export interface CodeShowcaseTab {
  key: string;
  label: string;
  lang?: string;
  file?: string;
  code: string;
}
export interface CodeShowcaseProps {
  tabs: CodeShowcaseTab[];
  className?: string;
}
export function CodeShowcase({ tabs, className }: CodeShowcaseProps) {
  const [active, setActive] = React.useState(tabs[0]?.key);
  const tab = tabs.find((t) => t.key === active) ?? tabs[0];
  return (
    <div className={cn("overflow-hidden rounded-2xl border border-border bg-card", className)}>
      <div role="tablist" className="flex items-center gap-1 overflow-x-auto border-b border-border px-2">
        {tabs.map((t) => {
          const on = (active ?? tabs[0]?.key) === t.key;
          return (
            <button
              key={t.key}
              role="tab"
              aria-selected={on}
              onClick={() => setActive(t.key)}
              className={cn(
                "relative px-3 py-2.5 text-sm transition",
                on ? "text-foreground" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {t.label}
              {on ? <span className="absolute inset-x-2 -bottom-px h-0.5 rounded bg-[hsl(var(--primary))]" /> : null}
            </button>
          );
        })}
      </div>
      {tab?.file ? <div className="px-4 pt-3 font-mono text-[11px] text-muted-foreground">{tab.file}</div> : null}
      <div className="px-3 pb-3 pt-1">
        <CodeBlock lang={tab?.lang}>{tab?.code}</CodeBlock>
      </div>
    </div>
  );
}
CodeShowcase.displayName = "CodeShowcase";
