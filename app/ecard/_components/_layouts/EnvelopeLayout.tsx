import type { LayoutProps } from "./types";
import { OrnamentSpan } from "./OrnamentSpan";

export function EnvelopeLayout({ template, theme, state, greeting }: LayoutProps) {
  return (
    <div className={`relative flex h-full w-full flex-col overflow-hidden ${theme.bg}`}>
      <div className={`absolute left-0 right-0 top-0 flex h-20 items-center justify-center`}>
        <span className="text-4xl">{state.e ?? "✨"}</span>
      </div>
      <div
        className={`h-0 w-full border-t-[80px] border-l-[50%] border-l-transparent border-r-[50%] border-r-transparent`}
        style={{ borderTopColor: "currentColor" }}
      >
        <div
          className={`absolute left-0 top-0 h-0 w-full border-t-[80px] border-l-[50%] border-l-transparent border-r-[50%] border-r-transparent bg-gradient-to-br ${theme.gradientFrom} ${theme.gradientTo}`}
        />
      </div>
      <div
        className={`flex flex-1 flex-col items-center justify-center gap-2 px-8 py-4 text-center ecard-anim-${template.primaryAnimation}`}
      >
        <p className={`text-xl font-bold leading-tight ${theme.text}`}>{greeting}</p>
        {state.r && <p className={`text-base font-medium ${theme.text} opacity-80`}>Dear {state.r},</p>}
        {state.m && <p className={`text-base ${theme.text} opacity-75`}>{state.m}</p>}
        {state.s && <p className={`mt-2 text-sm font-semibold ${theme.accent}`}>With love, {state.s}</p>}
      </div>
      {template.ornaments.map((o, i) => (
        <OrnamentSpan key={i} ornament={o} index={i} />
      ))}
    </div>
  );
}
