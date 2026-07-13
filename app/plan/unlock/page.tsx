"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { setLocalOnlyMode } from "../_lib/localMode";

export default function PlanUnlockPage() {
  const [key, setKey] = useState("");
  const [status, setStatus] = useState<"idle" | "checking" | "wrong" | "local">("idle");
  const router = useRouter();

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!key.trim() || status === "checking" || status === "local") return;
    setStatus("checking");
    const res = await fetch("/api/plan-unlock", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ key: key.trim() }),
    }).catch(() => null);

    if (res?.ok) {
      setLocalOnlyMode(false);
      await fetch("/api/plan-local", { method: "DELETE" }).catch(() => null);
      router.replace("/plan");
      return;
    }
    setStatus("wrong");
  };

  const openLocalMode = async () => {
    if (status === "checking" || status === "local") return;
    setStatus("local");
    const res = await fetch("/api/plan-local", { method: "POST" }).catch(() => null);
    if (!res?.ok) {
      setStatus("idle");
      return;
    }
    setLocalOnlyMode(true);
    router.replace("/plan");
  };

  return (
    <main className="flex min-h-dvh items-center justify-center p-6">
      <form onSubmit={submit} className="plan-unlock">
        <h1 className="plan-unlock__title">Weekly plan</h1>
        <p className="plan-unlock__copy">This board is private. Enter the key to open it on this device.</p>
        <input
          type="password"
          value={key}
          onChange={(e) => {
            setKey(e.target.value);
            if (status === "wrong") setStatus("idle");
          }}
          placeholder="Key"
          aria-label="Planner key"
          autoFocus
          className="plan-unlock__input"
        />
        {status === "wrong" ? <p className="plan-unlock__error">That key didn’t match. Try again.</p> : null}
        <button type="submit" disabled={status === "checking" || status === "local"} className="plan-unlock__submit">
          {status === "checking" ? "Checking…" : "Open board"}
        </button>
        <div className="plan-unlock__divider" role="separator">
          <span>or</span>
        </div>
        <button
          type="button"
          disabled={status === "checking" || status === "local"}
          onClick={() => void openLocalMode()}
          className="plan-unlock__local"
        >
          {status === "local" ? "Opening…" : "Use locally without login"}
        </button>
        <p className="plan-unlock__hint">Local mode keeps tasks in this browser only — no sync.</p>
      </form>
    </main>
  );
}
