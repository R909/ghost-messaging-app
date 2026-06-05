"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import {
  GhostBackdrop,
  GhostAvatar,
  HomePage,
  SectionHeaderButton,
} from "../../components/home";

type Participant = { _id: string; username: string };

type ConversationItem = {
  _id: string;
  participants: Participant[];
  lastMessage: string;
  lastMessageAt: string;
};

type MessageItem = {
  _id: string;
  sender: Participant;
  content: string;
  seen: boolean;
  createdAt: string;
};

function formatTime(iso: string) {
  return new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(iso));
}

function formatDateLabel(iso: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(iso));
}

function isSameDay(a: string, b: string) {
  const da = new Date(a);
  const db = new Date(b);
  return (
    da.getFullYear() === db.getFullYear() &&
    da.getMonth() === db.getMonth() &&
    da.getDate() === db.getDate()
  );
}

// Suspense wrapper so useSearchParams doesn't break static generation
export default function ChatsPage() {
  return (
    <Suspense fallback={<ChatsSkeleton />}>
      <ChatsInner />
    </Suspense>
  );
}

function ChatsInner() {
  const { data: session } = useSession();
  const currentUserId = session?.user?._id ?? "";
  const searchParams = useSearchParams();

  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [draft, setDraft] = useState("");
  const [search, setSearch] = useState("");
  const [isLoadingConvs, setIsLoadingConvs] = useState(true);
  const [isLoadingMsgs, setIsLoadingMsgs] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [showNewConv, setShowNewConv] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [newConvError, setNewConvError] = useState("");
  const [newConvLoading, setNewConvLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const newConvInputRef = useRef<HTMLInputElement>(null);
  const composeRef = useRef<HTMLInputElement>(null);

  // Load conversations; auto-select from ?conversation= URL param
  useEffect(() => {
    if (!currentUserId) return;
    const paramId = searchParams?.get("conversation");
    fetch("/api/conversations")
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setConversations(data.conversations);
          if (paramId) {
            setIsLoadingMsgs(true);
            setActiveConvId(paramId);
          }
        }
        setIsLoadingConvs(false);
      })
      .catch(() => setIsLoadingConvs(false));
  }, [currentUserId, searchParams]);

  // Poll messages + conversations when active conversation changes
  useEffect(() => {
    if (pollRef.current) clearInterval(pollRef.current);
    if (!activeConvId) return;

    const convId = activeConvId;

    const pollMsgs = () =>
      fetch(`/api/conversations/${convId}/messages`)
        .then((r) => r.json())
        .then((data) => {
          if (data.success) setMessages(data.messages);
          setIsLoadingMsgs(false);
        })
        .catch(() => setIsLoadingMsgs(false));

    const pollConvs = () =>
      fetch("/api/conversations")
        .then((r) => r.json())
        .then((data) => {
          if (data.success) setConversations(data.conversations);
        })
        .catch(() => {});

    pollMsgs();
    pollRef.current = setInterval(() => {
      pollMsgs();
      pollConvs();
    }, 4000);

    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [activeConvId]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Auto-focus compose input when a conversation opens
  useEffect(() => {
    if (activeConvId) composeRef.current?.focus();
  }, [activeConvId]);

  // Auto-focus new-conv input when form opens
  useEffect(() => {
    if (showNewConv) newConvInputRef.current?.focus();
  }, [showNewConv]);

  const getOtherParticipant = (conv: ConversationItem): Participant =>
    conv.participants.find((p) => p._id !== currentUserId) ?? conv.participants[0];

  const activeConv = conversations.find((c) => c._id === activeConvId);

  const handleSelectConv = (convId: string) => {
    setMessages([]);
    setIsLoadingMsgs(true);
    setActiveConvId(convId);
    setShowNewConv(false);
  };

  const handleBack = () => {
    setActiveConvId(null);
    setMessages([]);
  };

  const handleSend = async () => {
    const content = draft.trim();
    if (!content || !activeConvId || isSending) return;

    setDraft("");
    setIsSending(true);

    const tempId = `temp-${Date.now()}`;
    const tempMsg: MessageItem = {
      _id: tempId,
      sender: { _id: currentUserId, username: session?.user?.username ?? "" },
      content,
      seen: false,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempMsg]);

    try {
      const res = await fetch(`/api/conversations/${activeConvId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      const data = await res.json();
      if (data.success) {
        setMessages((prev) =>
          prev.map((m) => (m._id === tempId ? data.message : m))
        );
        fetch("/api/conversations")
          .then((r) => r.json())
          .then((d) => {
            if (d.success) setConversations(d.conversations);
          })
          .catch(() => {});
      } else {
        setMessages((prev) => prev.filter((m) => m._id !== tempId));
        setDraft(content);
      }
    } catch {
      setMessages((prev) => prev.filter((m) => m._id !== tempId));
      setDraft(content);
    } finally {
      setIsSending(false);
    }
  };

  const handleNewConversation = async () => {
    const username = newUsername.trim();
    if (!username) return;
    setNewConvLoading(true);
    setNewConvError("");
    try {
      const res = await fetch("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      });
      const data = await res.json();
      if (!data.success) {
        setNewConvError(data.message ?? "User not found");
        return;
      }
      const convRes = await fetch("/api/conversations");
      const convData = await convRes.json();
      if (convData.success) setConversations(convData.conversations);
      handleSelectConv(data.conversation._id);
      setNewUsername("");
    } catch {
      setNewConvError("Something went wrong");
    } finally {
      setNewConvLoading(false);
    }
  };

  const filteredConvs = conversations.filter((c) => {
    const other = getOtherParticipant(c);
    return (
      other.username.toLowerCase().includes(search.toLowerCase()) ||
      (c.lastMessage ?? "").toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <HomePage active="chats">
      <div className="relative flex h-full flex-1 flex-col overflow-hidden bg-[#11101a]/90 lg:flex-row">
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes bubble3D {
            0% { transform: scale(0.92) translateY(15px); opacity: 0; }
            100% { transform: scale(1) translateY(0); opacity: 1; }
          }
          .animate-bubble-3d { animation: bubble3D 0.35s cubic-bezier(0.23,1,0.32,1) forwards; }
        ` }} />

        <GhostBackdrop
          src="/ghost-1.png"
          alt="Chat backdrop"
          className="animate-float-slow"
          imageClassName="opacity-[0.12] scale-110"
        />
        <GhostBackdrop
          src="/ghost-2.png"
          alt="Thread backdrop"
          className="hidden lg:block animate-drift"
          imageClassName="opacity-[0.08] translate-x-1/4 translate-y-10 scale-[1.15] blur-[1px]"
        />

        {/* Conversation sidebar — hidden on mobile when a chat is open */}
        <section
          className={[
            "relative z-10 flex flex-col border-white/10 bg-black/10 backdrop-blur-md",
            "p-4 sm:p-5 lg:max-w-[350px] lg:border-r",
            activeConvId ? "hidden lg:flex" : "flex flex-1 border-b lg:border-b-0",
          ].join(" ")}
        >
          <div className="flex items-center justify-between px-1 pb-4">
            <h1 className="text-2xl font-semibold tracking-tight text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]">
              Messages
            </h1>
            <SectionHeaderButton onClick={() => setShowNewConv((v) => !v)}>
              <ComposeIcon />
            </SectionHeaderButton>
          </div>

          <label className="mb-3 flex items-center gap-3 rounded-2xl border border-white/8 bg-white/[0.04] px-4 py-3 text-white/45 transition-all duration-300 focus-within:border-violet-500/40 focus-within:bg-white/[0.06] focus-within:shadow-[0_0_15px_rgba(168,85,247,0.1)]">
            <SearchIcon />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search messages"
              className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/35"
            />
          </label>

          <div className="flex-1 space-y-2 overflow-y-auto pr-1">
            {isLoadingConvs ? (
              <div className="flex flex-col gap-2 pt-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="flex animate-pulse items-center gap-3 rounded-[1.4rem] border border-white/5 px-4 py-3"
                  >
                    <div className="h-11 w-11 shrink-0 rounded-2xl bg-white/5" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 w-24 rounded bg-white/5" />
                      <div className="h-2.5 w-36 rounded bg-white/5" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredConvs.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
                <div className="text-4xl opacity-40">👻</div>
                <p className="text-sm text-white/30">No conversations yet.</p>
                <p className="text-xs text-white/20">
                  {search ? "No results — try a different search." : "Start one below."}
                </p>
              </div>
            ) : (
              filteredConvs.map((conv) => {
                const other = getOtherParticipant(conv);
                const isActive = conv._id === activeConvId;
                return (
                  <button
                    key={conv._id}
                    onClick={() => handleSelectConv(conv._id)}
                    className={[
                      "flex w-full items-center gap-3 rounded-[1.4rem] border px-4 py-3 text-left transition-all duration-300 active:scale-[0.98]",
                      isActive
                        ? "border-violet-400/30 bg-[linear-gradient(135deg,rgba(139,92,246,0.2),rgba(20,15,38,0.8))] shadow-[0_10px_25px_rgba(139,92,246,0.15)]"
                        : "border-transparent bg-transparent hover:border-white/8 hover:bg-white/[0.02]",
                    ].join(" ")}
                  >
                    <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/5 ring-1 ring-white/10">
                      <GhostAvatar />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate text-sm font-medium text-white">
                          {other.username}
                        </p>
                        <span className="shrink-0 text-xs text-white/40">
                          {conv.lastMessageAt ? formatTime(conv.lastMessageAt) : ""}
                        </span>
                      </div>
                      <p className="mt-0.5 truncate text-xs text-white/50">
                        {conv.lastMessage || "No messages yet"}
                      </p>
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* New conversation form */}
          {showNewConv ? (
            <div className="mt-3 space-y-2">
              <input
                ref={newConvInputRef}
                value={newUsername}
                onChange={(e) => {
                  setNewUsername(e.target.value);
                  setNewConvError("");
                }}
                onKeyDown={(e) => e.key === "Enter" && handleNewConversation()}
                placeholder="Enter username..."
                className="w-full rounded-xl border border-violet-400/30 bg-black/30 px-4 py-2.5 text-sm text-white outline-none placeholder:text-white/30 focus:border-violet-400/60"
              />
              {newConvError && (
                <p className="px-1 text-xs text-red-400">{newConvError}</p>
              )}
              <div className="flex gap-2">
                <button
                  onClick={handleNewConversation}
                  disabled={newConvLoading || !newUsername.trim()}
                  className="flex-1 rounded-xl bg-gradient-to-br from-[#b06cff] to-[#7d3cff] py-2 text-sm font-medium text-white transition-all hover:brightness-110 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {newConvLoading ? <LoadingDots /> : "Start Chat"}
                </button>
                <button
                  onClick={() => {
                    setShowNewConv(false);
                    setNewUsername("");
                    setNewConvError("");
                  }}
                  className="rounded-xl border border-white/10 px-3 py-2 text-sm text-white/50 transition-colors hover:text-white/80"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowNewConv(true)}
              className="mt-3 flex items-center justify-center gap-2 rounded-xl border border-violet-400/30 bg-violet-500/10 px-4 py-2.5 text-sm font-medium text-violet-200 transition-all duration-200 hover:bg-violet-500/20 active:scale-95"
            >
              <PlusIcon /> New Message
            </button>
          )}
        </section>

        {/* Message thread panel — hidden on mobile when no conversation selected */}
        <section
          className={[
            "relative z-10 flex flex-col overflow-hidden border border-white/12 shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_30px_90px_rgba(0,0,0,0.45)] backdrop-blur-3xl m-3 rounded-[2.2rem] bg-white/[0.015]",
            activeConvId ? "flex flex-1" : "hidden lg:flex lg:flex-1",
          ].join(" ")}
        >
          <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_15%,rgba(255,255,255,0.06),transparent_30%),radial-gradient(circle_at_80%_20%,rgba(168,85,247,0.12),transparent_25%)]" />
          </div>

          {!activeConvId ? (
            <div className="relative z-10 flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
              <div className="text-6xl opacity-20">👻</div>
              <p className="text-lg font-medium text-white/30">Select a conversation</p>
              <p className="text-sm text-white/20">
                or start a new one to begin messaging anonymously
              </p>
            </div>
          ) : (
            <>
              {/* Header */}
              <header className="relative z-10 flex items-center justify-between gap-4 border-b border-white/10 bg-white/[0.02] px-4 py-4 sm:px-6">
                <div className="flex items-center gap-3">
                  {/* Back button — mobile only */}
                  <button
                    onClick={handleBack}
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/8 bg-white/[0.03] text-white/50 transition-colors hover:text-white/80 lg:hidden"
                    aria-label="Back to conversations"
                  >
                    <BackIcon />
                  </button>

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/5 ring-1 ring-white/10">
                    <GhostAvatar />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">
                      {activeConv ? getOtherParticipant(activeConv).username : ""}
                    </p>
                    <div className="mt-0.5 flex items-center gap-1.5 text-xs text-white/50">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.6)]" />
                      Secured Pipeline
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
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

              {/* Messages */}
              <div className="relative z-10 flex-1 space-y-4 overflow-y-auto p-4 sm:p-6">
                {isLoadingMsgs ? (
                  <div className="flex flex-col gap-4 pt-4">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className={`flex animate-pulse items-end gap-3 ${i % 2 === 0 ? "justify-end" : ""}`}
                      >
                        {i % 2 !== 0 && (
                          <div className="h-9 w-9 shrink-0 rounded-xl bg-white/5" />
                        )}
                        <div
                          className={`h-10 rounded-[1.4rem] bg-white/5 ${i % 2 === 0 ? "w-48" : "w-56"}`}
                        />
                      </div>
                    ))}
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex flex-1 flex-col items-center justify-center gap-2 py-12 text-center">
                    <div className="mx-auto w-fit rounded-full border border-white/8 bg-white/[0.04] px-4 py-2 text-xs text-white/40">
                      Channel opened — say hello 👋
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="mx-auto w-fit rounded-full border border-white/8 bg-white/[0.04] px-3 py-1 text-[11px] text-white/45">
                      Channel with{" "}
                      {activeConv ? getOtherParticipant(activeConv).username : ""}
                    </div>
                    {messages.map((msg, index) => {
                      const isOwn = msg.sender._id === currentUserId;
                      const prevMsg = messages[index - 1];
                      const showDate =
                        !prevMsg || !isSameDay(prevMsg.createdAt, msg.createdAt);
                      return (
                        <div key={msg._id} className="animate-bubble-3d">
                          {showDate && (
                            <div className="mx-auto mb-2 w-fit rounded-full border border-white/8 bg-white/[0.04] px-3 py-1 text-[11px] text-white/45">
                              {formatDateLabel(msg.createdAt)}
                            </div>
                          )}
                          <div
                            className={`flex items-end gap-3 ${isOwn ? "justify-end" : "justify-start"}`}
                          >
                            {!isOwn && (
                              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/5 ring-1 ring-white/10">
                                <GhostAvatar size="sm" />
                              </div>
                            )}
                            <div
                              className={[
                                "max-w-[75%] rounded-[1.4rem] border px-4 py-2.5 shadow-lg transition-all duration-300",
                                isOwn
                                  ? "border-violet-400/20 bg-[linear-gradient(180deg,rgba(139,92,246,0.7),rgba(91,33,182,0.85))] text-white"
                                  : "border-white/6 bg-white/[0.04] text-white/90",
                                msg._id.startsWith("temp-") ? "opacity-60" : "",
                              ].join(" ")}
                            >
                              <p className="text-sm leading-relaxed">{msg.content}</p>
                              <div
                                className={`mt-1.5 flex items-center gap-1.5 text-[10px] ${isOwn ? "justify-end text-white/60" : "text-white/40"}`}
                              >
                                <span>{formatTime(msg.createdAt)}</span>
                                {isOwn && msg.seen && (
                                  <span className="text-violet-300">✓✓</span>
                                )}
                                {isOwn &&
                                  !msg.seen &&
                                  !msg._id.startsWith("temp-") && (
                                    <span className="text-white/30">✓</span>
                                  )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>

              {/* Compose */}
              <footer className="relative z-10 border-t border-white/10 bg-white/[0.01] p-4">
                <div className="flex items-center gap-3">
                  <div className="flex flex-1 items-center gap-3 rounded-xl border border-white/8 bg-black/30 px-4 py-2.5 transition-colors focus-within:border-violet-500/40">
                    <input
                      ref={composeRef}
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      onKeyDown={(e) =>
                        e.key === "Enter" && !e.shiftKey && handleSend()
                      }
                      placeholder="Transmit encrypted payload..."
                      className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/25"
                    />
                    <button className="text-white/40 transition-colors hover:text-violet-400">
                      <PaperclipIcon />
                    </button>
                    <button className="text-white/40 transition-colors hover:text-violet-400">
                      <MicIcon />
                    </button>
                  </div>
                  <button
                    onClick={handleSend}
                    disabled={!draft.trim() || isSending}
                    className="rounded-xl bg-gradient-to-br from-[#b06cff] to-[#7d3cff] px-5 py-2.5 text-sm font-medium text-white shadow-md transition-all hover:brightness-110 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isSending ? <LoadingDots /> : "Send"}
                  </button>
                </div>
              </footer>
            </>
          )}
        </section>
      </div>
    </HomePage>
  );
}

function ChatsSkeleton() {
  return (
    <HomePage active="chats">
      <div className="flex h-full flex-1 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-violet-400/20 border-t-violet-400/70" />
      </div>
    </HomePage>
  );
}

function ComposeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M14.5 5.5h4a2 2 0 0 1 2 2v4M10 14l7-7M9 7h-2a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-2" strokeLinecap="round" />
    </svg>
  );
}
function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8">
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
function BackIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
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
function LoadingDots() {
  return (
    <span className="flex items-center justify-center gap-0.5">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          style={{ animationDelay: `${i * 150}ms` }}
          className="h-1 w-1 rounded-full bg-current animate-bounce-dot"
        />
      ))}
    </span>
  );
}
