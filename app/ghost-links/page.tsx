"use client";

import { useState } from "react";
import { GhostBackdrop, GhostAvatar, HomePage } from "../components/home";

const links = [
  { code: "ghst://violet-13", status: "Active", expiry: "Expires in 4h" },
  { code: "ghst://moon-88", status: "Hidden", expiry: "Expires in 1 day" },
  { code: "ghst://night-07", status: "Shared", expiry: "Expires in 2 days" },
];

export default function GhostLinksPage() {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;
    setRotateX(-((mouseY / height) * 2.5)); 
    setRotateY((mouseX / width) * 2.5);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <HomePage active="ghost-links">
      <div 
        style={{ perspective: "1500px" }}
        className="relative flex h-full flex-1 items-center justify-center overflow-hidden p-4 sm:p-6"
      >
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(168,85,247,0.16),transparent_24%),radial-gradient(circle_at_82%_22%,rgba(59,130,246,0.08),transparent_22%),radial-gradient(circle_at_50%_78%,rgba(168,85,247,0.12),transparent_26%)]" />
          <div className="absolute left-[-6rem] top-[-4rem] h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(192,132,252,0.22),transparent_68%)] blur-3xl animate-pulse-soft" />
          <div className="absolute right-[-4rem] bottom-[-5rem] h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(124,58,237,0.2),transparent_68%)] blur-3xl animate-drift" />
        </div>

        <GhostBackdrop
          src="/ghost-2.png"
          alt="Floating ghost behind the ghost links page"
          className="animate-drift"
          imageClassName="opacity-[0.11] scale-110"
        />

        <div 
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{
            transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
            transformStyle: "preserve-3d",
            transition: "transform 0.15s ease-out"
          }}
          className="relative z-10 w-full max-w-4xl rounded-[2.2rem] border border-white/12 bg-white/[0.035] p-6 sm:p-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_30px_90px_rgba(0,0,0,0.4)] backdrop-blur-2xl animate-slide-up-fade"
        >
          <div 
            style={{ transform: "translateZ(40px)" }}
            className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between border-b border-white/10 pb-6"
          >
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-violet-300 font-semibold">
                Ghost Links
              </p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white drop-shadow-[0_0_15px_rgba(168,85,247,0.3)]">
                Temporary Private Gateways
              </h1>
              <p className="mt-2 max-w-xl text-sm leading-6 text-white/50">
                Share a secure routing bridge instead of static identifiers. Links scrub usage records instantly upon timing out.
              </p>
            </div>
            
            <div className="flex items-center gap-3 rounded-2xl border border-violet-400/20 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(33,16,51,0.4))] px-4 py-3 shadow-[0_10px_30px_rgba(168,85,247,0.1)] shrink-0">
              <GhostAvatar />
              <div>
                <p className="text-sm font-medium text-white">Link Generator</p>
                <p className="text-xs text-violet-200/60">E2E Secure Core</p>
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-4" style={{ transformStyle: "preserve-3d" }}>
            {links.map((link, index) => (
              <div
                key={link.code}
                style={{ 
                  animationDelay: `${index * 90 + 300}ms`,
                  transform: "translateZ(20px)"
                }}
                className="group flex flex-col gap-4 rounded-[1.6rem] border border-white/6 bg-white/[0.01] p-4 transition-all duration-300 hover:scale-[1.01] hover:border-violet-400/30 hover:bg-white/[0.04] lg:flex-row lg:items-center lg:justify-between animate-slide-up-fade"
              >
                <div>
                  <p className="text-lg font-mono font-medium text-white tracking-wide group-hover:text-violet-300 transition-colors">{link.code}</p>
                  <p className="mt-1 text-xs text-white/45 flex items-center gap-1.5">
                    <span className="h-1 w-1 rounded-full bg-violet-400" /> {link.expiry}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`rounded-xl border px-3 py-1 text-xs font-medium ${link.status === 'Active' ? 'border-emerald-400/25 bg-emerald-400/10 text-emerald-300' : 'border-white/10 bg-white/5 text-white/60'}`}>
                    {link.status}
                  </span>
                  <button className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 transition-all duration-200 hover:bg-violet-500/20 hover:text-white hover:border-violet-400/30 active:scale-95">
                    Copy
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button 
            style={{ transform: "translateZ(30px)" }}
            className="mt-8 w-full sm:w-auto rounded-xl bg-gradient-to-r from-[#c084fc] via-[#8b5cf6] to-[#6d28d9] px-6 py-3.5 font-medium text-white shadow-[0_15px_30px_rgba(124,58,237,0.3)] transition-all duration-300 hover:brightness-110 hover:shadow-[0_20px_40px_rgba(124,58,237,0.45)] active:scale-[0.98] animate-slide-up-fade [animation-delay:600ms]"
          >
            Generate New Link
          </button>
        </div>
      </div>
    </HomePage>
  );
}