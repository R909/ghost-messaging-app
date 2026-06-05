"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { GhostBackdrop, GhostAvatar, HomePage } from "../../components/home";

interface Contact {
  _id: string;
  username: string;
  isAcceptingMessages: boolean;
  isVerified: boolean;
}

type TabView = "contacts" | "search";

export default function ContactsPage() {
  const router = useRouter();

  const [contacts, setContacts] = useState<Contact[]>([]);
  const [contactsLoading, setContactsLoading] = useState(true);

  const [tab, setTab] = useState<TabView>("contacts");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Contact[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState("");

  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - rect.left - rect.width / 2;
    const mouseY = e.clientY - rect.top - rect.height / 2;
    setRotateX(-((mouseY / rect.height) * 3));
    setRotateY((mouseX / rect.width) * 3);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  const fetchContacts = useCallback(async () => {
    setContactsLoading(true);
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

  const handleMessage = async (username: string, userId: string) => {
    setActionLoadingId(userId);
    try {
      const res = await fetch("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      });
      const data = await res.json();
      if (data.success && data.conversation?._id) {
        router.push(`/dashboard/chats?conversation=${data.conversation._id}`);
      }
    } finally {
      setActionLoadingId(null);
    }
  };

  const displayList: Contact[] = tab === "contacts" ? contacts : searchResults;

  return (
    <HomePage active="contacts">
      <div
        style={{ perspective: "1200px" }}
        className="relative flex h-full flex-1 items-center justify-center overflow-hidden p-4 sm:p-6"
      >
        {/* Ambient glows */}
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

        {/* 3D glass card */}
        <div
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{
            transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
            transformStyle: "preserve-3d",
            transition: "transform 0.15s ease-out",
          }}
          className="relative z-10 w-full max-w-4xl rounded-[2.2rem] border border-white/12 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] p-6 sm:p-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_35px_80px_rgba(0,0,0,0.45)] backdrop-blur-2xl animate-slide-up-fade"
        >
          {/* Header */}
          <div style={{ transform: "translateZ(30px)" }}>
            <h1 className="text-3xl font-semibold tracking-tight text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.15)]">
              Contacts
            </h1>
            <p className="mt-1.5 max-w-2xl text-sm leading-6 text-white/55">
              Your ghost network. Message anyone or search for new phantoms to connect with.
            </p>
          </div>

          {/* Tabs */}
          <div style={{ transform: "translateZ(25px)" }} className="mt-6 flex gap-2">
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
                  "rounded-xl px-5 py-2 text-sm font-medium transition-all duration-200",
                  tab === t
                    ? "border border-violet-400/30 bg-gradient-to-r from-violet-500/15 to-fuchsia-500/15 text-violet-200 shadow-[0_0_16px_rgba(168,85,247,0.2)]"
                    : "border border-white/6 bg-white/[0.02] text-white/40 hover:border-white/12 hover:text-white/70",
                ].join(" ")}
              >
                {t === "contacts" ? "My Contacts" : "Find Ghosts"}
              </button>
            ))}
          </div>

          {/* Search bar (visible only on search tab) */}
          {tab === "search" && (
            <form
              onSubmit={handleSearch}
              style={{ transform: "translateZ(22px)" }}
              className="mt-5 flex gap-3"
            >
              <div className="relative flex-1">
                <SearchIcon />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by username…"
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.04] py-3 pl-10 pr-4 text-sm text-white placeholder-white/30 outline-none transition-all duration-200 focus:border-violet-400/40 focus:bg-white/[0.07] focus:shadow-[0_0_0_3px_rgba(168,85,247,0.12)]"
                />
              </div>
              <button
                type="submit"
                disabled={searchQuery.trim().length < 2 || searchLoading}
                className="rounded-2xl border border-violet-400/30 bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 px-5 py-3 text-sm font-medium text-violet-200 transition-all duration-200 hover:from-violet-500/30 hover:to-fuchsia-500/30 hover:shadow-[0_0_20px_rgba(168,85,247,0.25)] disabled:cursor-not-allowed disabled:opacity-40"
              >
                {searchLoading ? <LoadingDots /> : "Search"}
              </button>
            </form>
          )}

          {/* List */}
          <div className="mt-6" style={{ transformStyle: "preserve-3d" }}>
            {/* Loading state */}
            {((tab === "contacts" && contactsLoading) || (tab === "search" && searchLoading)) && (
              <div className="flex flex-col items-center gap-3 py-16 text-white/40">
                <GhostSpinner />
                <p className="text-sm">{tab === "contacts" ? "Loading your contacts…" : "Searching…"}</p>
              </div>
            )}

            {/* Error */}
            {tab === "search" && searchError && !searchLoading && (
              <p className="py-10 text-center text-sm text-white/40">{searchError}</p>
            )}

            {/* Empty contacts */}
            {tab === "contacts" && !contactsLoading && contacts.length === 0 && (
              <div className="flex flex-col items-center gap-3 py-16 text-white/40">
                <GhostAvatar size="md" />
                <p className="text-sm">No contacts yet. Start a conversation to add ghosts here.</p>
              </div>
            )}

            {/* Contact / result cards */}
            {!contactsLoading && !searchLoading && displayList.length > 0 && (
              <div className="grid gap-3 sm:grid-cols-2">
                {displayList.map((contact, index) => (
                  <ContactCard
                    key={contact._id}
                    contact={contact}
                    index={index}
                    loading={actionLoadingId === contact._id}
                    onMessage={() => handleMessage(contact.username, contact._id)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </HomePage>
  );
}

function ContactCard({
  contact,
  index,
  loading,
  onMessage,
}: {
  contact: Contact;
  index: number;
  loading: boolean;
  onMessage: () => void;
}) {
  return (
    <div
      style={{
        animationDelay: `${index * 60 + 200}ms`,
        transform: "translateZ(15px)",
      }}
      className="group flex items-center justify-between rounded-[1.6rem] border border-white/8 bg-white/[0.02] p-4 transition-all duration-300 hover:scale-[1.02] hover:border-violet-400/30 hover:bg-[linear-gradient(135deg,rgba(168,85,247,0.1),rgba(255,255,255,0.03))] hover:shadow-[0_12px_30px_rgba(139,92,246,0.13)] animate-slide-up-fade"
    >
      <div className="flex items-center gap-3.5">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 ring-1 ring-white/10 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
          <GhostAvatar size="sm" />
        </div>
        <div>
          <p className="font-medium text-white transition-colors group-hover:text-violet-200">
            {contact.username}
          </p>
          <div className="mt-0.5 flex items-center gap-2">
            {contact.isVerified && (
              <span className="flex items-center gap-1 text-[11px] text-emerald-400/80">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.6)]" />
                Verified
              </span>
            )}
            <span
              className={[
                "text-[11px]",
                contact.isAcceptingMessages ? "text-violet-300/70" : "text-white/30",
              ].join(" ")}
            >
              {contact.isAcceptingMessages ? "Accepting messages" : "Not accepting"}
            </span>
          </div>
        </div>
      </div>

      <button
        onClick={onMessage}
        disabled={loading}
        className="flex items-center gap-1.5 rounded-xl border border-violet-400/20 bg-violet-500/10 px-3.5 py-2 text-xs font-medium text-violet-300 transition-all duration-200 hover:border-violet-400/40 hover:bg-violet-500/20 hover:shadow-[0_0_14px_rgba(168,85,247,0.2)] active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? <LoadingDots /> : (
          <>
            <MessageIcon />
            Message
          </>
        )}
      </button>
    </div>
  );
}

function SearchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
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

function GhostSpinner() {
  return (
    <div className="relative h-10 w-10 animate-spin rounded-full border-2 border-violet-400/20 border-t-violet-400/70" />
  );
}

function LoadingDots() {
  return (
    <span className="flex items-center gap-0.5">
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
