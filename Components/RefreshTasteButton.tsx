// components/RefreshTasteButton.tsx
"use client";

import { useState } from "react";

export function RefreshTasteButton() {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">(
    "idle"
  );

  async function handleClick() {
    setStatus("loading");
    const res = await fetch("/api/refresh-taste", { method: "POST" });

    if (res.ok) {
      setStatus("done");
      setTimeout(() => setStatus("idle"), 1500);
    } else {
      setStatus("error");
    }
  }

  return (
    <div style={{ marginTop: "1rem" }}>
      <button
        onClick={handleClick}
        disabled={status === "loading"}
        style={{ padding: "0.5rem 1rem" }}
      >
        {status === "loading" ? "Refreshing..." : "Refresh taste profile"}
      </button>
      {status === "done" && <p>Updated ✅</p>}
      {status === "error" && <p style={{ color: "red" }}>Error updating</p>}
    </div>
  );
}
