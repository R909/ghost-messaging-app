"use client";

import { useState } from "react";
import { GhostBackdrop, HomePage } from "../components/home";

const initialSettings = [
  { title: "Ghost Mode", description: "Mask underlying socket metadata on message relays.", enabled: true },
  { title: "Self-destruct Timer", description: "Scrub chronological message clusters clean automatically after 24 hours.", enabled: false },
  { title: "Read Receipts", description: "Decline telemetry feedback unless authorized explicitly.", enabled: false },
];

export default function SettingsPage() {
  const [toggleState, setToggleState] = useState(initialSettings);
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

  const handleToggle = (index: number) => {
    setToggleState(prev => prev.map((item, i) => i === index ? { ...item, enabled: !item.enabled } : item));
  };

  return (
    <HomePage active="settings">
      <div 
        style={{ perspective: "1500px" }}
        className="relative flex h-full flex-1 items-center justify-center overflow-hidden p-4 sm:p-6"
      >
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(168,85,247,0.15),transparent_24%),radial-gradient(circle_at_80%_24%,rgba(124,58,237,0.1),transparent_22%),radial-gradient(circle_at_44%_78%,rgba(192,132,252,0.09),transparent_26%)]" />
          <div className="absolute left-[-4rem] bottom-[-5rem] h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(167,139,250,0.22),transparent_68%)] blur-3xl animate-drift" />
          <div className="absolute right-[-5rem] top-[-4rem] h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(124,58,237,0.2),transparent_68%)] blur-3xl animate-pulse-soft" />
        </div>

        <GhostBackdrop
          src="/ghost-1.png"
          alt="Floating ghost behind the settings page"
          className="animate-float-slow"
          imageClassName="opacity-[0.1] scale-110"
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
          <div style={{ transform: "translateZ(30px)" }}>
            <h1 className="text-3xl font-semibold tracking-tight text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.15)]">
              Core Preferences
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/50">
              Adjust application execution parameters. Changing options forces instant token-key rotation updates.
            </p>
          </div>

          <div className="mt-8 space-y-4" style={{ transformStyle: "preserve-3d" }}>
            {toggleState.map((item, index) => (
              <div
                key={item.title}
                style={{ 
                  animationDelay: `${index * 80 + 250}ms`,
                  transform: "translateZ(20px)"
                }}
                className="group flex items-center justify-between rounded-[1.6rem] border border-white/6 bg-white/[0.01] p-5 transition-all duration-300 hover:border-violet-400/20 hover:bg-white/[0.04]"
              >
                <div className="pr-4">
                  <p className="font-medium text-white group-hover:text-violet-200 transition-colors">{item.title}</p>
                  <p className="text-xs text-white/45 mt-1 leading-relaxed">{item.description}</p>
                </div>
                <button
                  onClick={() => handleToggle(index)}
                  className={[
                    "h-8 w-14 shrink-0 rounded-full border p-1 transition-all duration-300 relative outline-none",
                    item.enabled
                      ? "border-violet-400/40 bg-violet-500/30 shadow-[0_0_20px_rgba(168,85,247,0.3)]"
                      : "border-white/10 bg-black/40",
                  ].join(" ")}
                >
                  <span
                    className={[
                      "block h-5 w-5 rounded-full bg-white shadow-[0_2px_10px_rgba(0,0,0,0.4)] transition-all duration-300 transform",
                      item.enabled ? "translate-x-6 bg-violet-100" : "translate-x-0",
                    ].join(" ")}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </HomePage>
  );
}