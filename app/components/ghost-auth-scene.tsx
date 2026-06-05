"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { GhostBackdrop } from "./home";

type SlideDirection = "left" | "right";
type Phase = "intro" | "idle" | "exit";



export function GhostAuthScene({
  title,
  subtitle,
  backHref,
  backLabel,
  ghostSrc,
  slideDirection,
  children,
}: {
  title: string;
  subtitle: string;
  backHref: string;
  backLabel?: string;
  ghostSrc: string;
  slideDirection: SlideDirection;
  children: ReactNode;
}) {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("intro");
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setPhase("idle"), 30);
    return () => window.clearTimeout(timer);
  }, []);

  function handleSwitch() {
    if (isLeaving) return;

    setIsLeaving(true);
    setPhase("exit");

    window.setTimeout(() => {
      router.push(backHref);
    }, 720);
  }

  const slideClass =
    phase === "intro"
      ? slideDirection === "left"
        ? "-translate-x-8 opacity-0"
        : "translate-x-8 opacity-0"
      : phase === "exit"
        ? slideDirection === "left"
          ? "-translate-x-20 opacity-0 rotate-[-8deg]"
          : "translate-x-20 opacity-0 rotate-[8deg]"
        : "translate-x-0 opacity-100 rotate-0";

  return (
    <main className="min-h-screen overflow-hidden bg-[#050309] text-white">
      <div className="relative isolate min-h-screen overflow-hidden px-4 py-4 sm:px-6">
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_12%,rgba(168,85,247,0.2),transparent_28%),radial-gradient(circle_at_16%_24%,rgba(124,58,237,0.12),transparent_20%),radial-gradient(circle_at_86%_76%,rgba(192,132,252,0.08),transparent_24%)]" />
          <div className="absolute left-[-6rem] top-[9rem] h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(circle,rgba(196,181,253,0.2),transparent_68%)] blur-3xl animate-cloud-drift" />
          <div className="absolute right-[-7rem] bottom-[-7rem] h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(circle,rgba(124,58,237,0.22),transparent_68%)] blur-3xl animate-drift" />
          <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(216,180,254,0.6),transparent)] opacity-60" />
        </div>

        <GhostBackdrop
          src={ghostSrc}
          alt="Ghost floating behind auth card"
          className="animate-float-slow"
          imageClassName="h-full w-full object-cover object-center opacity-[0.08] blur-[1px]"
        />

        <section className="relative z-10 flex min-h-screen items-center justify-center">
          <div className="relative w-full max-w-[420px]">
            <div className="absolute left-1/2 top-[2.1rem] h-[18rem] w-[34rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_50%_35%,rgba(168,85,247,0.45),transparent_34%),radial-gradient(circle_at_50%_70%,rgba(124,58,237,0.22),transparent_52%),radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_60%)] blur-3xl animate-wave-pulse" />

            <div
              className={[
                "relative overflow-hidden rounded-[2.1rem] border border-white/12 bg-[linear-gradient(180deg,rgba(18,10,34,0.95),rgba(8,7,14,0.98))] px-5 pb-5 pt-14 shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_24px_80px_rgba(0,0,0,0.58)] backdrop-blur-2xl transition duration-700 ease-[cubic-bezier(0.2,0.85,0.15,1)] sm:px-6",
                slideClass,
              ].join(" ")}
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.08),transparent_24%),linear-gradient(135deg,rgba(168,85,247,0.16),transparent_30%)]" />
              <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.75),transparent)] opacity-70" />
              <div className="absolute inset-x-4 top-4 h-px bg-[linear-gradient(90deg,transparent,rgba(192,132,252,0.42),transparent)] blur-[1px]" />

              <div className="pointer-events-none absolute inset-x-0 top-10 h-[10rem] overflow-hidden">
                <svg viewBox="0 0 500 180" className="h-full w-full opacity-45">
                  <path
                    d="M0 90 C70 45, 120 45, 175 90 S285 135, 350 90 S430 45, 500 92"
                    fill="none"
                    stroke="rgba(196,181,253,0.58)"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M0 116 C80 70, 130 70, 185 116 S295 162, 360 116 S430 70, 500 116"
                    fill="none"
                    stroke="rgba(168,85,247,0.55)"
                    strokeWidth="1.4"
                  />
                </svg>
              </div>

              <div className="absolute inset-x-[-10%] top-[6.2rem] h-40 rounded-full bg-[radial-gradient(circle_at_50%_50%,rgba(168,85,247,0.45),transparent_38%),radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.14),transparent_58%)] blur-3xl animate-cloud-drift" />
              <div className="absolute right-[-2rem] top-[5rem] h-24 w-24 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.12),transparent_68%)] blur-2xl animate-pulse-soft" />
              <div className="absolute left-[-2.5rem] top-[7.5rem] h-28 w-28 rounded-full bg-[radial-gradient(circle,rgba(124,58,237,0.24),transparent_68%)] blur-3xl animate-cloud-drift" />

              <div className="relative pt-2">
                <div className="pl-1">
                  <h1 className="text-[1.45rem] font-semibold tracking-tight text-white">
                    {title}
                  </h1>
                  <p className="mt-1 text-sm text-white/60">{subtitle}</p>
                </div>

                <div className="relative mt-5 overflow-hidden rounded-[1.45rem] border border-white/10 bg-[linear-gradient(180deg,rgba(12,9,24,0.95),rgba(10,8,16,0.98))] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(168,85,247,0.2),transparent_24%),radial-gradient(circle_at_80%_18%,rgba(196,181,253,0.12),transparent_22%),radial-gradient(circle_at_50%_82%,rgba(124,58,237,0.1),transparent_22%)]"
                  />
                  <svg
                    aria-hidden
                    viewBox="0 0 480 180"
                    className="pointer-events-none absolute inset-x-[-6%] top-[-2.1rem] h-24 w-[112%] opacity-70"
                  >
                    <path
                      d="M0 115 C60 60, 120 60, 170 115 S280 170, 345 115 S420 60, 480 115"
                      fill="none"
                      stroke="rgba(198,93,255,0.58)"
                      strokeWidth="2"
                    />
                    <path
                      d="M0 132 C65 84, 120 84, 170 132 S280 180, 345 132 S415 84, 480 132"
                      fill="none"
                      stroke="rgba(255,255,255,0.18)"
                      strokeWidth="1.25"
                    />
                  </svg>
                  {children}
                </div>

                <div className="mt-4 pl-1 text-left">
                  <button
                    type="button"
                    onClick={handleSwitch}
                    disabled={isLeaving}
                    className="text-sm text-violet-200 transition hover:text-violet-100 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {backLabel}
                  </button>
                </div>
              </div>

              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-[linear-gradient(180deg,transparent,rgba(168,85,247,0.1))]" />
              <div className="pointer-events-none absolute inset-x-6 bottom-4 h-px bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.18),transparent)]" />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
