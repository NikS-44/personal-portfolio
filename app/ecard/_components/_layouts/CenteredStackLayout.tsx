import type { LayoutProps } from "./types";

export function CenteredStackLayout({ template, theme, state }: LayoutProps) {
  return (
    <div className={`relative flex h-full w-full flex-col items-center justify-center gap-3 p-6 ${theme.bg}`}>
      {template.ornaments.map((o, i) => (
        <span
          key={i}
          className={`absolute ${o.positionClass} ${o.sizeClass} ${o.animation !== "none" ? `ecard-anim-${o.animation}` : ""}`}
        >
          {o.emoji}
        </span>
      ))}
      <div className={`ecard-anim-${template.primaryAnimation} flex flex-col items-center gap-3 text-center`}>
        <span className="text-7xl">{state.e ?? "✨"}</span>
        {state.r && (
          <p className={`text-3xl font-bold ${theme.text}`}>
            Happy {template.name.split(" ")[0]}, {state.r}!
          </p>
        )}
        {state.m && <p className={`max-w-xs text-lg ${theme.text} opacity-80`}>{state.m}</p>}
        {state.s && <p className={`text-base font-medium ${theme.accent}`}>— {state.s}</p>}
      </div>
    </div>
  );
}
