import type { LayoutProps } from "./types";
import { OrnamentSpan } from "./OrnamentSpan";

export function ScatteredLayout({ template, theme, state, greeting }: LayoutProps) {
  return (
    <div className={`relative flex h-full w-full items-center justify-center p-6 ${theme.bg}`}>
      {template.ornaments.map((o, i) => (
        <OrnamentSpan key={i} ornament={o} index={i} />
      ))}
      <div className={`flex flex-col items-center gap-2 text-center ecard-anim-${template.primaryAnimation}`}>
        <span className="text-7xl">{state.e ?? "✨"}</span>
        <p className={`text-2xl font-bold leading-tight ${theme.text}`}>{greeting}</p>
        {state.r && <p className={`text-base font-medium ${theme.accent}`}>for {state.r}</p>}
        {state.m && <p className={`max-w-xs text-base ${theme.text} opacity-80`}>{state.m}</p>}
        {state.s && <p className={`text-sm font-semibold ${theme.accent}`}>— {state.s}</p>}
      </div>
    </div>
  );
}
