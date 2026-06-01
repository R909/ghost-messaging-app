"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { GhostBackdrop } from "./home";

type PageDirection = "left" | "right";
type GhostMotion = "down" | "up";
type ShellPhase = "intro" | "idle" | "exit";

export function AuthShell({
  title,
  subtitle,
  backLink,
  backLabel,
  children,
  backdropSrc,
  pageDirection,
  ghostMotion,
}: {
  title: string;
  subtitle: string;
  backLink: string;
  backLabel: string;
  children: ReactNode;
  backdropSrc: string;
  pageDirection: PageDirection;
  ghostMotion: GhostMotion;
}) {
  const router = useRouter();
  const [phase, setPhase] = useState<ShellPhase>("intro");
  const [isSwitching, setIsSwitching] = useState(false);

  useEffect(() => {
    const introTimer = window.setTimeout(() => setPhase("idle"), 30);
    return () => window.clearTimeout(introTimer);
  }, []);

  function handleSwitch() {
    if (isSwitching) return;
    setIsSwitching(true);
    setPhase("exit");
    window.setTimeout(() => router.push(backLink), 760);
  }

  const panelSlideClass =
    phase === "intro"
      ? pageDirection === "left"
        ? "-translate-x-10 opacity-0"
        : "translate-x-10 opacity-0"
      : phase === "exit"
        ? pageDirection === "left"
          ? "-translate-x-24 opacity-0 rotate-[-6deg]"
          : "translate-x-24 opacity-0 rotate-[6deg]"
        : "translate-x-0 opacity-100 rotate-0";

  const ghostSlideClass =
    phase === "intro"
      ? "translate-y-[-18px] scale-90 opacity-0"
      : phase === "exit"
        ? ghostMotion === "down"
          ? "translate-y-[62vh] scale-75 opacity-0 blur-[2px]"
          : "-translate-y-[62vh] scale-75 opacity-0 blur-[2px]"
        : "translate-y-0 scale-100 opacity-100";

  return (
    <main className="min-h-screen overflow-hidden bg-[#050309] text-white">
      <div className="relative isolate min-h-screen overflow-hidden px-4 py-4 sm:px-6">
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_14%,rgba(168,85,247,0.2),transparent_24%),radial-gradient(circle_at_12%_30%,rgba(124,58,237,0.12),transparent_22%),radial-gradient(circle_at_88%_78%,rgba(192,132,252,0.08),transparent_26%)]" />
          <div className="absolute left-[-4rem] top-[-4rem] h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(196,181,253,0.18),transparent_68%)] blur-3xl animate-pulse-soft" />
          <div className="absolute right-[-5rem] bottom-[-6rem] h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(124,58,237,0.22),transparent_68%)] blur-3xl animate-drift" />
          <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(216,180,254,0.65),transparent)] opacity-60" />
        </div>

        <GhostBackdrop
          src={backdropSrc}
          alt="Ghost behind the authentication card"
          className="animate-float-slow"
          imageClassName="opacity-[0.08] scale-125 blur-[1px]"
        />

        <section className="relative z-10 flex min-h-screen items-center justify-center">
          <div className="relative w-full max-w-[430px]">
            <div className="absolute left-1/2 top-[-5.8rem] z-20 h-28 w-28 -translate-x-1/2 sm:h-32 sm:w-32">
              <div
                className={[
                  "relative h-full w-full transition duration-700 ease-[cubic-bezier(0.2,0.85,0.15,1)]",
                  ghostSlideClass,
                ].join(" ")}
              >
                <div className="absolute inset-0 rounded-[2rem] bg-[radial-gradient(circle_at_35%_30%,rgba(255,255,255,0.98),rgba(232,206,255,0.95)_46%,rgba(121,59,170,0.55)_100%)] shadow-[0_24px_60px_rgba(124,58,237,0.35)]" />
                <Image
                  src={backdropSrc}
                  alt="Ghost mascot"
                  fill
                  sizes="160px"
                  className="object-contain object-center drop-shadow-[0_24px_40px_rgba(0,0,0,0.45)]"
                  priority={false}
                />
              </div>
            </div>

            <div
              className={[
                "relative overflow-hidden rounded-[2rem] border border-white/12 bg-[linear-gradient(180deg,rgba(18,10,34,0.94),rgba(8,7,14,0.98))] px-5 pb-5 pt-14 shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_24px_80px_rgba(0,0,0,0.55)] backdrop-blur-2xl transition duration-700 ease-[cubic-bezier(0.2,0.85,0.15,1)] sm:px-6 sm:pb-6",
                panelSlideClass,
              ].join(" ")}
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.07),transparent_28%),linear-gradient(135deg,rgba(168,85,247,0.16),transparent_32%)]" />
              <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.8),transparent)] opacity-70" />
              <div className="absolute inset-x-6 top-4 h-px bg-[linear-gradient(90deg,transparent,rgba(192,132,252,0.45),transparent)] blur-[1px]" />

              <div className="relative">
                <div className="text-center">
                  <p className="text-sm font-medium text-white/80">{title}</p>
                  <h1 className="mt-2 text-[1.65rem] font-semibold tracking-tight text-white">
                    {subtitle}
                  </h1>
                </div>

                <div className="mt-5 rounded-[1.45rem] border border-white/10 bg-white/[0.03] px-4 py-4 shadow-[0_0_24px_rgba(168,85,247,0.08)]">
                  {children}
                </div>

                <div className="mt-4 text-center">
                  <button
                    type="button"
                    onClick={handleSwitch}
                    className="text-sm text-violet-200 transition hover:text-violet-100 disabled:opacity-60"
                    disabled={isSwitching}
                  >
                    {backLabel}
                  </button>
                </div>
              </div>

              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-[linear-gradient(180deg,transparent,rgba(168,85,247,0.08))]" />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
