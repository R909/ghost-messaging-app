"use client";

import { useState } from "react";
import {
  GhostBackdrop,
  GhostAvatar,
  HomePage,
  SectionHeaderButton,
} from "../components/home";

const conversations = [
  {
    name: "Ghost_467",
    preview: "Hey there! 👋",
    time: "Now",
    accent: "ring-violet-400/40 bg-violet-500/20",
  },
  { name: "Unknown_001", preview: "Can we talk?", time: "2m ago" },
  {
    name: "Night_Owl",
    preview: "I have something to tell you...",
    time: "15m ago",
  },
  {
    name: "Phantom_99",
    preview: "This is amazing!",
    time: "1h ago",
    accent: "bg-violet-500/30",
  },
  { name: "Shadow_77", preview: "See you soon 👻", time: "3h ago" },
  {
    name: "Secret_Ghost",
    preview: "Don't share this anywhere.",
    time: "Yesterday",
  },
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
    {
      side: "left",
      text: "Hey there! 👋 I've been feeling quite overwhelmed lately with work.",
      time: "04:15 AM",
      date: "April 28, 2024",
    },
    {
      side: "right",
      text: "I completely understand. Take your time and breathe. 🌿",
      time: "04:20 AM",
      seen: true,
    },
    {
      side: "left",
      text: "When will the contract be sent?",
      time: "06:15 AM",
      date: "April 29, 2024",
    },
    {
      side: "right",
      text: "Paperless opt-in email sent ✅",
      time: "06:20 AM",
      seen: true,
    },
  ],
  Unknown_001: [
    {
      side: "left",
      text: "Can we talk? It's important.",
      time: "09:05 PM",
      date: "April 27, 2024",
    },
    {
      side: "right",
      text: "Of course. I'm here.",
      time: "09:07 PM",
      seen: true,
    },
  ],
  Night_Owl: [
    {
      side: "left",
      text: "I have something to tell you...",
      time: "11:18 PM",
      date: "April 26, 2024",
    },
    {
      side: "right",
      text: "Take your time. I'm listening.",
      time: "11:20 PM",
      seen: true,
    },
  ],
  Phantom_99: [
    {
      side: "left",
      text: "This is amazing!",
      time: "01:10 PM",
      date: "April 25, 2024",
    },
    {
      side: "right",
      text: "It gets even better once the ghosts show up.",
      time: "01:12 PM",
      seen: true,
    },
  ],
  Shadow_77: [
    {
      side: "left",
      text: "See you soon 👻",
      time: "08:40 PM",
      date: "April 24, 2024",
    },
  ],
  Secret_Ghost: [
    {
      side: "left",
      text: "Don't share this anywhere.",
      time: "10:11 AM",
      date: "April 23, 2024",
    },
  ],
  Invisible_23: [
    {
      side: "left",
      text: "You're awesome!",
      time: "03:30 PM",
      date: "April 22, 2024",
    },
  ],
  No_Name: [
    {
      side: "left",
      text: "💜 💜",
      time: "06:45 PM",
      date: "April 21, 2024",
    },
  ],
};

