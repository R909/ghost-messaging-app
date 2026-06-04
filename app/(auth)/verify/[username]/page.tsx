"use client";

import { useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { GhostAuthScene } from "../../../components/ghost-auth-scene";

export default function VerifyPage() {
  const params = useParams<{ username: string }>();
  const username = params?.username ?? "";
  const router = useRouter();

  const [digits, setDigits] = useState<string[]>(Array(6).fill(""));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const next = [...digits];
    next[index] = value.slice(-1);
    setDigits(next);
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    e.preventDefault();
    const next = Array(6).fill("");
    pasted.split("").forEach((ch, i) => { next[i] = ch; });
    setDigits(next);
    inputRefs.current[Math.min(pasted.length, 5)]?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = digits.join("");
    if (code.length < 6) {
      setError("Please enter the full 6-digit code.");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, code }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        setError(json.message || "Verification failed. Please try again.");
        return;
      }
      setSuccess(true);
      setTimeout(() => router.push("/sign-in"), 2000);
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <GhostAuthScene
      title="Verify Identity"
      subtitle="Enter the 6-digit code sent to your email"
      backHref="/sign-up"
      backLabel="Back to registration"
      ghostSrc="/ghost-1.png"
      slideDirection="left"
    >
      <form className="space-y-6 pt-2" onSubmit={handleSubmit}>
        {error && (
          <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-xs text-red-300">
            {error}
          </div>
        )}

        {success ? (
          <div className="rounded-lg border border-green-500/20 bg-green-500/10 px-4 py-3 text-center text-sm text-green-300">
            Account verified! Redirecting to sign in...
          </div>
        ) : (
          <>
            <div className="space-y-3">
              <label className="block text-[10px] font-semibold uppercase tracking-[0.25em] text-white/45">
                Verification Code
              </label>
              <div className="flex justify-between gap-2" onPaste={handlePaste}>
                {digits.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => { inputRefs.current[i] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(i, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(i, e)}
                    className="h-12 w-12 rounded-xl border border-white/10 bg-[#0e0a1a] text-center text-lg font-semibold text-white outline-none transition-all duration-300 focus:border-violet-400/50 focus:bg-[#140f26] focus:shadow-[0_0_20px_rgba(168,85,247,0.15)] caret-transparent"
                  />
                ))}
              </div>
              <p className="text-[11px] text-white/35">
                Check your inbox for{" "}
                <span className="text-violet-300/70">{username}</span>&apos;s verification code.
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading || digits.join("").length < 6}
              className="flex h-11 w-full items-center justify-center rounded-xl bg-gradient-to-r from-[#7b3df0] via-[#8d43ff] to-[#c65dff] text-sm font-medium text-white shadow-[0_12px_30px_rgba(136,68,255,0.35)] transition-all duration-300 hover:brightness-110 hover:shadow-[0_15px_35px_rgba(136,68,255,0.5)] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Verifying..." : "Confirm Identity"}
            </button>
          </>
        )}
      </form>
    </GhostAuthScene>
  );
}
