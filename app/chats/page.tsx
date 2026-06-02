"use client";

import { useState } from "react";
import {
  GhostBackdrop,
  GhostAvatar,
  HomePage,
  SectionHeaderButton,
} from "../components/home";

const conversations = [
  { name: "Ghost_467", preview: "Hey there! 👋", time: "Now", accent: "ring-violet-400/40 bg-violet-500/20" },
  { name: "Unknown_001", preview: "Can we talk?", time: "2m ago" },
  { name: "Night_Owl", preview: "I have something to tell you...", time: "15m ago" },
  { name: "Phantom_99", preview: "This is amazing!", time: "1h ago", accent: "bg-violet-500/30" },
  { name: "Shadow_77", preview: "See you soon 👻", time: "3h ago" },
  { name: "Secret_Ghost", preview: "Don't share this anywhere.", time: "Yesterday" },
  { name: "Invisible_23", preview: "You're awesome!", time: "2d ago" },
  { name: "No_Name", preview: "💜 💜", time: "3d ago" },
];

type ChatSide = "left" | "right";

type ChatMessage = {
  side: ChatSide;
  text: string;
  time: string;
  date?: string;
  seen?: boolean;
};

const initialThreads: Record<string, ChatMessage[]> = {
  Ghost_467: [
    { side: "left", text: "Hey there! 👋 I've been feeling quite overwhelmed lately with work.", time: "04:15 AM", date: "April 28, 2024" },
    { side: "right", text: "I completely understand. Take your time and breathe. 🌿", time: "04:20 AM", seen: true },
    { side: "left", text: "When will the contract be sent?", time: "06:15 AM", date: "April 29, 2024" },
    { side: "right", text: "Paperless opt-in email sent ✅", time: "06:20 AM", seen: true },
  ],
  Unknown_001: [
    { side: "left", text: "Can we talk? It's important.", time: "09:05 PM", date: "April 27, 2024" },
    { side: "right", text: "Of course. I'm here.", time: "09:07 PM", seen: true },
  ],
  Night_Owl: [
    { side: "left", text: "I have something to tell you...", time: "11:18 PM", date: "April 26, 2024" },
    { side: "right", text: "Take your time. I'm listening.", time: "11:20 PM", seen: true },
  ],
  Phantom_99: [
    { side: "left", text: "This is amazing!", time: "01:10 PM", date: "April 25, 2024" },
    { side: "right", text: "It gets even better once the ghosts show up.", time: "01:12 PM", seen: true },
  ],
  Shadow_77: [{ side: "left", text: "See you soon 👻", time: "08:40 PM", date: "April 24, 2024" }],
  Secret_Ghost: [{ side: "left", text: "Don't share this anywhere.", time: "10:11 AM", date: "April 23, 2024" }],
  Invisible_23: [{ side: "left", text: "You're awesome!", time: "03:30 PM", date: "April 22, 2024" }],
  No_Name: [{ side: "left", text: "💜 💜", time: "06:45 PM", date: "April 21, 2024" }],
};