export default function ChatsPage() {
  const [activeConversation, setActiveConversation] = useState("Ghost_467");
  const [draft, setDraft] = useState("");
  const [search, setSearch] = useState("");
  const [threads, setThreads] = useState(initialThreads);
  const [isTyping, setIsTyping] = useState(false);

  const currentConversation =
    conversations.find((item) => item.name === activeConversation) ??
    conversations[0];

  const visibleConversations = conversations.filter((conversation) => {
    const haystack = `${conversation.name} ${conversation.preview}`.toLowerCase();
    return haystack.includes(search.toLowerCase());
  });

  const activeThread = threads[activeConversation] ?? [];

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
      <div className="relative flex h-full flex-1 flex-col overflow-hidden bg-[#11101a]/90 lg:flex-row">
        <GhostBackdrop
          src="/ghost-1.png"
          alt="Floating ghost behind the chat page"
          className="animate-float-slow"
          imageClassName="opacity-[0.12] scale-110"
        />
        <GhostBackdrop
          src="/ghost-2.png"
          alt="Secondary ghost floating behind the message thread"
          className="hidden lg:block animate-drift"
          imageClassName="opacity-[0.08] translate-x-1/4 translate-y-10 scale-[1.15] rotate-6 blur-[1px]"
        />

        <section className="relative z-10 flex flex-1 flex-col border-b border-white/10 p-4 sm:p-5 lg:max-w-[350px] lg:border-b-0 lg:border-r">
          <div className="flex items-center justify-between px-1 pb-4">
            <h1 className="text-2xl font-semibold tracking-tight text-white">
              Messages
            </h1>
            <SectionHeaderButton>
              <ComposeIcon />
            </SectionHeaderButton>
          </div>

          <label className="mb-3 flex items-center gap-3 rounded-2xl border border-white/8 bg-white/[0.04] px-4 py-3 text-white/45">
            <SearchIcon />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search messages"
              className="w-full bg-transparent text-sm outline-none placeholder:text-white/35"
            />
          </label>

          <div className="flex-1 space-y-2 overflow-y-auto pr-1">
            {visibleConversations.map((item) => (
              <button
                key={item.name}
                onClick={() => setActiveConversation(item.name)}
                className={[
                  "flex w-full items-center gap-3 rounded-[1.35rem] border px-4 py-3 text-left transition duration-200",
                  item.name === activeConversation
                    ? "border-violet-400/40 bg-[linear-gradient(135deg,rgba(126,34,206,0.35),rgba(31,22,46,0.9))] shadow-[0_0_28px_rgba(162,92,255,0.25)]"
                    : "border-transparent bg-transparent hover:border-white/10 hover:bg-white/[0.03]",
                ].join(" ")}
              >
                <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/5 ring-1 ring-white/10">
                  <GhostAvatar accent={item.accent} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <p className="truncate text-sm font-medium text-white">
                      {item.name}
                    </p>
                    <span className="shrink-0 text-xs text-white/45">
                      {item.time}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center justify-between gap-3">
                    <p className="truncate text-sm text-white/60">{item.preview}</p>
                    {item.name === activeConversation ? (
                      <span className="shrink-0 text-[10px] uppercase tracking-[0.24em] text-violet-300">
                        Now
                      </span>
                    ) : null}
                  </div>
                </div>
              </button>
            ))}
          </div>

          <button
            onClick={() => setActiveConversation("No_Name")}
            className="mt-3 flex items-center justify-center gap-2 rounded-2xl border border-violet-400/40 bg-transparent px-4 py-3 text-sm text-violet-200 transition hover:bg-violet-500/10"
          >
            <PlusIcon />
            New Message
          </button>
        </section>

        <section className="relative z-10 flex flex-1 flex-col overflow-hidden border border-white/10 bg-[radial-gradient(circle_at_top,rgba(115,54,194,0.16),transparent_50%),linear-gradient(180deg,rgba(12,10,19,0.96),rgba(15,12,21,0.98))] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.16),0_20px_80px_rgba(0,0,0,0.28)] backdrop-blur-2xl sm:p-5">
          <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(255,255,255,0.08),transparent_28%),radial-gradient(circle_at_70%_24%,rgba(168,85,247,0.16),transparent_24%),radial-gradient(circle_at_34%_72%,rgba(56,189,248,0.1),transparent_26%)]" />
            <div className="absolute inset-6 rounded-[2rem] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.015))] shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_0_60px_rgba(168,85,247,0.08)] backdrop-blur-[2px]" />
            <div className="absolute inset-x-8 top-4 h-px bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.6),transparent)] opacity-70 blur-[1px]" />
            <div className="absolute left-8 top-8 h-20 w-[45%] rotate-[-12deg] rounded-full bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.14),rgba(255,255,255,0.06),transparent)] opacity-50 blur-2xl" />
            <div className="absolute right-[-8%] top-[-8%] h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.16),transparent_66%)] blur-3xl" />
            <div className="absolute right-[-6rem] top-[12%] h-[24rem] w-[24rem] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.1),transparent_68%)] blur-3xl animate-pulse-soft" />
            <div className="absolute left-[-4rem] bottom-[8%] h-[20rem] w-[20rem] rounded-full bg-[radial-gradient(circle,rgba(147,51,234,0.16),transparent_68%)] blur-3xl animate-drift" />
          </div>

          <header className="relative z-10 flex items-center justify-between gap-4 rounded-[1.6rem] border border-white/8 bg-white/[0.03] px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/6 ring-1 ring-white/10">
                <GhostAvatar />
              </div>
              <div>
                <p className="font-medium text-white">{currentConversation.name}</p>
                <div className="flex items-center gap-2 text-xs text-white/55">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(74,222,128,0.8)]" />
                  Online
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <SectionHeaderButton>
                <PhoneIcon />
              </SectionHeaderButton>
              <SectionHeaderButton>
                <VideoIcon />
              </SectionHeaderButton>
              <SectionHeaderButton>
                <InfoIcon />
              </SectionHeaderButton>
            </div>
          </header>

          <div className="relative z-10 flex-1 overflow-y-auto px-1 py-6 sm:px-2">
            <div className="mx-auto mb-6 w-fit rounded-full border border-white/8 bg-white/[0.04] px-3 py-1 text-[11px] text-white/45">
              {currentConversation.preview}
            </div>

            <div className="space-y-8">
              {activeThread.map((message, index) => (
                <div key={`${message.time}-${index}-${message.text}`}>
                  {message.date ? (
                    <div className="mx-auto mb-6 w-fit rounded-full border border-white/8 bg-white/[0.04] px-3 py-1 text-[11px] text-white/45">
                      {message.date}
                    </div>
                  ) : null}

                  <div
                    className={[
                      "flex items-end gap-3",
                      message.side === "right" ? "justify-end" : "justify-start",
                    ].join(" ")}
                  >
                    {message.side === "left" ? (
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/5 ring-1 ring-white/10">
                        <GhostAvatar size="sm" />
                      </div>
                    ) : null}

                    <div
                      className={[
                        "max-w-[min(100%,28rem)] rounded-[1.3rem] border px-4 py-3 shadow-[0_12px_40px_rgba(0,0,0,0.22)]",
                        message.side === "right"
                          ? "border-violet-300/15 bg-[linear-gradient(180deg,rgba(115,64,188,0.9),rgba(58,39,89,0.98))] text-white"
                          : "border-white/8 bg-white/[0.06] text-white/88",
                      ].join(" ")}
                    >
                      <p className="text-sm leading-6">{message.text}</p>
                      <div
                        className={[
                          "mt-2 flex items-center gap-2 text-[11px]",
                          message.side === "right"
                            ? "justify-end text-white/60"
                            : "justify-start text-white/40",
                        ].join(" ")}
                      >
                        <span>{message.time}</span>
                        {message.seen ? <span>✓✓</span> : null}
                      </div>
                    </div>

                    {message.side === "right" ? (
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/6 ring-1 ring-white/10">
                        <div className="h-9 w-9 rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.32),rgba(62,38,92,0.9))]" />
                      </div>
                    ) : null}
                  </div>
                </div>
              ))}

              {isTyping ? (
                <div className="flex items-end gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/5 ring-1 ring-white/10">
                    <GhostAvatar size="sm" />
                  </div>
                  <div className="rounded-[1.3rem] border border-white/8 bg-white/[0.06] px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <span className="h-2 w-2 animate-pulse rounded-full bg-white/50" />
                      <span className="h-2 w-2 animate-pulse rounded-full bg-white/50 [animation-delay:150ms]" />
                      <span className="h-2 w-2 animate-pulse rounded-full bg-white/50 [animation-delay:300ms]" />
                    </div>
                  </div>
                </div>
              ) : null}

              <div className="flex items-end gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/5 ring-1 ring-white/10">
                  <GhostAvatar size="sm" />
                </div>
                <div className="w-full max-w-[28rem] rounded-[1.3rem] border border-white/8 bg-white/[0.05] p-4 text-white/90 shadow-[0_12px_40px_rgba(0,0,0,0.22)]">
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-xs text-white/45">
                      This message will disappear in
                    </p>
                    <button className="rounded-full border border-white/8 bg-white/5 p-2 text-white/45">
                      <TrashIcon />
                    </button>
                  </div>
                  <div className="mt-2 flex items-center gap-4">
                    <p className="text-3xl font-medium tracking-tight">00:07</p>
                    <div className="flex h-14 w-14 items-center justify-center rounded-full border border-dashed border-violet-300/30">
                      <div className="h-9 w-9 animate-spin rounded-full border-2 border-violet-300/35 border-t-violet-200" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <footer className="relative z-10 rounded-[1.6rem] border border-white/8 bg-white/[0.03] p-3">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
              <div className="flex items-center gap-3 rounded-2xl px-2 py-1 text-sm text-emerald-300">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_14px_rgba(74,222,128,0.8)]" />
                Ghost Mode On
              </div>

              <div className="flex flex-1 items-center gap-3 rounded-2xl border border-white/8 bg-black/20 px-4 py-3 text-white/45">
                <input
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      sendMessage(draft);
                    }
                  }}
                  placeholder="Write something..."
                  className="flex-1 bg-transparent text-sm outline-none placeholder:text-white/35"
                />
                <button className="text-white/60">
                  <PaperclipIcon />
                </button>
                <button className="text-white/60">
                  <MicIcon />
                </button>
              </div>

              <button
                onClick={() => sendMessage(draft)}
                className="rounded-2xl bg-gradient-to-br from-[#b06cff] to-[#7d3cff] px-5 py-3 font-medium text-white shadow-[0_12px_30px_rgba(145,82,255,0.35)] transition hover:brightness-110"
              >
                Send
              </button>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {[
                "Let's keep this private.",
                "Send the details when ready.",
                "I can help with that.",
              ].map((reply) => (
                <button
                  key={reply}
                  onClick={() => sendMessage(reply)}
                  className="rounded-full border border-white/8 bg-white/[0.03] px-3 py-2 text-xs text-white/70 transition hover:border-violet-400/30 hover:bg-violet-500/10 hover:text-violet-100"
                >
                  {reply}
                </button>
              ))}
            </div>
          </footer>
        </section>
      </div>
    </HomePage>
  );
}

