"use client";

import type { CSSProperties, HTMLAttributes, ReactNode } from "react";

type PlanHintProps = {
  id: string;
  anchorName: string;
  children: string;
};

/** Interest-triggered hint; uses explicit anchors for positioning. */
export function PlanHint({ id, anchorName, children }: PlanHintProps) {
  return (
    <div
      id={id}
      {...({ popover: "hint" } as unknown as HTMLAttributes<HTMLDivElement>)}
      className="plan-hint"
      style={{ positionAnchor: anchorName } as CSSProperties}
    >
      {children}
    </div>
  );
}

type PlanIconButtonProps = {
  label: string;
  hint?: string;
  hintId?: string;
  anchorName?: string;
  pressed?: boolean;
  onClick?: () => void;
  className?: string;
  children: ReactNode;
};

export function PlanIconButton({
  label,
  hint,
  hintId,
  anchorName,
  pressed,
  onClick,
  className = "",
  children,
}: PlanIconButtonProps) {
  const interestProps =
    hintId && hint
      ? ({
          interestfor: hintId,
          style: anchorName ? ({ anchorName } as CSSProperties) : undefined,
        } as HTMLAttributes<HTMLButtonElement> & { interestfor: string })
      : {};

  return (
    <>
      <button
        type="button"
        aria-label={label}
        title={hint ?? label}
        aria-pressed={typeof pressed === "boolean" ? pressed : undefined}
        onClick={onClick}
        className={className}
        {...interestProps}
      >
        {children}
      </button>
      {hintId && hint && anchorName ? (
        <PlanHint id={hintId} anchorName={anchorName}>
          {hint}
        </PlanHint>
      ) : null}
    </>
  );
}
