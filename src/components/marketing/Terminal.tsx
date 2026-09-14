"use client";

// TypingTerminal — a live CLI playback for marketing heroes. Types each command at
// a `❯` prompt, then streams its output lines, step by step, and finally reveals an
// `endSlot` (e.g. a screenshot of the resulting app). Plays ONCE by default and shows
// a Replay button when finished. Fixed-height window (no layout jump while typing).
// Prerender/SEO/no-JS safe: the initial render shows the COMPLETE final frame; on the
// client it resets and animates, unless `prefers-reduced-motion` / headless.

import * as React from "react";
import { RotateCcw } from "lucide-react";
import { cn } from "@togo-framework/ui-core";

export interface TerminalStep {
  /** Command typed at the prompt (without the leading ❯). */
  cmd: string;
  /** Output lines streamed after the command. */
  out?: string[];
}

export interface TypingTerminalProps {
  steps: TerminalStep[];
  /** Revealed after the last step finishes (e.g. an app screenshot/mock). */
  endSlot?: React.ReactNode;
  title?: string;
  className?: string;
  /** ms per typed character. */
  typeMs?: number;
  /** ms between streamed output lines. */
  lineMs?: number;
  /** Loop the playback. Default false — plays once, then offers Replay. */
  loop?: boolean;
  /** Fixed body height (px). The window never grows/jumps while typing. */
  height?: number;
  /** Fired once when the playback (or the static frame) completes. */
  onComplete?: () => void;
}

type Frame = { lines: React.ReactNode[]; showEnd: boolean };

function fullFrame(steps: TerminalStep[]): Frame {
  const lines: React.ReactNode[] = [];
  steps.forEach((s, i) => {
    lines.push(
      <div key={`c${i}`} className="whitespace-pre-wrap break-words">
        <span className="text-primary">❯ </span>
        <span className="text-foreground">{s.cmd}</span>
      </div>,
    );
    (s.out || []).forEach((l, j) => lines.push(<div key={`o${i}-${j}`} className="whitespace-pre-wrap break-words text-muted-foreground">{l}</div>));
  });
  return { lines, showEnd: true };
}

// Keep the complete final frame when motion is unwanted OR under headless automation
// (the prerender crawler) so the static HTML ships the full transcript + endSlot for SEO.
const keepStaticFrame = () =>
  typeof window !== "undefined" &&
  (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches || (navigator as Navigator)?.webdriver === true);

export function TypingTerminal({ steps, endSlot, title = "~/myapp — togo", className, typeMs = 26, lineMs = 110, loop = false, height = 360, onComplete }: TypingTerminalProps) {
  // SSR / first paint = the complete final frame (crawlers + no-JS see everything).
  const [frame, setFrame] = React.useState<Frame>(() => fullFrame(steps));
  const [done, setDone] = React.useState(false);
  const [runId, setRunId] = React.useState(0);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const onDone = React.useRef(onComplete);
  onDone.current = onComplete;

  React.useEffect(() => {
    if (keepStaticFrame()) { setDone(true); onDone.current?.(); return; } // keep the static final frame
    let alive = true;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const wait = (ms: number) => new Promise<void>((res) => timers.push(setTimeout(res, ms)));
    const toBottom = () => { if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; };

    async function run() {
      setDone(false);
      do {
        const lines: React.ReactNode[] = [];
        setFrame({ lines: [], showEnd: false });
        for (let i = 0; i < steps.length && alive; i++) {
          const s = steps[i];
          for (let c = 1; c <= s.cmd.length && alive; c++) {
            const typed = s.cmd.slice(0, c);
            setFrame({
              lines: [...lines, <div key={`c${i}`} className="whitespace-pre-wrap break-words"><span className="text-primary">❯ </span><span className="text-foreground">{typed}</span><span className="ml-0.5 inline-block w-2 -mb-0.5 h-4 bg-primary animate-pulse" /></div>],
              showEnd: false,
            });
            toBottom();
            await wait(typeMs);
          }
          lines.push(<div key={`c${i}`} className="whitespace-pre-wrap break-words"><span className="text-primary">❯ </span><span className="text-foreground">{s.cmd}</span></div>);
          await wait(220);
          for (let j = 0; j < (s.out?.length || 0) && alive; j++) {
            lines.push(<div key={`o${i}-${j}`} className="whitespace-pre-wrap break-words text-muted-foreground">{s.out![j]}</div>);
            setFrame({ lines: [...lines], showEnd: false });
            toBottom();
            await wait(lineMs);
          }
        }
        if (!alive) return;
        setFrame({ lines: [...lines], showEnd: true });
        toBottom();
        if (!loop) { setDone(true); onDone.current?.(); return; }
        await wait(4200);
      } while (alive);
    }
    run();
    return () => { alive = false; timers.forEach(clearTimeout); };
  }, [steps, typeMs, lineMs, loop, runId]);

  return (
    <div className={cn("rounded-2xl border border-border overflow-hidden bg-background shadow-2xl", className)}>
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
        <span className="w-3 h-3 bg-border" /><span className="w-3 h-3 bg-border" /><span className="w-3 h-3 bg-border" />
        <span className="ms-2 font-mono text-xs text-muted-foreground">{title}</span>
        {done && !loop && (
          <button
            type="button"
            onClick={() => setRunId((n) => n + 1)}
            className="ms-auto inline-flex items-center gap-1.5 rounded-md border border-white/12 bg-white/[0.04] px-2.5 py-1 font-mono text-[11px] text-muted-foreground hover:text-foreground hover:bg-white/[0.08] transition-colors"
            aria-label="Replay the terminal demo"
          >
            <RotateCcw size={12} /> Replay
          </button>
        )}
      </div>
      <div ref={scrollRef} className="p-5 font-mono text-[12.5px] sm:text-[13px] leading-[1.9] overflow-auto" style={{ height }}>
        {frame.lines}
        {frame.showEnd && endSlot ? <div className="mt-4 pt-4 border-t border-white/10">{endSlot}</div> : null}
      </div>
    </div>
  );
}
TypingTerminal.displayName = "TypingTerminal";
