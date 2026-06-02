"use client";

import { useState } from "react";
import { GhostAuthScene } from "../components/ghost-auth-scene";

export default function RegisterPage() {
  const [focusedField, setFocusedField] = useState<string | null>(null);

  return (
    <GhostAuthScene
      title="Create Account"
      subtitle="Join the anonymous world"
      backHref="/login"
      backLabel="Already have an account? Login"
      ghostSrc="/ghost-2.png"
      slideDirection="right"
    >
      <form className="space-y-4 pt-2" onSubmit={(e) => e.preventDefault()}>
        {/* Full Name Input */}
        <div className="space-y-2">
          <label
            htmlFor="register-name"
            className="text-[10px] font-semibold uppercase tracking-[0.25em] text-white/45"
          >
            Full Name
          </label>
          <div className={`relative rounded-xl border transition-all duration-300 ${focusedField === 'name' ? 'border-violet-400/50 bg-[#140f26] shadow-[0_0_20px_rgba(168,85,247,0.15)]' : 'border-white/10 bg-[#0e0a1a]'}`}>
            <span className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors duration-300 ${focusedField === 'name' ? 'text-violet-400' : 'text-white/30'}`}>
              <UserIcon />
            </span>
            <input
              id="register-name"
              type="text"
              placeholder="Your Alias"
              onFocus={() => setFocusedField('name')}
              onBlur={() => setFocusedField(null)}
              className="h-11 w-full bg-transparent pl-11 pr-4 text-sm text-white outline-none placeholder:text-white/20"
            />
          </div>
        </div>

        {/* Email Input */}
        <div className="space-y-2">
          <label
            htmlFor="register-email"
            className="text-[10px] font-semibold uppercase tracking-[0.25em] text-white/45"
          >
            Email Address
          </label>
          <div className={`relative rounded-xl border transition-all duration-300 ${focusedField === 'email' ? 'border-violet-400/50 bg-[#140f26] shadow-[0_0_20px_rgba(168,85,247,0.15)]' : 'border-white/10 bg-[#0e0a1a]'}`}>
            <span className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors duration-300 ${focusedField === 'email' ? 'text-violet-400' : 'text-white/30'}`}>
              <MailIcon />
            </span>
            <input
              id="register-email"
              type="email"
              placeholder="ghost@network.com"
              onFocus={() => setFocusedField('email')}
              onBlur={() => setFocusedField(null)}
              className="h-11 w-full bg-transparent pl-11 pr-4 text-sm text-white outline-none placeholder:text-white/20"
            />
          </div>
        </div>

        {/* Password Input */}
        <div className="space-y-2">
          <label
            htmlFor="register-password"
            className="text-[10px] font-semibold uppercase tracking-[0.25em] text-white/45"
          >
            Password
          </label>
          <div className={`relative rounded-xl border transition-all duration-300 ${focusedField === 'password' ? 'border-violet-400/50 bg-[#140f26] shadow-[0_0_20px_rgba(168,85,247,0.15)]' : 'border-white/10 bg-[#0e0a1a]'}`}>
            <span className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors duration-300 ${focusedField === 'password' ? 'text-violet-400' : 'text-white/30'}`}>
              <LockIcon />
            </span>
            <input
              id="register-password"
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

        {/* Confirm Password Input */}
        <div className="space-y-2">
          <label
            htmlFor="register-confirm"
            className="text-[10px] font-semibold uppercase tracking-[0.25em] text-white/45"
          >
            Confirm Password
          </label>
          <div className={`relative rounded-xl border transition-all duration-300 ${focusedField === 'confirm' ? 'border-violet-400/50 bg-[#140f26] shadow-[0_0_20px_rgba(168,85,247,0.15)]' : 'border-white/10 bg-[#0e0a1a]'}`}>
            <span className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors duration-300 ${focusedField === 'confirm' ? 'text-violet-400' : 'text-white/30'}`}>
              <LockIcon />
            </span>
            <input
              id="register-confirm"
              type="password"
              placeholder="••••••••••••"
              onFocus={() => setFocusedField('confirm')}
              onBlur={() => setFocusedField(null)}
              className="h-11 w-full bg-transparent pl-11 pr-11 text-sm text-white outline-none placeholder:text-white/20"
            />
            <button type="button" className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
              <EyeOffIcon />
            </button>
          </div>
        </div>

        {/* Terms checkbox */}
        <label className="flex items-start gap-2.5 pt-1 text-xs text-white/55 cursor-pointer select-none hover:text-white/80 transition-colors">
          <input
            type="checkbox"
            className="mt-0.5 h-4 w-4 rounded border-white/20 bg-transparent text-violet-500 focus:ring-offset-0 focus:ring-violet-400/50"
          />
          <span className="leading-tight">I agree to the Terms & Conditions</span>
        </label>

        {/* Submission CTA */}
        <button
          type="button"
          className="mt-2 flex h-11 w-full items-center justify-center rounded-xl bg-gradient-to-r from-[#7b3df0] via-[#8d43ff] to-[#c65dff] text-sm font-medium text-white shadow-[0_12px_30px_rgba(136,68,255,0.35)] transition-all duration-300 hover:brightness-110 hover:shadow-[0_15px_35px_rgba(136,68,255,0.5)] active:scale-[0.98]"
        >
          Create Account
        </button>
      </form>
    </GhostAuthScene>
  );
}

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 12a3.9 3.9 0 1 0 0-7.8 3.9 3.9 0 0 0 0 7.8Z" />
      <path d="M4.5 20c1.4-3 3.8-4.4 7.5-4.4s6.1 1.4 7.5 4.4" strokeLinecap="round" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="4.5" y="6.5" width="15" height="11" rx="2" />
      <path d="M5.5 8l6.5 5 6.5-5" strokeLinecap="round" strokeLinejoin="round" />
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