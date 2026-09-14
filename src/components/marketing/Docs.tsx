"use client";

import * as React from "react";
import { Info, AlertTriangle, Lightbulb, Search, ChevronRight } from "lucide-react";
import { cn } from "@togo-framework/ui-core";

const DISPLAY: React.CSSProperties = { fontFamily: "var(--togo-font-display, ui-sans-serif, system-ui, sans-serif)" };

// ── Callout / admonition ───────────────────────────────────────────────────────────
// A hairline box whose tone is a rule on the inline-start edge — token colours only.
const TONES = {
  info: { Icon: Info, c: "hsl(var(--info))" },
  warn: { Icon: AlertTriangle, c: "hsl(var(--warning))" },
  tip: { Icon: Lightbulb, c: "hsl(var(--primary))" },
  note: { Icon: Info, c: "hsl(var(--muted-foreground))" },
} as const;
export function Callout({ kind = "info", title, children, className }: { kind?: "info" | "warn" | "tip" | "note"; title?: string; children: React.ReactNode; className?: string }) {
  const { Icon, c } = TONES[kind];
  return (
    <div
      className={cn("my-4 flex gap-3 border border-s-2 border-border p-4", className)}
      style={{ borderInlineStartColor: c, background: `color-mix(in oklab, ${c} 6%, transparent)` }}
    >
      <Icon size={18} style={{ color: c }} className="mt-0.5 shrink-0" />
      <div className="text-sm text-foreground/90 [&>p]:m-0 [&>p]:leading-relaxed">
        {title && <div className="mb-1 font-medium" style={DISPLAY}>{title}</div>}
        {children}
      </div>
    </div>
  );
}
Callout.displayName = "Callout";

