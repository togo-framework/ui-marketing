"use client";

import * as React from "react";
import type { LucideIcon } from "lucide-react";
import { Search, Star, Download } from "lucide-react";
import { cn } from "@togo-framework/ui-core";

const DISPLAY: React.CSSProperties = { fontFamily: "var(--togo-font-display, ui-sans-serif, system-ui, sans-serif)" };

// A real brand glyph (simple-icons path + official hex), so brand plugins render
// their actual logo/color instead of a generic category icon.
export interface BrandGlyph { path: string; hex: string; }

function Glyph({ icon: Icon, brand, size = 28 }: { icon?: LucideIcon; brand?: BrandGlyph; size?: number }) {
  if (brand) {
    return (
      <svg role="img" viewBox="0 0 24 24" width={size} height={size} fill="#fff" aria-hidden="true">
        <path d={brand.path} />
      </svg>
    );
  }
  return Icon ? <Icon size={size} style={{ color: "#fff" }} /> : null;
}

/** A provider plugin nested under a base card (auth → auth-dev, auth-firebase…). */
export interface ProviderChip { name: string; href: string; icon?: LucideIcon; brand?: BrandGlyph; color?: string; }

// ── MarketplaceCard ──────────────────────────────────────────────────────────────
// A Filament-grade plugin card: a branded cover (the plugin's color gradient + its
// icon — a real brand SVG when it represents a brand), then name, category,
// description, author/org, stars/downloads, and — for a base capability — a row of
// its providers. Clean, hover-lifts.
export interface MarketplaceCardProps {
  name: string;
  href: string;
  category?: string;
  /** Hex driving the cover gradient + glyph tint (per-plugin). */
  color?: string;
  /** Back-compat alias for `color`. */
  categoryColor?: string;
  icon?: LucideIcon;
  /** Real brand SVG (path + hex). Wins over `icon`. */
  brandIcon?: BrandGlyph;
  description?: string;
  author?: string;
  stars?: number;
  downloads?: number;
  enabled?: boolean;
  /** Providers nested under a base card. Renders a "providers" chip row. */
  providers?: ProviderChip[];
  className?: string;
}

export function MarketplaceCard({
  name, href, category, color, categoryColor, icon: Icon, brandIcon,
  description, author, stars, downloads, enabled, providers, className,
}: MarketplaceCardProps) {
  const tint = color || categoryColor || "#1F8A99";
  const shown = (providers || []).slice(0, 5);
  const extra = (providers || []).length - shown.length;
  return (
    <a href={href} className={cn("group block h-full", className)}>
      <div className="rounded-2xl border border-border bg-card p-5 h-full flex flex-col transition-colors hover:border-foreground/30">
        {/* header — solid brand-tile icon + name/category (clean hierarchy, no noisy cover) */}
        <div className="flex items-start gap-3.5">
          {(Icon || brandIcon) && (
            <div className="grid place-items-center w-11 h-11 rounded-xl shrink-0"
              style={{ background: tint }}>
              <Glyph icon={Icon} brand={brandIcon} size={21} />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 style={DISPLAY} className="text-[15px] font-bold truncate">{name}</h3>
              {enabled && <span className="shrink-0 text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400">enabled</span>}
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
              {category && <span>{category}</span>}
              {typeof providers !== "undefined" && providers.length > 0 && <span className="text-muted-foreground/60">· {providers.length} providers</span>}
            </div>
          </div>
        </div>

        <p className="text-[13px] text-muted-foreground mt-3.5 line-clamp-2 flex-1">{description || "A togo-framework plugin."}</p>

        {shown.length > 0 && (
          <div className="mt-3.5 flex flex-wrap gap-1.5">
            {shown.map((p) => (
              <span
                key={p.href}
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); window.location.href = p.href; }}
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/40 ps-1.5 pe-2.5 py-1 text-[11px] text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors cursor-pointer"
              >
                <span className="grid place-items-center w-4 h-4 rounded-full shrink-0" style={{ background: p.color || tint }}>
                  <Glyph icon={p.icon} brand={p.brand} size={10} />
                </span>
                {p.name}
              </span>
            ))}
            {extra > 0 && <span className="inline-flex items-center rounded-full border border-border px-2.5 py-1 text-[11px] text-muted-foreground">+{extra}</span>}
          </div>
        )}

        {(author || (typeof stars === "number" && stars > 0) || (typeof downloads === "number" && downloads > 0)) && (
          <div className="flex items-center gap-3 mt-3.5 pt-3.5 border-t border-border/60 text-[11px] text-muted-foreground font-mono">
            {author && <span className="truncate">{author}</span>}
            <span className="ms-auto flex items-center gap-3 shrink-0">
              {typeof stars === "number" && stars > 0 && <span className="flex items-center gap-1"><Star size={11} /> {stars}</span>}
              {typeof downloads === "number" && downloads > 0 && <span className="flex items-center gap-1"><Download size={11} /> {downloads}</span>}
            </span>
          </div>
        )}
      </div>
    </a>
  );
}
MarketplaceCard.displayName = "MarketplaceCard";

