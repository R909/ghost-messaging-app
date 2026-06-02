"use client";

import Link from "next/link";
import { useState } from "react";
import { GhostAuthScene } from "../components/ghost-auth-scene";

export default function LoginPage() {
  const [focusedField, setFocusedField] = useState<string | null>(null);

  return (
    <GhostAuthScene
      title="Access Dashboard"
      subtitle="Re-establish your anonymous terminal session"
      backHref="/register"
      backLabel="Don't have an encrypted account? Register"
      ghostSrc="/ghost-1.png"
      slideDirection="left"
    >
      <form className="space-y-4 pt-2" onSubmit={(e) => e.preventDefault()}>
        <div className="space-y-2">
          <label
            htmlFor="login-email"
            className="text-[10px] font-semibold uppercase tracking-[0.25em] text-white/45"
          >
            Terminal Handle / Email
          </label>
          <div className={`relative rounded-xl border transition-all duration-300 ${focusedField === 'email' ? 'border-violet-400/50 bg-[#140f26] shadow-[0_0_20px_rgba(168,85,247,0.15)]' : 'border-white/10 bg-[#0e0a1a]'}`}>
            <span className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors duration-300 ${focusedField === 'email' ? 'text-violet-400' : 'text-white/30'}`}>
              <UserIcon />
            </span>
            <input
              id="login-email"
              type="text"
              placeholder="ghost_user"
              onFocus={() => setFocusedField('email')}
              onBlur={() => setFocusedField(null)}
              className="h-11 w-full bg-transparent pl-11 pr-4 text-sm text-white outline-none placeholder:text-white/20"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="login-password"
            className="text-[10px] font-semibold uppercase tracking-[0.25em] text-white/45"
          >
            Secret Access Token
          </label>
          <div className={`relative rounded-xl border transition-all duration-300 ${focusedField === 'password' ? 'border-violet-400/50 bg-[#140f26] shadow-[0_0_20px_rgba(168,85,247,0.15)]' : 'border-white/10 bg-[#0e0a1a]'}`}>
            <span className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors duration-300 ${focusedField === 'password' ? 'text-violet-400' : 'text-white/30'}`}>
              <LockIcon />
            </span>
            <input
              id="login-password"
              type="password"
              placeholder="••••••••••••"
              onFocus={() => setFocusedField('password')}
              onBlur={() => setFocusedField(null)}
              className="h-11 w-full bg-transparent pl-11 pr-11 text-sm text-white outline-none placeholder:text-white/20"
            />
            <button type="button" className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
              <EyeOffIcon />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 pt-1 text-xs text-white/50">
          <label className="flex items-center gap-2 cursor-pointer select-none hover:text-white/80 transition-colors">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-white/20 bg-transparent text-violet-500 focus:ring-offset-0 focus:ring-violet-400/50"
            />
            Keep Session Alive
          </label>
          <Link href="/login" className="text-white/45 transition hover:text-violet-300">
            Recover Passphrase
          </Link>
        </div>

        <Link
          href="/chats"
          className="mt-2 flex h-11 w-full items-center justify-center rounded-xl bg-gradient-to-r from-[#7b3df0] via-[#8d43ff] to-[#c65dff] text-sm font-medium text-white shadow-[0_12px_30px_rgba(136,68,255,0.35)] transition-all duration-300 hover:brightness-110 hover:shadow-[0_15px_35px_rgba(136,68,255,0.5)] active:scale-[0.98]"
        >
          Initialize Session
        </Link>
      </form>
    </GhostAuthScene>
  );
}

// Icon Definitions unchanged below for production safety...
function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 12a3.9 3.9 0 1 0 0-7.8 3.9 3.9 0 0 0 0 7.8Z" />
      <path d="M4.5 20c1.4-3 3.8-4.4 7.5-4.4s6.1 1.4 7.5 4.4" strokeLinecap="round" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="5.5" y="10.5" width="13" height="8.5" rx="2" />
      <path d="M8 10.5V8.6a4 4 0 0 1 8 0v1.9" strokeLinecap="round" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M3.5 12s2.9-5 8.5-5 8.5 5 8.5 5-2.9 5-8.5 5-8.5-5-8.5-5Z" />
      <path d="M9.5 12a2.5 2.5 0 1 0 5 0 2.5 2.5 0 0 0-5 0Z" />
      <path d="M4 4l16 16" strokeLinecap="round" />
    </svg>
  );
}