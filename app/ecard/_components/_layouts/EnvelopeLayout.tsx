import type { LayoutProps } from "./types";

export function EnvelopeLayout({ template, theme, state }: LayoutProps) {
  return (
    <div className={`relative flex h-full w-full flex-col overflow-hidden ${theme.bg}`}>
      <div
        className={`h-0 w-full border-t-[80px] border-l-[50%] border-l-transparent border-r-[50%] border-r-transparent ${theme.border} border-t-current`}
        style={{ borderTopColor: "currentColor" }}
      >
        <div
          className={`absolute left-0 top-0 h-0 w-full border-t-[80px] border-l-[50%] border-l-transparent border-r-[50%] border-r-transparent bg-gradient-to-br ${theme.gradientFrom} ${theme.gradientTo}`}
        />
      </div>
      <div className={`absolute left-0 right-0 top-0 flex h-20 items-center justify-center`}>
        <span className="text-4xl">{state.e ?? "✨"}</span>
      </div>
      <div
        className={`flex flex-1 flex-col items-center justify-center gap-3 px-8 py-4 text-center ecard-anim-${template.primaryAnimation}`}
      >
        {state.r && <p className={`text-2xl font-bold ${theme.text}`}>Dear {state.r},</p>}
        {state.m && <p className={`text-base ${theme.text} opacity-80`}>{state.m}</p>}
        {state.s && <p className={`mt-2 text-sm font-semibold ${theme.accent}`}>With love, {state.s}</p>}
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
