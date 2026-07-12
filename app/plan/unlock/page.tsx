"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PlanUnlockPage() {
  const [key, setKey] = useState("");
  const [status, setStatus] = useState<"idle" | "checking" | "wrong">("idle");
  const router = useRouter();

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!key.trim() || status === "checking") return;
    setStatus("checking");
    const res = await fetch("/api/plan-unlock", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ key }),
    }).catch(() => null);

    if (res?.ok) {
      router.replace("/plan");
      return;
    }
    setStatus("wrong");
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
        <button type="submit" disabled={status === "checking"} className="plan-unlock__submit">
          {status === "checking" ? "Checking…" : "Open board"}
        </button>
      </form>
    </main>
  );
}
