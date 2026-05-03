import type { LayoutProps } from "./types";
import { OrnamentSpan } from "./OrnamentSpan";

export function FramedLayout({ template, theme, state, greeting }: LayoutProps) {
  return (
    <div className={`relative flex h-full w-full items-center justify-center p-4 ${theme.bg}`}>
      {template.ornaments.map((o, i) => (
        <OrnamentSpan key={i} ornament={o} index={i} />
      ))}
      <div
        className={`flex h-[85%] w-[85%] flex-col items-center justify-center gap-2 rounded-xl border-4 ${theme.border} bg-white/60 p-6 text-center ecard-anim-${template.primaryAnimation}`}
      >
        <span className="text-5xl">{state.e ?? "✨"}</span>
        <p className={`text-2xl font-bold leading-tight ${theme.text}`}>{greeting}</p>
        {state.r && <p className={`text-sm font-medium ${theme.accent}`}>for {state.r}</p>}
        {state.m && <p className={`text-sm ${theme.text} opacity-80`}>{state.m}</p>}
        {state.s && <p className={`mt-1 text-xs font-semibold ${theme.accent}`}>From {state.s}</p>}
      </div>
    </div>
  );
}
