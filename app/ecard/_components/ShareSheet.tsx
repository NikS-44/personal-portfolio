"use client";

import { useState } from "react";
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
  const [whatsappStatus, setWhatsappStatus] = useState<"idle" | "opening">("idle");
  const [smsStatus, setSmsStatus] = useState<"idle" | "opening">("idle");

  function getCardUrl() {
    const encoded = encodeCardState(state);
    return `${window.location.origin}/ecard/view?d=${encoded}`;
  }

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
    const url = getCardUrl();
    setCopying(true);
    try {
      if (navigator.share) {
        await navigator.share({ title: "My eCard", url });
        onSuccess();
      } else {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => {
          setCopied(false);
          onSuccess();
        }, 2000);
      }
    } catch {
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => {
          setCopied(false);
          onSuccess();
        }, 2000);
      } catch {
        // ignore
      }
    } finally {
      setCopying(false);
    }
  }

  function handleWhatsApp() {
    const url = getCardUrl();
    const text = encodeURIComponent(`I made you an eCard! Open it here: ${url}`);
    setWhatsappStatus("opening");
    setTimeout(() => {
      setWhatsappStatus("idle");
      onSuccess();
    }, 2500);
    if (navigator.share) {
      navigator.share({ title: "My eCard", url }).catch(() => {
        window.open(`https://wa.me/?text=${text}`, "_blank", "noopener,noreferrer");
      });
    } else {
      window.open(`https://wa.me/?text=${text}`, "_blank", "noopener,noreferrer");
    }
  }

  function handleSMS() {
    const url = getCardUrl();
    const body = encodeURIComponent(`I made you an eCard! Open it here: ${url}`);
    setSmsStatus("opening");
    setTimeout(() => {
      setSmsStatus("idle");
      onSuccess();
    }, 2500);
    window.open(`sms:?body=${body}`, "_self");
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Primary sharing actions */}
      <div className="flex flex-col gap-3">
        {/* WhatsApp */}
        <button
          type="button"
          onClick={handleWhatsApp}
          disabled={whatsappStatus === "opening"}
          className="flex h-14 items-center justify-center gap-3 rounded-xl bg-[#25D366] px-6 text-lg font-semibold text-white transition hover:bg-[#1ebe5d] disabled:opacity-70"
        >
          <span className="text-2xl">💬</span>
          {whatsappStatus === "opening" ? "Opening WhatsApp…" : "Share via WhatsApp"}
        </button>

        {/* Copy / native share */}
        <button
          type="button"
          onClick={handleCopyLink}
          disabled={copying}
          className="flex h-14 items-center justify-center gap-3 rounded-xl bg-rose-500 px-6 text-lg font-semibold text-white transition hover:bg-rose-600 disabled:opacity-60"
        >
          {copied ? "✅ Link copied!" : copying ? "Sharing…" : "🔗 Copy share link"}
        </button>

        {/* SMS */}
        <button
          type="button"
          onClick={handleSMS}
          disabled={smsStatus === "opening"}
          className="flex h-14 items-center justify-center gap-3 rounded-xl border-2 border-sky-300 bg-white px-6 text-lg font-semibold text-sky-700 transition hover:bg-sky-50 disabled:opacity-70"
        >
          <span className="text-2xl">✉️</span>
          {smsStatus === "opening" ? "Opening Messages…" : "Send via Text Message"}
        </button>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-gray-200" />
        <span className="text-sm text-gray-400">or save</span>
        <div className="h-px flex-1 bg-gray-200" />
      </div>

      {/* Download */}
      <button
        type="button"
        onClick={handleDownload}
        disabled={exporting}
        className="flex h-14 items-center justify-center gap-3 rounded-xl border-2 border-gray-200 bg-white px-6 text-lg font-semibold text-gray-600 transition hover:border-gray-300 hover:bg-gray-50 disabled:opacity-60"
      >
        {exporting ? "Preparing image…" : "⬇️ Download as image"}
      </button>

      <p aria-live="polite" className="sr-only">
        {copied ? "Share link copied to clipboard" : ""}
        {whatsappStatus === "opening" ? "Opening WhatsApp" : ""}
        {smsStatus === "opening" ? "Opening text messages" : ""}
      </p>
    </div>
  );
}
