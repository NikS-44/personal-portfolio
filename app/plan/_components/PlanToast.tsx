"use client";

import { useEffect } from "react";
import type { PlanToastData } from "../_lib/usePlanBoard";

const TOAST_DISMISS_MS = 6000;

type PlanToastProps = {
  toast: PlanToastData | null;
  onUndo: () => void;
  onDismiss: () => void;
};

export default function PlanToast({ toast, onUndo, onDismiss }: PlanToastProps) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(onDismiss, TOAST_DISMISS_MS);
    return () => clearTimeout(timer);
  }, [toast, onDismiss]);

  if (!toast) return null;

  return (
    <div className="plan-toast" role="status">
      <p className="plan-toast__message">{toast.message}</p>
      {toast.undoable ? (
        <button type="button" className="plan-toast__undo" onClick={onUndo}>
          Undo
        </button>
      ) : null}
      <button type="button" className="plan-toast__close" aria-label="Dismiss" onClick={onDismiss}>
        ×
      </button>
    </div>
  );
}
