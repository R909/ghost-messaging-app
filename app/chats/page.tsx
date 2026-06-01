import { HomePage, GhostAvatar, SectionHeaderButton } from "../components/home";

const conversations = [
  {
    name: "Ghost_467",
    preview: "Hey there! 👋",
    time: "Now",
    active: true,
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

const messages = [
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
];

export default function ChatsPage() {
  return (
    <HomePage active="chats">
      <div className="flex h-full flex-1 flex-col bg-[#11101a]/90 lg:flex-row">
        <section className="flex flex-1 flex-col border-b border-white/10 p-4 sm:p-5 lg:max-w-[350px] lg:border-b-0 lg:border-r">
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
            <span className="text-sm">Search messages</span>
          </label>

          <div className="flex-1 space-y-2 overflow-y-auto pr-1">
            {conversations.map((item) => (
              <button
                key={item.name}
                className={[
                  "flex w-full items-center gap-3 rounded-[1.35rem] border px-4 py-3 text-left transition duration-200",
                  item.active
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
                    {item.active ? (
                      <span className="shrink-0 text-[10px] uppercase tracking-[0.24em] text-violet-300">
                        Now
                      </span>
                    ) : null}
                  </div>
                </div>
              </button>
            ))}
          </div>

          <button className="mt-3 flex items-center justify-center gap-2 rounded-2xl border border-violet-400/40 bg-transparent px-4 py-3 text-sm text-violet-200 transition hover:bg-violet-500/10">
            <PlusIcon />
            New Message
          </button>
        </section>

        <section className="flex flex-1 flex-col bg-[radial-gradient(circle_at_top,rgba(115,54,194,0.16),transparent_50%),linear-gradient(180deg,rgba(12,10,19,0.96),rgba(15,12,21,0.98))] p-4 sm:p-5">
          <header className="flex items-center justify-between gap-4 rounded-[1.6rem] border border-white/8 bg-white/[0.03] px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/6 ring-1 ring-white/10">
                <GhostAvatar />
              </div>
              <div>
                <p className="font-medium text-white">Ghost_467</p>
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

          <div className="flex-1 overflow-y-auto px-1 py-6 sm:px-2">
            <div className="mx-auto mb-6 w-fit rounded-full border border-white/8 bg-white/[0.04] px-3 py-1 text-[11px] text-white/45">
              April 28, 2024
            </div>

            <div className="space-y-8">
              {messages.map((message, index) => (
                <div key={`${message.time}-${index}`}>
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

          <footer className="rounded-[1.6rem] border border-white/8 bg-white/[0.03] p-3">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
              <div className="flex items-center gap-3 rounded-2xl px-2 py-1 text-sm text-emerald-300">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_14px_rgba(74,222,128,0.8)]" />
                Ghost Mode On
              </div>

              <div className="flex flex-1 items-center gap-3 rounded-2xl border border-white/8 bg-black/20 px-4 py-3 text-white/45">
                <span className="flex-1 text-sm">Write something...</span>
                <button className="text-white/60">
                  <PaperclipIcon />
                </button>
                <button className="text-white/60">
                  <MicIcon />
                </button>
              </div>

              <button className="rounded-2xl bg-gradient-to-br from-[#b06cff] to-[#7d3cff] px-5 py-3 font-medium text-white shadow-[0_12px_30px_rgba(145,82,255,0.35)] transition hover:brightness-110">
                Send
              </button>
            </div>
          </footer>
        </section>
      </div>
    </HomePage>
  );
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
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 5v14M5 12h14" strokeLinecap="round" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M7 4.8c.9-.7 2-.7 2.7.1l1.5 1.8c.6.8.6 1.8-.1 2.5l-1 1c.8 1.6 2.2 3 3.8 3.8l1-1c.7-.7 1.7-.7 2.5-.1l1.8 1.5c.8.7.8 1.8.1 2.7l-1 1.3c-.7.9-1.8 1.3-2.9 1.1-6.3-1.1-11.1-5.9-12.2-12.2-.2-1.1.2-2.2 1.1-2.9L7 4.8Z" strokeLinecap="round" />
    </svg>
  );
}

function VideoIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3.5" y="6.5" width="12" height="11" rx="2" />
      <path d="M16 10l4-2v8l-4-2Z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 11v5" strokeLinecap="round" />
      <path d="M12 8.2h.01" strokeLinecap="round" />
    </svg>
  );
}

function PaperclipIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M13.5 6.5 7.6 12.4a3 3 0 0 0 4.2 4.2l6.4-6.4a4.5 4.5 0 1 0-6.3-6.4L5.3 10.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MicIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="9" y="4.5" width="6" height="10" rx="3" />
      <path d="M6.5 12a5.5 5.5 0 0 0 11 0" strokeLinecap="round" />
      <path d="M12 17v3.5" strokeLinecap="round" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M9 5.5h6M10 5.5l.4-1.2A1.5 1.5 0 0 1 11.8 3.5h.4a1.5 1.5 0 0 1 1.4.8l.4 1.2" strokeLinecap="round" />
      <path d="M6.5 7h11" strokeLinecap="round" />
      <path d="M8 7l.6 11a1.5 1.5 0 0 0 1.5 1.4h3.8a1.5 1.5 0 0 0 1.5-1.4L16 7" strokeLinecap="round" />
    </svg>
  );
}
