"use client";

import { useState } from "react";
import { GhostBackdrop, GhostAvatar, HomePage } from "../components/home";

const contacts = [
  { name: "Ghost_467", status: "Online now", mood: "Calm" },
  { name: "Night_Owl", status: "Away", mood: "Thinking" },
  { name: "Shadow_77", status: "Busy", mood: "Silent" },
  { name: "Invisible_23", status: "Typing...", mood: "Warm" },
];

export default function ContactsPage() {
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
    <HomePage active="contacts">
      <div 
        style={{ perspective: "1200px" }}
        className="relative flex h-full flex-1 items-center justify-center overflow-hidden p-4 sm:p-6"
      >
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_16%,rgba(168,85,247,0.14),transparent_24%),radial-gradient(circle_at_78%_26%,rgba(124,58,237,0.1),transparent_22%),radial-gradient(circle_at_50%_74%,rgba(192,132,252,0.08),transparent_26%)]" />
          <div className="absolute left-[-5rem] top-[10%] h-60 w-60 rounded-full bg-[radial-gradient(circle,rgba(196,181,253,0.2),transparent_68%)] blur-3xl animate-float-slow" />
          <div className="absolute right-[-3rem] bottom-[-4rem] h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(124,58,237,0.22),transparent_68%)] blur-3xl animate-pulse-soft" />
        </div>
        
        <GhostBackdrop
          src="/ghost-3.png"
          alt="Floating ghost behind the contacts page"
          className="animate-pulse-soft"
          imageClassName="opacity-[0.11] scale-110"
        />

        {/* 3D Glass Roster Card Container */}
        <div
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{
            transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
            transformStyle: "preserve-3d",
            transition: "transform 0.15s ease-out"
          }}
          className="relative z-10 w-full max-w-4xl rounded-[2.2rem] border border-white/12 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))5] p-6 sm:p-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_35px_80px_rgba(0,0,0,0.45)] backdrop-blur-2xl animate-slide-up-fade"
        >
          <div style={{ transform: "translateZ(30px)" }}>
            <h1 className="text-3xl font-semibold tracking-tight text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.15)]">
              Contacts
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/60">
              A responsive, static contact roster engineered for dynamic hydration. Real-time encryption statuses mapped per channel.
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2" style={{ transformStyle: "preserve-3d" }}>
            {contacts.map((contact, index) => (
              <div
                key={contact.name}
                style={{ 
                  animationDelay: `${index * 80 + 250}ms`,
                  transform: "translateZ(15px)"
                }}
                className="group flex items-center justify-between rounded-[1.6rem] border border-white/8 bg-white/[0.02] p-4 transition-all duration-300 hover:scale-[1.02] hover:border-violet-400/30 hover:bg-[linear-gradient(135deg,rgba(168,85,247,0.12),rgba(255,255,255,0.04))] hover:shadow-[0_15px_35px_rgba(139,92,246,0.15)] animate-slide-up-fade"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 ring-1 ring-white/10 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                    <GhostAvatar size="sm" />
                  </div>
                  <div>
                    <p className="font-medium text-white group-hover:text-violet-200 transition-colors">{contact.name}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className={`h-1.5 w-1.5 rounded-full ${contact.status.includes('now') ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]' : 'bg-white/30'}`} />
                      <p className="text-xs text-white/50">{contact.status}</p>
                    </div>
                  </div>
                </div>
                <span className="rounded-xl border border-violet-400/25 bg-violet-500/15 px-3 py-1.5 text-xs font-medium text-violet-200 shadow-[0_0_15px_rgba(168,85,247,0.1)] transition-transform duration-300 group-hover:scale-105">
                  {contact.mood}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </HomePage>
  );
}