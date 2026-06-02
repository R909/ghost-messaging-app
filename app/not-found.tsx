"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function NotFound() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <main className="min-h-screen overflow-hidden bg-[#030106] text-white flex items-center justify-center">
      <div className="relative isolate min-h-screen w-full flex items-center justify-center px-4 py-4 sm:px-6">

        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden select-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(168,85,247,0.15),transparent_40%),radial-gradient(circle_at_20%_30%,rgba(124,58,237,0.08),transparent_25%)]" />
          <div className="absolute left-[-10rem] top-[10rem] h-[35rem] w-[35rem] rounded-full bg-purple-600/[0.05] blur-[120px] animate-pulse [animation-duration:10s]" />
          <div className="absolute right-[-8rem] bottom-[5rem] h-[40rem] w-[40rem] rounded-full bg-violet-500/[0.07] blur-[140px] animate-pulse [animation-duration:8s]" />
          
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.008)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.008)_1px,transparent_1px)] bg-[size:60px_60px] opacity-60" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,#030106_85%)]" />
        </div>

        <section className="relative z-10 w-full max-w-[440px] p-2">
          <div className="absolute left-1/2 top-1/2 h-[20rem] w-[30rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/[0.1] blur-[100px] pointer-events-none" />

          <div
            className={`relative overflow-hidden rounded-[2.5rem] border border-white/[0.08] bg-[linear-gradient(180deg,rgba(15,10,25,0.65),rgba(6,4,10,0.85))] px-6 pb-8 pt-14 text-center shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.1)] backdrop-blur-3xl transition-all duration-[800ms] cubic-bezier(0.16,1,0.3,1) sm:px-10 ${
              mounted ? "translate-y-0 opacity-100 scale-100 blur-none" : "translate-y-8 opacity-0 scale-[0.96] blur-sm"
            }`}
          >
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            <div className="absolute inset-x-0 top-px h-12 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />

            <div className="relative mb-6 inline-block">
              <span className="absolute inset-0 bg-gradient-to-br from-violet-400 to-fuchsia-500 blur-2xl opacity-30 select-none pointer-events-none animate-pulse">404</span>
              <h1 className="relative text-7xl font-extrabold tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white via-white/90 to-white/40 drop-shadow-[0_2px_10px_rgba(168,85,247,0.15)]">
                404
              </h1>
            </div>

            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl border border-white/[0.08] bg-gradient-to-br from-white/5 to-white/[0.01] shadow-xl backdrop-blur-md transition-transform duration-500 hover:scale-110">
              <div className="relative grid place-items-center h-12 w-12 rounded-full">
                <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_40%_35%,rgba(255,255,255,0.98),rgba(235,215,255,0.95)_52%,rgba(139,92,246,0.3)_100%)] shadow-inner animate-bounce [animation-duration:3.5s]" />
                <span className="absolute left-[26%] top-[14px] h-2 w-2 rounded-full bg-[#2a0845]" />
                <span className="absolute right-[26%] top-[14px] h-2 w-2 rounded-full bg-[#2a0845]" />
                <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 h-2.5 w-6 rounded-b-full bg-[linear-gradient(180deg,rgba(255,255,255,1),rgba(216,180,254,1))]" />
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-semibold tracking-tight text-white/90">
                Ghosted by Reality
              </h2>
              <p className="text-sm text-white/40 max-w-[280px] mx-auto leading-relaxed">
                The link you followed has vaporized into the ether, or this page was never configured to exist.
              </p>
            </div>

            <div className="relative mt-8 overflow-hidden rounded-2xl border border-white/[0.06] bg-black/40 p-4 shadow-[inset_0_1px_1px_rgba(0,0,0,0.3)] backdrop-blur-md">
              <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(168,85,247,0.06),transparent_30%)]" />
              
              <Link
                href="/dashboard"
                className="group relative flex w-full h-11 items-center justify-center rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-sm font-semibold tracking-wide text-white shadow-[0_12px_24px_-10px_rgba(168,85,247,0.5),inset_0_1px_0_rgba(255,255,255,0.2)] border border-violet-500/30 transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] hover:scale-[1.02] hover:opacity-95 active:scale-[0.98]"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <HomeIcon />
                  Return to Matrix
                </span>
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-40" />
              </Link>
            </div>

            <div className="mt-6 flex items-center justify-center gap-1.5 text-[10px] uppercase font-bold tracking-widest text-white/20 select-none">
              <LockIcon />
              Secured Session Context
            </div>

          </div>
        </section>

      </div>
    </main>
  );
}

function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="5.5" y="11" width="13" height="8.5" rx="2" />
      <path d="M8 11V8.8a4 4 0 0 1 8 0V11" strokeLinecap="round" />
    </svg>
  );
}