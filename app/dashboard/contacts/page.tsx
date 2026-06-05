"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useSession } from "next-auth/react";
import { GhostBackdrop, GhostAvatar, HomePage } from "../../components/home";

interface Contact {
  _id: string;
  username: string;
  isAcceptingMessages: boolean;
  isVerified: boolean;
}

type MessageItem = {
  _id: string;
  sender: { _id: string; username: string };
  content: string;
  seen: boolean;
  createdAt: string;
};

type TabView = "contacts" | "search";

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

export default function ContactsPage() {
  const { data: session } = useSession();
  const currentUserId = session?.user?._id ?? "";

  const [contacts, setContacts] = useState<Contact[]>([]);
  const [contactsLoading, setContactsLoading] = useState(true);

  const [tab, setTab] = useState<TabView>("contacts");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Contact[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState("");

  // Chat state
  const [activeContact, setActiveContact] = useState<Contact | null>(null);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [draft, setDraft] = useState("");
  const [isLoadingMsgs, setIsLoadingMsgs] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [openingConvId, setOpeningConvId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchContacts = useCallback(async () => {
    try {
      const res = await fetch("/api/contacts");
      const data = await res.json();
      if (data.success) setContacts(data.contacts);
    } finally {
      setContactsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  // Start/stop polling when active conversation changes
  useEffect(() => {
    if (pollRef.current) clearInterval(pollRef.current);
    if (!activeConvId) return;

    const convId = activeConvId;
    const poll = () =>
      fetch(`/api/conversations/${convId}/messages`)
        .then((r) => r.json())
        .then((data) => {
          if (data.success) setMessages(data.messages);
          setIsLoadingMsgs(false);
        })
        .catch(() => setIsLoadingMsgs(false));

    poll();
    pollRef.current = setInterval(poll, 4000);

    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [activeConvId]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim().length < 2) return;
    setSearchLoading(true);
    setSearchError("");
    setSearchResults([]);
    try {
      const res = await fetch("/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: searchQuery }),
      });
      const data = await res.json();
      if (data.success) {
        setSearchResults(data.users);
        if (data.users.length === 0) setSearchError("No users found.");
      } else {
        setSearchError(data.message ?? "Search failed.");
      }
    } catch {
      setSearchError("Something went wrong. Please try again.");
    } finally {
      setSearchLoading(false);
    }
  };

  const handleOpenChat = async (contact: Contact) => {
    setOpeningConvId(contact._id);
    try {
      const res = await fetch("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: contact.username }),
      });
      const data = await res.json();
      if (data.success && data.conversation?._id) {
        setActiveContact(contact);
        setMessages([]);
        setActiveConvId(data.conversation._id);
      }
    } finally {
      setOpeningConvId(null);
    }
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
        setMessages((prev) => prev.map((m) => (m._id === tempId ? data.message : m)));
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

  const displayList: Contact[] = tab === "contacts" ? contacts : searchResults;

  return (
    <HomePage active="contacts">
      <div className="relative flex h-full flex-1 overflow-hidden lg:flex-row">
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes bubble3D {
            0% { transform: scale(0.92) translateY(15px); opacity: 0; }
            100% { transform: scale(1) translateY(0); opacity: 1; }
          }
          .animate-bubble-3d { animation: bubble3D 0.35s cubic-bezier(0.23,1,0.32,1) forwards; }
        ` }} />

        <GhostBackdrop
          src="/ghost-3.png"
          alt="Floating ghost behind the contacts page"
          className="animate-pulse-soft"
          imageClassName="opacity-[0.08] scale-110"
        />

        {/* Left panel — contacts list */}
        <section className="relative z-10 flex w-full flex-col border-b border-white/10 bg-black/10 p-4 backdrop-blur-md sm:p-5 lg:max-w-[360px] lg:border-b-0 lg:border-r">
          {/* Header */}
          <div className="mb-5 px-1">
            <h1 className="text-2xl font-semibold tracking-tight text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.15)]">
              Contacts
            </h1>
            <p className="mt-1 text-xs text-white/45">
              Your ghost network. Click Message to open a chat.
            </p>
          </div>

          {/* Tabs */}
          <div className="mb-4 flex gap-2">
            {(["contacts", "search"] as TabView[]).map((t) => (
              <button
                key={t}
                onClick={() => {
                  setTab(t);
                  setSearchError("");
                  setSearchResults([]);
                  setSearchQuery("");
                }}
                className={[
                  "rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200",
                  tab === t
                    ? "border border-violet-400/30 bg-gradient-to-r from-violet-500/15 to-fuchsia-500/15 text-violet-200 shadow-[0_0_16px_rgba(168,85,247,0.2)]"
                    : "border border-white/6 bg-white/[0.02] text-white/40 hover:border-white/12 hover:text-white/70",
                ].join(" ")}
              >
                {t === "contacts" ? "My Contacts" : "Find Ghosts"}
              </button>
            ))}
          </div>

          {/* Search bar */}
          {tab === "search" && (
            <form onSubmit={handleSearch} className="mb-4 flex gap-2">
              <div className="relative flex-1">
                <SearchIcon />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by username…"
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.04] py-2.5 pl-9 pr-4 text-sm text-white placeholder-white/30 outline-none transition-all duration-200 focus:border-violet-400/40 focus:bg-white/[0.07]"
                />
              </div>
              <button
                type="submit"
                disabled={searchQuery.trim().length < 2 || searchLoading}
                className="rounded-2xl border border-violet-400/30 bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 px-4 py-2 text-sm font-medium text-violet-200 transition-all hover:from-violet-500/30 hover:to-fuchsia-500/30 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {searchLoading ? <LoadingDots /> : "Search"}
              </button>
            </form>
          )}

          {/* List */}
          <div className="flex-1 space-y-2 overflow-y-auto pr-1">
            {((tab === "contacts" && contactsLoading) || (tab === "search" && searchLoading)) && (
              <div className="flex flex-col items-center gap-3 py-12 text-white/40">
                <GhostSpinner />
                <p className="text-sm">{tab === "contacts" ? "Loading contacts…" : "Searching…"}</p>
              </div>
            )}

            {tab === "search" && searchError && !searchLoading && (
              <p className="py-8 text-center text-sm text-white/40">{searchError}</p>
            )}

            {tab === "contacts" && !contactsLoading && contacts.length === 0 && (
              <div className="flex flex-col items-center gap-3 py-12 text-white/40">
                <GhostAvatar size="md" />
                <p className="text-center text-sm">
                  No contacts yet. Use &quot;Find Ghosts&quot; to connect.
                </p>
              </div>
            )}

            {!contactsLoading && !searchLoading && displayList.length > 0 &&
              displayList.map((contact, index) => (
                <ContactRow
                  key={contact._id}
                  contact={contact}
                  index={index}
                  isActive={activeContact?._id === contact._id}
                  loading={openingConvId === contact._id}
                  onMessage={() => handleOpenChat(contact)}
                />
              ))
            }
          </div>
        </section>

        {/* Right panel — chat */}
        <section className="relative z-10 m-3 flex flex-1 flex-col overflow-hidden rounded-[2.2rem] border border-white/12 bg-white/[0.015] shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_30px_90px_rgba(0,0,0,0.45)] backdrop-blur-3xl">
          <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_15%,rgba(255,255,255,0.06),transparent_30%),radial-gradient(circle_at_80%_20%,rgba(168,85,247,0.12),transparent_25%)]" />
          </div>

          {!activeContact ? (
            <div className="relative z-10 flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
              <div className="text-6xl opacity-20">👻</div>
              <p className="text-lg font-medium text-white/30">Select a contact to chat</p>
              <p className="text-sm text-white/20">Click &quot;Message&quot; on any contact to open a conversation</p>
            </div>
          ) : (
            <>
              {/* Chat header */}
              <header className="relative z-10 flex items-center gap-3 border-b border-white/10 bg-white/[0.02] px-6 py-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/5 ring-1 ring-white/10">
                  <GhostAvatar />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{activeContact.username}</p>
                  <div className="mt-0.5 flex items-center gap-1.5 text-xs text-white/50">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.6)]" />
                    Secured Pipeline
                    {activeContact.isVerified && (
                      <span className="ml-1 text-emerald-400/80">· Verified</span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => { setActiveContact(null); setActiveConvId(null); setMessages([]); }}
                  className="ml-auto rounded-xl border border-white/8 bg-white/[0.03] p-2 text-white/40 transition-colors hover:border-white/15 hover:text-white/70"
                  aria-label="Close chat"
                >
                  <CloseIcon />
                </button>
              </header>

              {/* Messages */}
              <div className="relative z-10 flex-1 space-y-4 overflow-y-auto p-6">
                {isLoadingMsgs ? (
                  <div className="flex flex-col gap-4 pt-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className={`flex animate-pulse items-end gap-3 ${i % 2 === 0 ? "justify-end" : ""}`}>
                        {i % 2 !== 0 && <div className="h-9 w-9 shrink-0 rounded-xl bg-white/5" />}
                        <div className={`h-10 rounded-[1.4rem] bg-white/5 ${i % 2 === 0 ? "w-48" : "w-56"}`} />
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
                      Channel with {activeContact.username}
                    </div>
                    {messages.map((msg, index) => {
                      const isOwn = msg.sender._id === currentUserId;
                      const prevMsg = messages[index - 1];
                      const showDate = !prevMsg || !isSameDay(prevMsg.createdAt, msg.createdAt);
                      return (
                        <div key={msg._id} className="animate-bubble-3d">
                          {showDate && (
                            <div className="mx-auto mb-2 w-fit rounded-full border border-white/8 bg-white/[0.04] px-3 py-1 text-[11px] text-white/45">
                              {formatDateLabel(msg.createdAt)}
                            </div>
                          )}
                          <div className={`flex items-end gap-3 ${isOwn ? "justify-end" : "justify-start"}`}>
                            {!isOwn && (
                              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/5 ring-1 ring-white/10">
                                <GhostAvatar size="sm" />
                              </div>
                            )}
                            <div className={[
                              "max-w-[75%] rounded-[1.4rem] border px-4 py-2.5 shadow-lg transition-all duration-300",
                              isOwn
                                ? "border-violet-400/20 bg-[linear-gradient(180deg,rgba(139,92,246,0.7),rgba(91,33,182,0.85))] text-white"
                                : "border-white/6 bg-white/[0.04] text-white/90",
                              msg._id.startsWith("temp-") ? "opacity-60" : "",
                            ].join(" ")}>
                              <p className="text-sm leading-relaxed">{msg.content}</p>
                              <div className={`mt-1.5 flex items-center gap-1.5 text-[10px] ${isOwn ? "justify-end text-white/60" : "text-white/40"}`}>
                                <span>{formatTime(msg.createdAt)}</span>
                                {isOwn && msg.seen && <span className="text-violet-300">✓✓</span>}
                                {isOwn && !msg.seen && !msg._id.startsWith("temp-") && <span className="text-white/30">✓</span>}
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
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                      placeholder="Transmit encrypted payload..."
                      className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/25"
                    />
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

function ContactRow({
  contact,
  index,
  isActive,
  loading,
  onMessage,
}: {
  contact: Contact;
  index: number;
  isActive: boolean;
  loading: boolean;
  onMessage: () => void;
}) {
  return (
    <div
      style={{ animationDelay: `${index * 60 + 200}ms` }}
      className={[
        "group flex items-center justify-between rounded-[1.4rem] border p-3.5 transition-all duration-300 animate-slide-up-fade",
        isActive
          ? "border-violet-400/30 bg-[linear-gradient(135deg,rgba(139,92,246,0.2),rgba(20,15,38,0.8))] shadow-[0_10px_25px_rgba(139,92,246,0.15)]"
          : "border-white/8 bg-white/[0.02] hover:scale-[1.01] hover:border-violet-400/20 hover:bg-[linear-gradient(135deg,rgba(168,85,247,0.08),rgba(255,255,255,0.02))]",
      ].join(" ")}
    >
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/5 ring-1 ring-white/10 transition-transform duration-300 group-hover:scale-110">
          <GhostAvatar size="sm" />
        </div>
        <div>
          <p className="text-sm font-medium text-white transition-colors group-hover:text-violet-200">
            {contact.username}
          </p>
          <div className="mt-0.5 flex items-center gap-2">
            {contact.isVerified && (
              <span className="flex items-center gap-1 text-[11px] text-emerald-400/80">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.6)]" />
                Verified
              </span>
            )}
            <span className={["text-[11px]", contact.isAcceptingMessages ? "text-violet-300/70" : "text-white/30"].join(" ")}>
              {contact.isAcceptingMessages ? "Accepting msgs" : "Not accepting"}
            </span>
          </div>
        </div>
      </div>

      <button
        onClick={onMessage}
        disabled={loading}
        className="flex items-center gap-1.5 rounded-xl border border-violet-400/20 bg-violet-500/10 px-3 py-1.5 text-xs font-medium text-violet-300 transition-all duration-200 hover:border-violet-400/40 hover:bg-violet-500/20 hover:shadow-[0_0_14px_rgba(168,85,247,0.2)] active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? <LoadingDots /> : (
          <>
            <MessageIcon />
            {isActive ? "Active" : "Message"}
          </>
        )}
      </button>
    </div>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="11" cy="11" r="7" />
      <path d="m16.5 16.5 4 4" strokeLinecap="round" />
    </svg>
  );
}

function MessageIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M7 8.5h10M7 12h6" strokeLinecap="round" />
      <path d="M5.5 4.5h13a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H10l-4.5 3v-3H5.5a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2Z" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
    </svg>
  );
}

function GhostSpinner() {
  return <div className="relative h-10 w-10 animate-spin rounded-full border-2 border-violet-400/20 border-t-violet-400/70" />;
}

function LoadingDots() {
  return (
    <span className="flex items-center gap-0.5">
      {[0, 1, 2].map((i) => (
        <span key={i} style={{ animationDelay: `${i * 150}ms` }} className="h-1 w-1 rounded-full bg-current animate-bounce-dot" />
      ))}
    </span>
  );
}
