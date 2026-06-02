"use client";

import { useState } from "react";
import { GhostBackdrop, GhostAvatar, HomePage } from "../../components/home";

export default function ProfilePage() {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;
    setRotateX(-((mouseY / height) * 3)); 
    setRotateY((mouseX / width) * 3);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <HomePage active="profile">
      <div 
        style={{ perspective: "1500px" }}
        className="relative flex h-full flex-1 items-center justify-center overflow-hidden p-4 sm:p-6"
      >
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(168,85,247,0.14),transparent_24%),radial-gradient(circle_at_82%_24%,rgba(124,58,237,0.1),transparent_22%),radial-gradient(circle_at_50%_76%,rgba(192,132,252,0.08),transparent_26%)]" />
          <div className="absolute left-[-5rem] top-[8%] h-60 w-60 rounded-full bg-[radial-gradient(circle,rgba(192,132,252,0.22),transparent_68%)] blur-3xl animate-float-slow" />
          <div className="absolute right-[-4rem] bottom-[-5rem] h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(124,58,237,0.22),transparent_68%)] blur-3xl animate-drift" />
        </div>

        <GhostBackdrop
          src="/ghost-2.png"
          alt="Floating ghost behind the profile page"
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
          className="relative z-10 w-full max-w-4xl rounded-[2.2rem] border border-white/12 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.025))] p-6 sm:p-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_30px_90px_rgba(0,0,0,0.4)] backdrop-blur-2xl animate-slide-up-fade"
        >
          <div 
            style={{ transform: "translateZ(35px)" }}
            className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between border-b border-white/10 pb-6"
          >
            <div className="flex items-center gap-5">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-white/5 ring-1 ring-white/15 shadow-[0_10px_30px_rgba(168,85,247,0.15)] animate-panel-bob">
                <GhostAvatar size="md" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-violet-300 font-semibold">
                  Identity Core
                </p>
                <h1 className="mt-1 text-3xl font-semibold tracking-tight text-white drop-shadow-[0_0_15px_rgba(168,85,247,0.25)]">
                  Ghost_467
                </h1>
                <p className="mt-1.5 text-sm text-white/50">
                  Node status: <span className="text-emerald-400 font-medium">Active routing bridge</span>
                </p>
              </div>
            </div>

            <button className="rounded-xl bg-gradient-to-br from-[#c084fc] via-[#8b5cf6] to-[#6d28d9] px-6 py-3 font-medium text-white shadow-[0_12px_30px_rgba(124,58,237,0.3)] transition-all duration-300 hover:brightness-110 active:scale-95 shrink-0">
              Modify Protocol
            </button>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3" style={{ transformStyle: "preserve-3d" }}>
            <StatCard label="Conversations" value="28" delay={250} icon="💬" />
            <StatCard label="Active Ghost Links" value="12" delay={350} icon="🔗" />
            <StatCard label="Secure Streak" value="19 Days" delay={450} icon="⚡" />
          </div>
        </div>
      </div>
    </HomePage>
  );
}

function StatCard({ label, value, delay = 0, icon }: { label: string; value: string; delay?: number, icon: string }) {
  return (
    <div 
      style={{ 
        animationDelay: `${delay}ms`,
        transform: "translateZ(20px)"
      }} 
      className="group rounded-[1.6rem] border border-white/8 bg-white/[0.01] p-5 transition-all duration-300 hover:scale-[1.03] hover:border-violet-400/30 hover:bg-[linear-gradient(180deg,rgba(168,85,247,0.08),rgba(255,255,255,0.02))] hover:shadow-[0_15px_35px_rgba(139,92,246,0.12)] animate-slide-up-fade"
    >
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-white/45 tracking-wide uppercase">{label}</p>
        <span className="text-lg opacity-60 group-hover:opacity-100 transition-opacity">{icon}</span>
      </div>
      <p className="mt-4 text-3xl font-semibold tracking-tight text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.1)] group-hover:text-violet-200 transition-colors">
        {value}
      </p>
    </div>
  );
}