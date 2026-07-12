"use client";

import {
  forwardRef,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
} from "react";

type PlanHintProps = {
  id: string;
  anchorName: string;
  align?: "start" | "end";
  children: string;
};

/** Interest-triggered hint; anchor-positioned with inline fallbacks so edge buttons stay on screen. */
export const PlanHint = forwardRef<HTMLDivElement, PlanHintProps>(function PlanHint(
  { id, anchorName, align = "start", children },
  ref,
) {
  return (
    <div
      ref={ref}
      id={id}
      {...({ popover: "hint" } as unknown as HTMLAttributes<HTMLDivElement>)}
      className={`plan-hint ${align === "end" ? "plan-hint--align-end" : ""}`}
      style={{ positionAnchor: anchorName } as CSSProperties}
    >
      {children}
    </div>
  );
});

type PlanIconButtonProps = {
  label: string;
  hint?: string;
  hintId?: string;
  anchorName?: string;
  hintAlign?: "start" | "end";
  pressed?: boolean;
  onClick?: () => void;
  className?: string;
  children: ReactNode;
};

function useHoverHintsEnabled(): boolean {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const sync = () => setEnabled(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return enabled;
}

function useInterestForSupported(): boolean {
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    setSupported("interestForElement" in HTMLButtonElement.prototype);
  }, []);

  return supported;
}

export function PlanIconButton({
  label,
  hint,
  hintId,
  anchorName,
  hintAlign = "start",
  pressed,
  onClick,
  className = "",
  children,
}: PlanIconButtonProps) {
  const hintsEnabled = useHoverHintsEnabled();
  const interestSupported = useInterestForSupported();
  const hintRef = useRef<HTMLDivElement>(null);
  const hintText = hint ?? label;
  const showHint = hintsEnabled && hintId && anchorName && hintText;

  const interestProps =
    showHint && interestSupported
      ? ({
          interestfor: hintId,
          style: { anchorName } as CSSProperties,
        } as HTMLAttributes<HTMLButtonElement> & { interestfor: string })
      : showHint
        ? ({ style: { anchorName } as CSSProperties } as HTMLAttributes<HTMLButtonElement>)
        : {};

  const toggleHint = (open: boolean) => {
    const el = hintRef.current;
    if (!el) return;
    if (open) el.showPopover();
    else el.hidePopover();
  };

  const manualHintHandlers =
    showHint && !interestSupported
      ? {
          onMouseEnter: () => toggleHint(true),
          onMouseLeave: () => toggleHint(false),
          onFocus: () => toggleHint(true),
          onBlur: () => toggleHint(false),
        }
      : {};

  return (
    <span className="plan-icon-btn-wrap">
      <button
        type="button"
        aria-label={label}
        aria-pressed={typeof pressed === "boolean" ? pressed : undefined}
        onClick={onClick}
        className={className}
        {...interestProps}
        {...manualHintHandlers}
      >
        {children}
      </button>
      {showHint ? (
        <PlanHint ref={hintRef} id={hintId} anchorName={anchorName} align={hintAlign}>
          {hintText}
        </PlanHint>
      ) : null}
    </span>
  );
}
