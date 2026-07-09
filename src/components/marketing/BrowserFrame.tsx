"use client";

// BrowserFrame — a lightweight browser-chrome wrapper for showing a running app
// preview (the "it's live" payoff after a CLI/Claude session). Clean, theme-driven,
// no glass. Reusable on marketing heroes and docs.

import * as React from "react";
import { Lock } from "lucide-react";
import { cn } from "@togo-framework/ui-core";

export interface BrowserFrameProps {
  /** URL shown in the address bar. */
  url?: string;
  children: React.ReactNode;
  className?: string;
}

export function BrowserFrame({ url = "localhost:8080", children, className }: BrowserFrameProps) {
  return (
    <div className={cn("rounded-2xl border border-border overflow-hidden bg-[#0b0f13] shadow-2xl", className)}>
      <div className="flex items-center gap-2 px-3 py-2.5 border-b border-border bg-white/[0.03]">
        <span className="w-3 h-3 rounded-full bg-[#ff5f57]" /><span className="w-3 h-3 rounded-full bg-[#febc2e]" /><span className="w-3 h-3 rounded-full bg-[#28c840]" />
        <div className="ms-2 flex flex-1 items-center gap-1.5 rounded-md bg-black/30 px-2.5 py-1 min-w-0">
          <Lock size={11} className="text-muted-foreground shrink-0" />
          <span className="truncate font-mono text-[11px] text-muted-foreground">{url}</span>
        </div>
      </div>
      <div>{children}</div>
    </div>
  );
}
BrowserFrame.displayName = "BrowserFrame";
