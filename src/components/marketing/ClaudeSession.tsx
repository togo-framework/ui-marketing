"use client";

// ClaudeSession — a marketing playback styled like a Claude Code terminal session:
// a typed user prompt, streamed assistant commentary, and tool-use lines
// (⏺ Bash(...) / ⎿ result) — conveying AI-driven development. Same playback contract
// as TypingTerminal: plays once + Replay, fixed height (no layout jump), prerender/
// reduced-motion safe (renders the COMPLETE final transcript), fires `onComplete`.

import * as React from "react";
import { RotateCcw, Sparkles } from "lucide-react";
import { cn } from "@togo-framework/ui-core";

export type ClaudeStep =
  | { kind: "user"; text: string }
  | { kind: "assistant"; text: string }
  | { kind: "tool"; tool: string; arg: string; result?: string };

export interface ClaudeSessionProps {
  steps: ClaudeStep[];
  /** Revealed after the last step finishes (e.g. a BrowserFrame with the running app). */
  endSlot?: React.ReactNode;
  title?: string;
  className?: string;
  typeMs?: number;
  lineMs?: number;
  loop?: boolean;
  /** Fixed body height (px). The window never grows/jumps while playing. */
  height?: number;
  /** Fired once when the playback (or the static frame) completes. */
  onComplete?: () => void;
}

const Tool = ({ tool, arg }: { tool: string; arg: string }) => (
  <div className="whitespace-pre-wrap break-words">
    <span className="text-success">⏺ </span>
    <span className="text-foreground font-semibold">{tool}</span>
    <span className="text-muted-foreground">({arg})</span>
  </div>
);
const Result = ({ text }: { text: string }) => (
  <div className="whitespace-pre-wrap break-words text-muted-foreground ps-3"><span className="text-muted-foreground/60">⎿  </span>{text}</div>
);
const User = ({ text }: { text: string }) => (
  <div className="whitespace-pre-wrap break-words"><span className="text-primary">&gt; </span><span className="text-foreground">{text}</span></div>
);
const Assistant = ({ text }: { text: string }) => (
  <div className="whitespace-pre-wrap break-words text-foreground/80"><span className="text-primary">✻ </span>{text}</div>
);

function fullFrame(steps: ClaudeStep[]): React.ReactNode[] {
  const out: React.ReactNode[] = [];
  steps.forEach((s, i) => {
    if (s.kind === "user") out.push(<User key={`u${i}`} text={s.text} />);
    else if (s.kind === "assistant") out.push(<Assistant key={`a${i}`} text={s.text} />);
    else { out.push(<Tool key={`t${i}`} tool={s.tool} arg={s.arg} />); if (s.result) out.push(<Result key={`r${i}`} text={s.result} />); }
  });
  return out;
}

const keepStaticFrame = () =>
  typeof window !== "undefined" &&
  (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches || (navigator as Navigator)?.webdriver === true);

export function ClaudeSession({ steps, endSlot, title = "✻ Claude Code — togo", className, typeMs = 22, lineMs = 320, loop = false, height = 360, onComplete }: ClaudeSessionProps) {
  const [lines, setLines] = React.useState<React.ReactNode[]>(() => fullFrame(steps));
  const [showEnd, setShowEnd] = React.useState(true);
  const [done, setDone] = React.useState(false);
  const [runId, setRunId] = React.useState(0);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const onDone = React.useRef(onComplete);
  onDone.current = onComplete;

  React.useEffect(() => {
    if (keepStaticFrame()) { setDone(true); onDone.current?.(); return; }
    let alive = true;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const wait = (ms: number) => new Promise<void>((res) => timers.push(setTimeout(res, ms)));
    const toBottom = () => { if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; };

    async function run() {
      setDone(false); setShowEnd(false);
      do {
        const acc: React.ReactNode[] = [];
        setLines([]);
        for (let i = 0; i < steps.length && alive; i++) {
          const s = steps[i];
          if (s.kind === "user") {
            for (let c = 1; c <= s.text.length && alive; c++) {
              setLines([...acc, <div key={`u${i}`} className="whitespace-pre-wrap break-words"><span className="text-primary">&gt; </span><span className="text-foreground">{s.text.slice(0, c)}</span><span className="ml-0.5 inline-block w-2 -mb-0.5 h-4 bg-primary animate-pulse" /></div>]);
              toBottom(); await wait(typeMs);
            }
            acc.push(<User key={`u${i}`} text={s.text} />);
            await wait(420);
          } else if (s.kind === "assistant") {
            acc.push(<Assistant key={`a${i}`} text={s.text} />);
            setLines([...acc]); toBottom(); await wait(lineMs);
          } else {
            acc.push(<Tool key={`t${i}`} tool={s.tool} arg={s.arg} />);
            setLines([...acc]); toBottom(); await wait(Math.round(lineMs * 0.7));
            if (s.result) { acc.push(<Result key={`r${i}`} text={s.result} />); setLines([...acc]); toBottom(); await wait(lineMs); }
          }
        }
        if (!alive) return;
        setLines([...acc]); setShowEnd(true); setDone(true); toBottom(); onDone.current?.();
        if (!loop) return;
        await wait(4200);
      } while (alive);
    }
    run();
    return () => { alive = false; timers.forEach(clearTimeout); };
  }, [steps, typeMs, lineMs, loop, runId]);

  return (
    <div className={cn("border border-border overflow-hidden bg-background", className)}>
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
        <Sparkles size={13} className="text-primary" />
        <span className="font-mono text-xs text-muted-foreground">{title}</span>
        {done && !loop && (
          <button type="button" onClick={() => setRunId((n) => n + 1)}
            className="ms-auto inline-flex items-center gap-1.5 rounded-md border border-white/12 bg-white/[0.04] px-2.5 py-1 font-mono text-[11px] text-muted-foreground hover:text-foreground hover:bg-white/[0.08] transition-colors"
            aria-label="Replay the Claude Code session">
            <RotateCcw size={12} /> Replay
          </button>
        )}
      </div>
      <div ref={scrollRef} className="p-5 font-mono text-[12.5px] sm:text-[13px] leading-[1.9] overflow-auto" style={{ height }}>
        {lines}
        {showEnd && endSlot ? <div className="mt-4 pt-4 border-t border-white/10">{endSlot}</div> : null}
      </div>
    </div>
  );
}
ClaudeSession.displayName = "ClaudeSession";
