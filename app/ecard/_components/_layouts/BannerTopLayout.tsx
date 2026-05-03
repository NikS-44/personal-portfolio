import type { LayoutProps } from "./types";
import { OrnamentSpan } from "./OrnamentSpan";

export function BannerTopLayout({ template, theme, state, greeting }: LayoutProps) {
  return (
    <div className={`relative flex h-full w-full flex-col overflow-hidden ${theme.bg}`}>
      <div
        className={`flex flex-col items-center justify-center gap-1 bg-gradient-to-br ${theme.gradientFrom} ${theme.gradientTo} px-6 py-6`}
      >
        <span className="text-5xl">{state.e ?? "✨"}</span>
        <p className={`text-center text-2xl font-bold leading-tight ${theme.text}`}>{greeting}</p>
        {state.r && <p className={`text-sm font-medium ${theme.text} opacity-70`}>for {state.r}</p>}
      </div>
      <div
        className={`flex flex-1 flex-col items-center justify-center gap-3 px-6 py-4 text-center ecard-anim-${template.primaryAnimation}`}
      >
        {state.m && <p className={`text-lg ${theme.text} opacity-80`}>{state.m}</p>}
        {state.s && <p className={`text-base font-semibold ${theme.accent}`}>— {state.s}</p>}
      </div>
      {template.ornaments.map((o, i) => (
        <OrnamentSpan key={i} ornament={o} index={i} />
      ))}
    </div>
  );
}
