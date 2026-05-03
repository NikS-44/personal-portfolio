import type { LayoutProps } from "./types";
import { OrnamentSpan } from "./OrnamentSpan";

export function PolaroidLayout({ template, theme, state, greeting }: LayoutProps) {
  return (
    <div className={`relative flex h-full w-full items-center justify-center ${theme.bg}`}>
      {template.ornaments.map((o, i) => (
        <OrnamentSpan key={i} ornament={o} index={i} />
      ))}
      <div className="flex -rotate-1 flex-col items-center gap-0 rounded-lg bg-white p-3 shadow-xl">
        <div
          className={`flex h-44 w-56 items-center justify-center rounded bg-gradient-to-br ${theme.gradientFrom} ${theme.gradientTo}`}
        >
          <span className="text-7xl">{state.e ?? "✨"}</span>
        </div>
        <div className={`w-56 px-2 pb-2 pt-3 text-center ecard-anim-${template.primaryAnimation}`}>
          <p className={`text-base font-bold leading-tight ${theme.text}`}>{greeting}</p>
          {state.r && <p className={`text-xs font-medium ${theme.accent}`}>for {state.r}</p>}
          {state.m && <p className={`mt-1 text-xs ${theme.text} opacity-70`}>{state.m}</p>}
          {state.s && <p className={`mt-1 text-xs font-semibold ${theme.accent}`}>— {state.s}</p>}
        </div>
      </div>
    </div>
  );
}
