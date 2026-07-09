"use client";

import * as React from "react";
import { Info, AlertTriangle, Lightbulb, Search, ChevronRight } from "lucide-react";
import { cn } from "@togo-framework/ui-core";

const DISPLAY: React.CSSProperties = { fontFamily: '"Sora", var(--togo-font-body, ui-sans-serif, system-ui, sans-serif)' };

// ── Callout / admonition ───────────────────────────────────────────────────────────
export function Callout({ kind = "info", title, children, className }: { kind?: "info" | "warn" | "tip" | "note"; title?: string; children: React.ReactNode; className?: string }) {
  const { Icon, c } = {
    info: { Icon: Info, c: "#2D8CE6" },
    warn: { Icon: AlertTriangle, c: "#f5a623" },
    tip: { Icon: Lightbulb, c: "#1FC7DC" },
    note: { Icon: Info, c: "#8b97a3" },
  }[kind];
  return (
    <div className={cn("rounded-xl border p-4 flex gap-3 my-4", className)} style={{ borderColor: `${c}40`, background: `${c}12` }}>
      <Icon size={18} style={{ color: c }} className="shrink-0 mt-0.5" />
      <div className="text-sm text-foreground/90 [&>p]:m-0 [&>p]:leading-relaxed">
        {title && <div className="font-semibold mb-1" style={DISPLAY}>{title}</div>}
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
      <button onClick={() => setOpen((o) => !o)} className="w-full flex items-center gap-1.5 px-2 py-1.5 text-[11px] font-mono uppercase tracking-[0.14em] text-muted-foreground/70 hover:text-foreground">
        <ChevronRight size={12} className={cn("transition-transform", open && "rotate-90")} />
        {group.label}
      </button>
      {open && (
        <ul className="mt-0.5 mb-2 ms-3 border-s border-border">
          {group.items.map((i) => {
            const on = i.href === activeHref;
            return (
              <li key={i.href}>
                <a
                  href={i.href}
                  onClick={onNavigate ? (e) => { e.preventDefault(); onNavigate(i.href); } : undefined}
                  className={cn("block ps-3 -ms-px border-s py-1.5 transition-colors", on ? "border-[#1FC7DC] text-[#5CDDEC]" : "border-transparent text-muted-foreground hover:text-foreground")}
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
      <div className="text-[10px] font-mono uppercase tracking-[0.16em] text-muted-foreground/60 mb-3">On this page</div>
      <ul className="border-s border-border">
        {items.map((i) => (
          <li key={i.id} style={{ paddingInlineStart: `${(Math.max(1, i.level) - 1) * 12}px` }}>
            <a href={`#${i.id}`} className={cn("block ps-3 -ms-px border-s py-1 transition-colors", active === i.id ? "border-[#1FC7DC] text-[#5CDDEC]" : "border-transparent text-muted-foreground hover:text-foreground")}>{i.text}</a>
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
        <aside className="hidden lg:block w-60 shrink-0 sticky top-20 self-start max-h-[calc(100vh-6rem)] overflow-y-auto py-8 pe-2">{sidebar}</aside>
        <main className="min-w-0 flex-1 py-8 max-w-3xl">
          {breadcrumb && <div className="text-[12px] font-mono text-muted-foreground/70 mb-3">{breadcrumb}</div>}
          {children}
        </main>
        {toc && <aside className="hidden xl:block w-56 shrink-0 sticky top-20 self-start max-h-[calc(100vh-6rem)] overflow-y-auto py-8">{toc}</aside>}
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
      <button onClick={() => setOpen(true)} className={cn("inline-flex items-center gap-2 h-9 px-3 rounded-full border border-border bg-card/40 text-sm text-muted-foreground hover:text-foreground transition-colors", className)}>
        <Search size={14} /> <span className="hidden sm:inline">Search</span>
        <kbd className="hidden sm:inline font-mono text-[10px] border border-border rounded px-1 py-0.5">⌘K</kbd>
      </button>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[12vh] bg-black/60" onClick={() => setOpen(false)}>
          <div className="w-full max-w-xl mx-4 rounded-2xl border border-border bg-card shadow-[0_30px_80px_-20px_rgba(0,0,0,.8)] overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 px-4 border-b border-border">
              <Search size={16} className="text-muted-foreground" />
              <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder={placeholder} className="flex-1 h-12 bg-transparent outline-none text-sm" />
              <kbd className="font-mono text-[10px] text-muted-foreground border border-border rounded px-1">esc</kbd>
            </div>
            <ul className="max-h-[50vh] overflow-auto p-2">
              {results.map((r, idx) => (
                <li key={idx}>
                  <a href={r.href} className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-card/40">
                    <span className="text-sm truncate">{r.label}</span>
                    {r.sublabel && <span className="text-xs text-muted-foreground truncate min-w-0">{r.sublabel}</span>}
                    {r.group && <span className="ms-auto shrink-0 text-[10px] font-mono uppercase text-muted-foreground/60">{r.group}</span>}
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
