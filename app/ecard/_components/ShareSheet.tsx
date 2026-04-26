"use client";

import { useState, useRef } from "react";
import type { CardState } from "../_data/types";
import { encodeCardState } from "../_lib/encodeState";
import { exportCardAsJpeg } from "../_lib/exportJpeg";

interface ShareSheetProps {
  state: CardState;
  canvasRef: React.RefObject<HTMLDivElement>;
  onSuccess: () => void;
}

export function ShareSheet({ state, canvasRef, onSuccess }: ShareSheetProps) {
  const [copying, setCopying] = useState(false);
  const [copied, setCopied] = useState(false);
  const [exporting, setExporting] = useState(false);
  const statusRef = useRef<HTMLParagraphElement>(null);

  async function handleDownload() {
    if (!canvasRef.current) return;
    setExporting(true);
    try {
      await exportCardAsJpeg(canvasRef.current, `ecard-${state.t}-${Date.now()}.jpg`);
      onSuccess();
    } finally {
      setExporting(false);
    }
  }

  async function handleCopyLink() {
    const encoded = encodeCardState(state);
    const url = `${window.location.origin}/ecard/view?d=${encoded}`;
    setCopying(true);
    try {
      if (navigator.share) {
        await navigator.share({ title: "My eCard", url });
      } else {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      }
    } catch {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } finally {
      setCopying(false);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <button
        type="button"
        onClick={handleDownload}
        disabled={exporting}
        className="flex h-14 items-center justify-center gap-2 rounded-xl bg-rose-500 px-6 text-lg font-semibold text-white transition hover:bg-rose-600 disabled:opacity-60"
      >
        {exporting ? "Preparing image…" : "⬇️ Download as image"}
      </button>
      <button
        type="button"
        onClick={handleCopyLink}
        disabled={copying}
        className="flex h-14 items-center justify-center gap-2 rounded-xl border-2 border-rose-300 bg-white px-6 text-lg font-semibold text-rose-600 transition hover:bg-rose-50 disabled:opacity-60"
      >
        {copied ? "✅ Link copied!" : copying ? "Copying…" : "🔗 Copy share link"}
      </button>
      <p ref={statusRef} aria-live="polite" className="sr-only">
        {copied ? "Share link copied to clipboard" : ""}
      </p>
    </div>
  );
}
