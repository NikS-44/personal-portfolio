import type { LayoutProps } from "./types";
import { OrnamentSpan } from "./OrnamentSpan";

export function MinimalSerifLayout({ template, theme, state, greeting }: LayoutProps) {
  return (
    <div className={`relative flex h-full w-full flex-col items-center justify-center gap-4 p-10 ${theme.bg}`}>
      {template.ornaments.map((o, i) => (
        <OrnamentSpan key={i} ornament={{ ...o, positionClass: `${o.positionClass} opacity-40` }} />
      ))}
      <div className={`flex flex-col items-center gap-3 text-center ecard-anim-${template.primaryAnimation}`}>
        <span className="text-5xl">{state.e ?? "✨"}</span>
        <p className={`font-serif text-2xl font-light leading-snug tracking-wide ${theme.text}`}>{greeting}</p>
        {state.r && <p className={`text-sm font-medium italic ${theme.accent}`}>for {state.r}</p>}
        <div className={`h-px w-16 ${theme.border} border-t-2`} />
        {state.m && <p className={`max-w-xs text-sm italic ${theme.text} opacity-70`}>{state.m}</p>}
        {state.s && <p className={`text-xs font-semibold uppercase tracking-widest ${theme.accent}`}>{state.s}</p>}
      </div>
    </div>
  );
}
