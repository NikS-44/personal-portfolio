import type { LayoutProps } from "./types";
import { OrnamentSpan } from "./OrnamentSpan";

export function RibbonLayout({ template, theme, state, greeting }: LayoutProps) {
  return (
    <div
      className={`relative flex h-full w-full flex-col items-center justify-center gap-3 overflow-hidden p-6 ${theme.bg}`}
    >
      <div
        className={`absolute -right-8 -top-8 h-24 w-24 rotate-45 bg-gradient-to-br ${theme.gradientFrom} ${theme.gradientTo}`}
      />
      <span className="absolute right-1 top-1 text-2xl">{state.e ?? "✨"}</span>
      {template.ornaments.map((o, i) => (
        <OrnamentSpan key={i} ornament={o} index={i} />
      ))}
      <div className={`flex flex-col items-center gap-2 text-center ecard-anim-${template.primaryAnimation}`}>
        <span className="text-6xl">{state.e ?? "✨"}</span>
        <p className={`text-2xl font-bold leading-tight ${theme.text}`}>{greeting}</p>
        {state.r && <p className={`text-base font-medium ${theme.accent}`}>for {state.r}</p>}
        {state.m && <p className={`max-w-xs text-base ${theme.text} opacity-80`}>{state.m}</p>}
        {state.s && <p className={`text-sm font-semibold ${theme.accent}`}>— {state.s}</p>}
      </div>
    </div>
  );
}