// ── DocsSidebar — grouped, collapsible, active-highlight ────────────────────────────
export interface DocsNavItem { label: string; href: string; }
export interface DocsNavGroup { label: string; items: DocsNavItem[] }
export function DocsSidebar({ groups, activeHref, className, onNavigate }: { groups: DocsNavGroup[]; activeHref?: string; className?: string; onNavigate?: (href: string) => void }) {
  return (
    <nav className={cn("text-sm", className)}>
      {groups.map((g) => {
        const hasActive = g.items.some((i) => i.href === activeHref);
        return <DocsGroup key={g.label} group={g} activeHref={activeHref} defaultOpen={hasActive} onNavigate={onNavigate} />;
      })}
    </nav>
  );
}
function DocsGroup({ group, activeHref, defaultOpen, onNavigate }: { group: DocsNavGroup; activeHref?: string; defaultOpen: boolean; onNavigate?: (href: string) => void }) {
  const [open, setOpen] = React.useState(defaultOpen);
  return (
    <div className="mb-1">
      <button onClick={() => setOpen((o) => !o)} className="flex w-full items-center gap-1.5 px-2 py-1.5 font-mono text-[10.5px] uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground">
        <ChevronRight size={12} className={cn(open && "rotate-90")} />
        {group.label}
      </button>
      {open && (
        <ul className="mb-2 ms-3 mt-0.5 border-s border-border">
          {group.items.map((i) => {
            const on = i.href === activeHref;
            return (
              <li key={i.href}>
                <a
                  href={i.href}
                  onClick={onNavigate ? (e) => { e.preventDefault(); onNavigate(i.href); } : undefined}
                  aria-current={on ? "page" : undefined}
                  className={cn("-ms-px block border-s py-1.5 ps-3 transition-colors", on ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground")}
                >
                  {i.label}
                </a>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
DocsSidebar.displayName = "DocsSidebar";

// ── DocsTOC — right "On this page", scroll-spy (degrades visible for prerender) ─────
export interface TocItem { id: string; text: string; level: number; }
export function DocsTOC({ items, className }: { items: TocItem[]; className?: string }) {
  const [active, setActive] = React.useState<string>("");
  React.useEffect(() => {
    if (!items.length) return;
    const obs = new IntersectionObserver(
      (entries) => {
        const vis = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (vis[0]) setActive(vis[0].target.id);
      },
      { rootMargin: "-80px 0px -70% 0px" },
    );
    items.forEach((i) => { const el = document.getElementById(i.id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, [items]);
  if (!items.length) return null;
  return (
    <nav className={cn("text-sm", className)}>
      <div className="mb-3 font-mono text-[10.5px] uppercase tracking-[0.2em] text-muted-foreground">On this page</div>
      <ul className="border-s border-border">
        {items.map((i) => (
          <li key={i.id} style={{ paddingInlineStart: `${(Math.max(1, i.level) - 1) * 12}px` }}>
            <a href={`#${i.id}`} className={cn("-ms-px block border-s py-1 ps-3 transition-colors", active === i.id ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground")}>{i.text}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
DocsTOC.displayName = "DocsTOC";

// ── DocsLayout — 3-column docs shell (sidebar · content · TOC) ──────────────────────
export interface DocsLayoutProps {
  sidebar: React.ReactNode;
  toc?: React.ReactNode;
  breadcrumb?: React.ReactNode;
  topbar?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}
export function DocsLayout({ sidebar, toc, breadcrumb, topbar, children, className }: DocsLayoutProps) {
  return (
    <div className={cn("mx-auto max-w-7xl px-4 sm:px-6", className)}>
      {topbar}
      <div className="flex gap-8">
        <aside className="sticky top-20 hidden max-h-[calc(100vh-6rem)] w-60 shrink-0 self-start overflow-y-auto py-8 pe-2 lg:block">{sidebar}</aside>
        <main className="min-w-0 max-w-3xl flex-1 py-8">
          {breadcrumb && <div className="mb-3 font-mono text-[12px] text-muted-foreground">{breadcrumb}</div>}
          {children}
        </main>
        {toc && <aside className="sticky top-20 hidden max-h-[calc(100vh-6rem)] w-56 shrink-0 self-start overflow-y-auto py-8 xl:block">{toc}</aside>}
      </div>
    </div>
  );
}
DocsLayout.displayName = "DocsLayout";

// ── CommandPalette (⌘K) ─────────────────────────────────────────────────────────────
export interface PaletteItem { label: string; sublabel?: string; href: string; group?: string; }
export function CommandPalette({ items, placeholder = "Search docs & plugins…", className }: { items: PaletteItem[]; placeholder?: string; className?: string }) {
  const [open, setOpen] = React.useState(false);
  const [q, setQ] = React.useState("");
  React.useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setOpen((o) => !o); }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);
  const results = q
    ? items.filter((i) => (i.label + " " + (i.sublabel || "")).toLowerCase().includes(q.toLowerCase())).slice(0, 40)
    : items.slice(0, 24);
  return (
    <>
      <button onClick={() => setOpen(true)} className={cn("inline-flex h-9 items-center gap-2 rounded-md border border-border bg-card px-3 text-sm text-muted-foreground transition-colors hover:text-foreground", className)}>
        <Search size={14} /> <span className="hidden sm:inline">Search</span>
        <kbd className="hidden rounded-sm border border-border px-1 py-0.5 font-mono text-[10px] sm:inline">⌘K</kbd>
      </button>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center bg-black/60 pt-[12vh]" onClick={() => setOpen(false)}>
          <div
            role="dialog"
            aria-modal="true"
            className="mx-4 w-full max-w-xl overflow-hidden rounded-[var(--togo-radius-floating,0.75rem)] border border-border bg-popover"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 border-b border-border px-4">
              <Search size={16} className="text-muted-foreground" />
              <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder={placeholder} className="h-12 flex-1 bg-transparent text-sm outline-none" />
              <kbd className="rounded-sm border border-border px-1 font-mono text-[10px] text-muted-foreground">esc</kbd>
            </div>
            <ul className="max-h-[50vh] overflow-auto p-2">
              {results.map((r, idx) => (
                <li key={idx}>
                  <a href={r.href} className="flex items-center gap-3 rounded-md px-3 py-2.5 hover:bg-muted">
                    <span className="truncate text-sm">{r.label}</span>
                    {r.sublabel && <span className="min-w-0 truncate text-xs text-muted-foreground">{r.sublabel}</span>}
                    {r.group && <span className="ms-auto shrink-0 font-mono text-[10px] uppercase text-muted-foreground">{r.group}</span>}
                  </a>
                </li>
              ))}
              {!results.length && <li className="px-3 py-6 text-center text-sm text-muted-foreground">No results.</li>}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
CommandPalette.displayName = "CommandPalette";
