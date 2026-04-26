import type { LayoutProps } from "./types";

export function FramedLayout({ template, theme, state }: LayoutProps) {
  return (
    <div className={`relative flex h-full w-full items-center justify-center p-4 ${theme.bg}`}>
      {template.ornaments.map((o, i) => (
        <span
          key={i}
          className={`absolute ${o.positionClass} ${o.sizeClass} ${o.animation !== "none" ? `ecard-anim-${o.animation}` : ""}`}
        >
          {o.emoji}
        </span>
      ))}
      <div
        className={`flex h-[85%] w-[85%] flex-col items-center justify-center gap-3 rounded-xl border-4 ${theme.border} bg-white/60 p-6 text-center ecard-anim-${template.primaryAnimation}`}
      >
        <span className="text-6xl">{state.e ?? "✨"}</span>
        {state.r && <p className={`text-2xl font-bold ${theme.text}`}>{state.r}</p>}
        {state.m && <p className={`text-base ${theme.text} opacity-80`}>{state.m}</p>}
        {state.s && <p className={`mt-1 text-sm font-semibold ${theme.accent}`}>From {state.s}</p>}
      </div>
    </div>
  );
}
