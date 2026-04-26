import type { LayoutProps } from "./types";

export function GarlandLayout({ template, theme, state }: LayoutProps) {
  const garlandEmoji = template.ornaments.map((o) => o.emoji);
  const repeated = Array.from(
    { length: Math.max(8, garlandEmoji.length * 2) },
    (_, i) => garlandEmoji[i % garlandEmoji.length],
  );

  return (
    <div className={`relative flex h-full w-full flex-col overflow-hidden ${theme.bg}`}>
      <div className={`flex justify-around bg-gradient-to-r px-2 py-2 ${theme.gradientFrom} ${theme.gradientTo}`}>
        {repeated.slice(0, 8).map((emoji, i) => (
          <span key={i} className="text-xl">
            {emoji}
          </span>
        ))}
      </div>
      <div
        className={`flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center ecard-anim-${template.primaryAnimation}`}
      >
        <span className="text-6xl">{state.e ?? "✨"}</span>
        {state.r && <p className={`text-2xl font-bold ${theme.text}`}>{state.r}</p>}
        {state.m && <p className={`max-w-xs text-base ${theme.text} opacity-80`}>{state.m}</p>}
        {state.s && <p className={`text-sm font-semibold ${theme.accent}`}>— {state.s}</p>}
      </div>
      <div className={`flex justify-around bg-gradient-to-r px-2 py-2 ${theme.gradientFrom} ${theme.gradientTo}`}>
        {repeated.slice(0, 8).map((emoji, i) => (
          <span key={i} className="text-xl">
            {emoji}
          </span>
        ))}
      </div>
    </div>
  );
}