export default function ChatsPage() {
  const [activeConversation, setActiveConversation] = useState("Ghost_467");
  const [draft, setDraft] = useState("");
  const [search, setSearch] = useState("");
  const [threads, setThreads] = useState(initialThreads);
  const [isTyping, setIsTyping] = useState(false);

  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const currentConversation = conversations.find((item) => item.name === activeConversation) ?? conversations[0];
  const visibleConversations = conversations.filter((c) => `${c.name} ${c.preview}`.toLowerCase().includes(search.toLowerCase()));
  const activeThread = threads[activeConversation] ?? [];

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

  function sendMessage(text: string) {
    const content = text.trim();
    if (!content) return;

    const nextMessage: ChatMessage = {
      side: "right",
      text: content,
      time: formatTime(new Date()),
      seen: true,
    };

    setThreads((current) => ({
      ...current,
      [activeConversation]: [...(current[activeConversation] ?? []), nextMessage],
    }));
    setDraft("");
    setIsTyping(true);

    window.setTimeout(() => {
      const reply: ChatMessage = {
        side: "left",
        text: "I feel that. Let's keep this conversation moving gently.",
        time: formatTime(new Date()),
      };
      setThreads((current) => ({
        ...current,
        [activeConversation]: [...(current[activeConversation] ?? []), reply],
      }));
      setIsTyping(false);
    }, 1200);
  }

  return (
    <HomePage active="chats">
      <div 
        style={{ perspective: "1500px" }}
        className="relative flex h-full flex-1 flex-col overflow-hidden bg-[#11101a]/90 lg:flex-row"
      >
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes bubble3D {
            0% { transform: scale(0.92) translateY(15px); opacity: 0; }
            100% { transform: scale(1) translateY(0); opacity: 1; }
          }
          .animate-bubble-3d {
            animation: bubble3D 0.35s cubic-bezier(0.23, 1, 0.32, 1) forwards;
          }
        `}} />

        <GhostBackdrop src="/ghost-1.png" alt="Chat backdrop" className="animate-float-slow" imageClassName="opacity-[0.12] scale-110" />
        <GhostBackdrop src="/ghost-2.png" alt="Thread backdrop" className="hidden lg:block animate-drift" imageClassName="opacity-[0.08] translate-x-1/4 translate-y-10 scale-[1.15] blur-[1px]" />

        {/* Messaging Sidebar Column */}
        <section className="relative z-10 flex flex-1 flex-col border-b border-white/10 p-4 sm:p-5 lg:max-w-[350px] lg:border-b-0 lg:border-r bg-black/10 backdrop-blur-md">
          <div className="flex items-center justify-between px-1 pb-4">
            <h1 className="text-2xl font-semibold tracking-tight text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]">Messages</h1>
            <SectionHeaderButton><ComposeIcon /></SectionHeaderButton>
          </div>

          <label className="mb-3 flex items-center gap-3 rounded-2xl border border-white/8 bg-white/[0.04] px-4 py-3 text-white/45 transition-all duration-300 focus-within:border-violet-500/40 focus-within:bg-white/[0.06] focus-within:shadow-[0_0_15px_rgba(168,85,247,0.1)]">
            <SearchIcon />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search messages" className="w-full bg-transparent text-sm outline-none text-white placeholder:text-white/35" />
          </label>

          <div className="flex-1 space-y-2 overflow-y-auto pr-1">
            {visibleConversations.map((item) => (
              <button
                key={item.name}
                onClick={() => setActiveConversation(item.name)}
                className={[
                  "flex w-full items-center gap-3 rounded-[1.4rem] border px-4 py-3 text-left transition-all duration-300 transform active:scale-[0.98]",
                  item.name === activeConversation
                    ? "border-violet-400/30 bg-[linear-gradient(135deg,rgba(139,92,246,0.2),rgba(20,15,38,0.8))] shadow-[0_10px_25px_rgba(139,92,246,0.15)]"
                    : "border-transparent bg-transparent hover:border-white/8 hover:bg-white/[0.02]",
                ].join(" ")}
              >
                <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/5 ring-1 ring-white/10">
                  <GhostAvatar accent={item.accent} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-sm font-medium text-white">{item.name}</p>
                    <span className="shrink-0 text-xs text-white/40">{item.time}</span>
                  </div>
                  <p className="truncate text-xs text-white/50 mt-0.5">{item.preview}</p>
                </div>
              </button>
            ))}
          </div>

          <button onClick={() => setActiveConversation("No_Name")} className="mt-3 flex items-center justify-center gap-2 rounded-xl border border-violet-400/30 bg-violet-500/10 px-4 py-2.5 text-sm font-medium text-violet-200 transition-all duration-200 hover:bg-violet-500/20 active:scale-95">
            <PlusIcon /> New Message
          </button>
        </section>

        {/* Messaging Display Thread Panel */}
        <section 
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{
            transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
            transformStyle: "preserve-3d",
            transition: "transform 0.15s ease-out"
          }}
          className="relative z-10 flex flex-1 flex-col overflow-hidden border border-white/12 shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_30px_90px_rgba(0,0,0,0.45)] backdrop-blur-3xl m-3 rounded-[2.2rem] bg-white/[0.015]"
        >
          {/* Internal ambient glowing depth maps */}
          <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_15%,rgba(255,255,255,0.06),transparent_30%),radial-gradient(circle_at_80%_20%,rgba(168,85,247,0.12),transparent_25%)]" />
          </div>

          <header style={{ transform: "translateZ(30px)" }} className="relative z-10 flex items-center justify-between gap-4 border-b border-white/10 px-6 py-4 bg-white/[0.02]">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/5 ring-1 ring-white/10">
                <GhostAvatar />
              </div>
              <div>
                <p className="font-medium text-white text-sm">{currentConversation.name}</p>
                <div className="flex items-center gap-1.5 text-xs text-white/50 mt-0.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.6)] animate-pulse" />
                  Secured Pipeline
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <SectionHeaderButton><PhoneIcon /></SectionHeaderButton>
              <SectionHeaderButton><VideoIcon /></SectionHeaderButton>
              <SectionHeaderButton><InfoIcon /></SectionHeaderButton>
            </div>
          </header>

          <div className="relative z-10 flex-1 overflow-y-auto p-6 space-y-6" style={{ transformStyle: "preserve-3d" }}>
            <div className="mx-auto w-fit rounded-full border border-white/8 bg-white/[0.04] px-3 py-1 text-[11px] text-white/45">
              Channel Instantiated — {currentConversation.name}
            </div>

            {activeThread.map((message, index) => (
              <div key={`${message.time}-${index}`} className="animate-bubble-3d">
                {message.date && (
                  <div className="mx-auto mb-4 w-fit rounded-full border border-white/8 bg-white/[0.04] px-3 py-1 text-[11px] text-white/45">
                    {message.date}
                  </div>
                )}

                <div className={`flex items-end gap-3 ${message.side === "right" ? "justify-end" : "justify-start"}`}>
                  {message.side === "left" && (
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/5 ring-1 ring-white/10">
                      <GhostAvatar size="sm" />
                    </div>
                  )}

                  <div
                    style={{ transform: "translateZ(15px)" }}
                    className={`max-w-[75%] rounded-[1.4rem] border px-4 py-2.5 shadow-lg transition-all duration-300 ${
                      message.side === "right"
                        ? "border-violet-400/20 bg-[linear-gradient(180deg,rgba(139,92,246,0.7),rgba(91,33,182,0.85))] text-white"
                        : "border-white/6 bg-white/[0.04] text-white/90"
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{message.text}</p>
                    <div className={`mt-1.5 flex items-center gap-1.5 text-[10px] ${message.side === "right" ? "justify-end text-white/60" : "text-white/40"}`}>
                      <span>{message.time}</span>
                      {message.seen && <span className="text-violet-300">✓✓</span>}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-end gap-3 anonymity-typing animate-bubble-3d">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/5 ring-1 ring-white/10">
                  <GhostAvatar size="sm" />
                </div>
                <div className="rounded-xl border border-white/6 bg-white/[0.04] px-4 py-3.5">
                  <div className="flex items-center gap-1">
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white/40" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white/40 [animation-delay:150ms]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white/40 [animation-delay:300ms]" />
                  </div>
                </div>
              </div>
            )}
          </div>

          <footer style={{ transform: "translateZ(25px)" }} className="relative z-10 p-4 border-t border-white/10 bg-white/[0.01]">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="flex flex-1 items-center gap-3 rounded-xl border border-white/8 bg-black/30 px-4 py-2.5 focus-within:border-violet-500/40 transition-colors">
                <input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage(draft)}
                  placeholder="Transmit encrypted payload..."
                  className="flex-1 bg-transparent text-sm outline-none text-white placeholder:text-white/25"
                />
                <button className="text-white/40 hover:text-violet-400 transition-colors"><PaperclipIcon /></button>
                <button className="text-white/40 hover:text-violet-400 transition-colors"><MicIcon /></button>
              </div>
              <button onClick={() => sendMessage(draft)} className="rounded-xl bg-gradient-to-br from-[#b06cff] to-[#7d3cff] px-5 py-2.5 text-sm font-medium text-white shadow-md hover:brightness-110 transition-all active:scale-95">
                Send
              </button>
            </div>
          </footer>
        </section>
      </div>
    </HomePage>
  );
}

