import type { LayoutProps } from "./types";

export function StarburstLayout({ template, theme, state }: LayoutProps) {
  return (
    <div
      className={`relative flex h-full w-full flex-col items-center justify-center gap-3 p-6 ${theme.bg}`}
      style={{
        background: `radial-gradient(circle at center, var(--tw-gradient-from, white) 0%, var(--tw-gradient-to, transparent) 100%)`,
      }}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${theme.gradientFrom} ${theme.gradientTo} opacity-60`} />
      {template.ornaments.map((o, i) => (
        <span
          key={i}
          className={`absolute ${o.positionClass} ${o.sizeClass} z-10 ${o.animation !== "none" ? `ecard-anim-${o.animation}` : ""}`}
        >
          {o.emoji}
        </span>
      ))}
      <div
        className={`relative z-10 flex flex-col items-center gap-3 text-center ecard-anim-${template.primaryAnimation}`}
      >
        <span className="text-7xl">{state.e ?? "✨"}</span>
        {state.r && <p className={`text-2xl font-bold ${theme.text}`}>{state.r}</p>}
        {state.m && <p className={`max-w-xs text-base ${theme.text} opacity-80`}>{state.m}</p>}
        {state.s && <p className={`text-sm font-semibold ${theme.accent}`}>— {state.s}</p>}
      </div>
    </div>
  );
}
