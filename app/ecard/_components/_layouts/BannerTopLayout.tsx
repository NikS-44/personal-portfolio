import type { LayoutProps } from "./types";

export function BannerTopLayout({ template, theme, state }: LayoutProps) {
  return (
    <div className={`relative flex h-full w-full flex-col overflow-hidden ${theme.bg}`}>
      <div
        className={`flex flex-col items-center justify-center gap-2 bg-gradient-to-br ${theme.gradientFrom} ${theme.gradientTo} px-6 py-8`}
      >
        <span className="text-6xl">{state.e ?? "✨"}</span>
        {state.r && <p className={`text-2xl font-bold ${theme.text}`}>{state.r}</p>}
      </div>
      <div
        className={`flex flex-1 flex-col items-center justify-center gap-3 px-6 py-4 text-center ecard-anim-${template.primaryAnimation}`}
      >
        {state.m && <p className={`text-lg ${theme.text} opacity-80`}>{state.m}</p>}
        {state.s && <p className={`text-base font-semibold ${theme.accent}`}>— {state.s}</p>}
      </div>
      {template.ornaments.map((o, i) => (
        <span
          key={i}
          className={`absolute ${o.positionClass} ${o.sizeClass} ${o.animation !== "none" ? `ecard-anim-${o.animation}` : ""}`}
        >
          {o.emoji}
        </span>
      ))}
    </div>
  );
}