// System Formatters & Standard Layout SVGs preserved for builds
function formatTime(date: Date) {
  return new Intl.DateTimeFormat("en-US", { hour: "2-digit", minute: "2-digit", hour12: true }).format(date);
}
function ComposeIcon() { return <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M14.5 5.5h4a2 2 0 0 1 2 2v4M10 14l7-7M9 7h-2a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-2" strokeLinecap="round" /></svg>; }
function SearchIcon() { return <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="11" cy="11" r="6.5" /><path d="M16 16l4 4" strokeLinecap="round" /></svg>; }
function PlusIcon() { return <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 5v14M5 12h14" strokeLinecap="round" /></svg>; }
function PhoneIcon() { return <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M7 4.8c.9-.7 2-.7 2.7.1l1.5 1.8c.6.8.6 1.8-.1 2.5l-1 1c.8 1.6 2.2 3 3.8 3.8l1-1c.7-.7 1.7-.7 2.5-.1l1.8 1.5c.8.7.8 1.8.1 2.7l-1 1.3c-.7.9-1.8 1.3-2.9 1.1-6.3-1.1-11.1-5.9-12.2-12.2-.2-1.1.2-2.2 1.1-2.9L7 4.8Z" strokeLinecap="round"/></svg>; }
function VideoIcon() { return <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3.5" y="6.5" width="12" height="11" rx="2" /><path d="M16 10l4-2v8l-4-2Z" strokeLinecap="round" strokeLinejoin="round" /></svg>; }
function InfoIcon() { return <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="8.5" /><path d="M12 11v5" strokeLinecap="round" /><path d="M12 8.2h.01" strokeLinecap="round" /></svg>; }
function PaperclipIcon() { return <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M13.5 6.5 7.6 12.4a3 3 0 0 0 4.2 4.2l6.4-6.4a4.5 4.5 0 1 0-6.3-6.4L5.3 10.4" strokeLinecap="round" strokeLinejoin="round" /></svg>; }
function MicIcon() { return <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="9" y="4.5" width="6" height="10" rx="3" /><path d="M6.5 12a5.5 5.5 0 0 0 11 0" strokeLinecap="round" /><path d="M12 17v3.5" strokeLinecap="round" /></svg>; }