import type { LayoutProps } from "./types";

export function MinimalSerifLayout({ template, theme, state }: LayoutProps) {
  return (
    <div className={`relative flex h-full w-full flex-col items-center justify-center gap-4 p-10 ${theme.bg}`}>
      {template.ornaments.map((o, i) => (
        <span
          key={i}
          className={`absolute ${o.positionClass} ${o.sizeClass} opacity-40 ${o.animation !== "none" ? `ecard-anim-${o.animation}` : ""}`}
        >
          {o.emoji}
        </span>
      ))}
      <div className={`flex flex-col items-center gap-4 text-center ecard-anim-${template.primaryAnimation}`}>
        <span className="text-5xl">{state.e ?? "✨"}</span>
        {state.r && <p className={`font-serif text-3xl font-light tracking-wide ${theme.text}`}>{state.r}</p>}
        <div className={`h-px w-16 ${theme.border} border-t-2`} />
        {state.m && <p className={`max-w-xs text-base italic ${theme.text} opacity-70`}>{state.m}</p>}
        {state.s && <p className={`text-sm font-semibold uppercase tracking-widest ${theme.accent}`}>{state.s}</p>}
      </div>
    </div>
  );
}