// ── StatsRow ─────────────────────────────────────────────────────────────────────
export interface StatTile { label: string; value: React.ReactNode; }
export function StatsRow({ stats, className }: { stats: StatTile[]; className?: string }) {
  return (
    <div className={cn("grid grid-cols-3 gap-3 sm:gap-4", className)}>
      {stats.map((s, i) => (
        <div key={i} className="rounded-2xl border border-border bg-card/40 px-4 sm:px-5 py-4 text-center">
          <div className="text-[10px] font-mono uppercase tracking-[0.16em] text-muted-foreground/70">{s.label}</div>
          <div style={DISPLAY} className="text-2xl sm:text-3xl font-bold mt-1">{s.value}</div>
        </div>
      ))}
    </div>
  );
}
StatsRow.displayName = "StatsRow";

// ── FilterBar (search + category chips + sort) ─────────────────────────────────────
export interface FilterChip { value: string; label: string; count?: number; }
export interface FilterBarProps {
  search: string;
  onSearch: (v: string) => void;
  chips: FilterChip[];
  active: string;
  onChip: (v: string) => void;
  sort?: { value: string; options: { value: string; label: string }[]; onSort: (v: string) => void };
  searchPlaceholder?: string;
  className?: string;
}
export function FilterBar({ search, onSearch, chips, active, onChip, sort, searchPlaceholder = "Search plugins…", className }: FilterBarProps) {
  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
        <div className="relative flex-1 min-w-0">
          <Search size={15} className="absolute start-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <input
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full h-11 ps-10 pe-4 rounded-full border border-border bg-card/40 text-sm outline-none focus:border-primary transition-colors"
          />
        </div>
        {sort && (
          <select
            value={sort.value}
            onChange={(e) => sort.onSort(e.target.value)}
            className="h-11 px-4 rounded-full border border-border bg-card/40 text-sm outline-none cursor-pointer"
          >
            {sort.options.map((o) => <option key={o.value} value={o.value} className="bg-background">{o.label}</option>)}
          </select>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {chips.map((c) => {
          const on = active === c.value;
          return (
            <button
              key={c.value}
              onClick={() => onChip(c.value)}
              className={cn(
                "font-mono text-[12px] px-3.5 py-1.5 rounded-full border transition-colors",
                on
                  ? "border-primary text-foreground bg-primary/10"
                  : "border-border text-muted-foreground hover:text-foreground hover:bg-card/40",
              )}
            >
              {c.label}{typeof c.count === "number" && <span className="opacity-50"> {c.count}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
FilterBar.displayName = "FilterBar";

// ── Pager ─────────────────────────────────────────────────────────────────────
export function Pager({ page, pages, onPage, className }: { page: number; pages: number; onPage: (p: number) => void; className?: string }) {
  if (pages <= 1) return null;
  const nums = Array.from({ length: pages }, (_, i) => i + 1).filter((n) => n === 1 || n === pages || Math.abs(n - page) <= 1);
  const btn = "min-w-9 h-9 px-2 rounded-full border text-sm font-mono transition-colors";
  return (
    <div className={cn("flex items-center justify-center gap-1.5", className)}>
      <button disabled={page <= 1} onClick={() => onPage(page - 1)} className={cn(btn, "border-border text-muted-foreground hover:text-foreground disabled:opacity-30")}>‹</button>
      {nums.map((n, i) => (
        <React.Fragment key={n}>
          {i > 0 && n - nums[i - 1] > 1 && <span className="text-muted-foreground/50 px-1">…</span>}
          <button onClick={() => onPage(n)} className={cn(btn, n === page ? "border-primary text-foreground bg-primary/10" : "border-border text-muted-foreground hover:text-foreground")}>{n}</button>
        </React.Fragment>
      ))}
      <button disabled={page >= pages} onClick={() => onPage(page + 1)} className={cn(btn, "border-border text-muted-foreground hover:text-foreground disabled:opacity-30")}>›</button>
    </div>
  );
}
Pager.displayName = "Pager";
