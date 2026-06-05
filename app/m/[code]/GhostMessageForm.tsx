"use client";

import { useState } from "react";

interface Props {
  code: string;
}

export default function GhostMessageForm({ code }: Props) {
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setSending(true);
    setError("");

    try {
      const res = await fetch("/api/send-ghost-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, message: message.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message ?? "Something went wrong");
      } else {
        setSent(true);
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSending(false);
    }
  };

  if (sent) {
    return (
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-400/10 ring-1 ring-emerald-400/30">
          <svg className="h-8 w-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <div>
          <p className="text-lg font-semibold text-white">Message delivered</p>
          <p className="mt-1 text-sm text-white/50">Your anonymous message was sent successfully.</p>
        </div>
        <button
          onClick={() => { setSent(false); setMessage(""); }}
          className="mt-2 rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm text-white/80 transition hover:bg-white/10 active:scale-95"
        >
          Send another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Write your anonymous message…"
        maxLength={1000}
        rows={5}
        className="w-full resize-none rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none transition focus:border-violet-400/40 focus:bg-white/[0.06]"
      />
      <div className="flex items-center justify-between">
        <span className="text-xs text-white/30">{message.length}/1000</span>
        {error && <p className="text-xs text-rose-400">{error}</p>}
      </div>
      <button
        type="submit"
        disabled={sending || message.trim().length === 0}
        className="w-full rounded-xl bg-gradient-to-r from-[#c084fc] via-[#8b5cf6] to-[#6d28d9] py-3.5 font-medium text-white shadow-[0_15px_30px_rgba(124,58,237,0.3)] transition-all hover:brightness-110 hover:shadow-[0_20px_40px_rgba(124,58,237,0.45)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {sending ? "Sending…" : "Send Anonymously"}
      </button>
    </form>
  );
}
