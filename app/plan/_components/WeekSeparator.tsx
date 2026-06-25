type WeekSeparatorProps = {
  label: string;
};

export default function WeekSeparator({ label }: WeekSeparatorProps) {
  return (
    <div
      className="flex w-8 shrink-0 flex-col items-center justify-center self-stretch py-4"
      role="separator"
      aria-label={`Next week: ${label}`}
    >
      <div className="h-full w-px bg-[var(--plan-border)]" />
      <div className="my-4 flex shrink-0 flex-col items-center gap-2 px-1">
        <span className="rounded-full bg-[var(--plan-surface)] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--plan-muted)] shadow-sm ring-1 ring-[var(--plan-border)]">
          Next
        </span>
        <span className="max-w-[3rem] text-center text-[10px] leading-snug text-[var(--plan-muted)]">{label}</span>
      </div>
      <div className="h-full w-px bg-[var(--plan-border)]" />
    </div>
  );
}