function formatTime(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}

function ComposeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M14.5 5.5h4a2 2 0 0 1 2 2v4" strokeLinecap="round" />
      <path d="M10 14l7-7" strokeLinecap="round" />
      <path d="M9 7h-2a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-2" strokeLinecap="round" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4 shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <circle cx="11" cy="11" r="6.5" />
      <path d="M16 16l4 4" strokeLinecap="round" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M12 5v14M5 12h14" strokeLinecap="round" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path
        d="M7 4.8c.9-.7 2-.7 2.7.1l1.5 1.8c.6.8.6 1.8-.1 2.5l-1 1c.8 1.6 2.2 3 3.8 3.8l1-1c.7-.7 1.7-.7 2.5-.1l1.8 1.5c.8.7.8 1.8.1 2.7l-1 1.3c-.7.9-1.8 1.3-2.9 1.1-6.3-1.1-11.1-5.9-12.2-12.2-.2-1.1.2-2.2 1.1-2.9L7 4.8Z"
        strokeLinecap="round"
      />
    </svg>
  );
}

function VideoIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <rect x="3.5" y="6.5" width="12" height="11" rx="2" />
      <path d="M16 10l4-2v8l-4-2Z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 11v5" strokeLinecap="round" />
      <path d="M12 8.2h.01" strokeLinecap="round" />
    </svg>
  );
}

function PaperclipIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path
        d="M13.5 6.5 7.6 12.4a3 3 0 0 0 4.2 4.2l6.4-6.4a4.5 4.5 0 1 0-6.3-6.4L5.3 10.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MicIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <rect x="9" y="4.5" width="6" height="10" rx="3" />
      <path d="M6.5 12a5.5 5.5 0 0 0 11 0" strokeLinecap="round" />
      <path d="M12 17v3.5" strokeLinecap="round" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M9 5.5h6M10 5.5l.4-1.2A1.5 1.5 0 0 1 11.8 3.5h.4a1.5 1.5 0 0 1 1.4.8l.4 1.2" strokeLinecap="round" />
      <path d="M6.5 7h11" strokeLinecap="round" />
      <path d="M8 7l.6 11a1.5 1.5 0 0 0 1.5 1.4h3.8a1.5 1.5 0 0 0 1.5-1.4L16 7" strokeLinecap="round" />
    </svg>
  );
}
