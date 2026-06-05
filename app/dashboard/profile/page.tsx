"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { GhostBackdrop, GhostAvatar, HomePage } from "../../components/home";

type Profile = {
  username: string;
  email: string;
  isAcceptingMessages: boolean;
  isVerified: boolean;
  createdAt: string;
};

type Stats = {
  conversations: number;
  messagesSent: number;
};

function memberSince(iso: string) {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(iso));
}

function daysSince(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  return Math.max(1, Math.floor(diff / (1000 * 60 * 60 * 24)));
}

export default function ProfilePage() {
  const { data: session, update: updateSession } = useSession();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [toggling, setToggling] = useState(false);
  const [copied, setCopied] = useState(false);

  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  useEffect(() => {
    if (!session?.user?._id) return;
    fetch("/api/profile")
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setProfile(data.profile);
          setStats(data.stats);
        }
      })
      .finally(() => setIsLoading(false));
  }, [session?.user?._id]);

  const handleToggleMessages = async () => {
    if (!profile || toggling) return;
    setToggling(true);
    const next = !profile.isAcceptingMessages;
    setProfile((p) => p ? { ...p, isAcceptingMessages: next } : p);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isAcceptingMessages: next }),
      });
      if (res.ok) {
        await updateSession({ isAcceptingMessages: next });
      } else {
        setProfile((p) => p ? { ...p, isAcceptingMessages: !next } : p);
      }
    } catch {
      setProfile((p) => p ? { ...p, isAcceptingMessages: !next } : p);
    } finally {
      setToggling(false);
    }
  };

  const ghostLink = typeof window !== "undefined"
    ? `${window.location.origin}/u/${profile?.username ?? ""}`
    : "";

  const handleCopyLink = () => {
    if (!ghostLink) return;
    navigator.clipboard.writeText(ghostLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setRotateX(-((e.clientY - rect.top - rect.height / 2) / rect.height) * 3);
    setRotateY(((e.clientX - rect.left - rect.width / 2) / rect.width) * 3);
  };

  const Skeleton = ({ w, h = "h-4" }: { w: string; h?: string }) => (
    <div className={`${h} ${w} animate-pulse rounded-lg bg-white/8`} />
  );

  return (
    <HomePage active="profile">
      <div
        style={{ perspective: "1500px" }}
        className="relative flex h-full flex-1 items-start justify-center overflow-y-auto p-4 sm:p-6"
      >
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(168,85,247,0.14),transparent_24%),radial-gradient(circle_at_82%_24%,rgba(124,58,237,0.1),transparent_22%)]" />
          <div className="absolute left-[-5rem] top-[8%] h-60 w-60 rounded-full bg-[radial-gradient(circle,rgba(192,132,252,0.22),transparent_68%)] blur-3xl animate-float-slow" />
          <div className="absolute right-[-4rem] bottom-[-5rem] h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(124,58,237,0.22),transparent_68%)] blur-3xl animate-drift" />
        </div>

        <GhostBackdrop src="/ghost-2.png" alt="Ghost profile backdrop" className="animate-drift" imageClassName="opacity-[0.11] scale-110" />

        <div
          onMouseMove={handleMouseMove}
          onMouseLeave={() => { setRotateX(0); setRotateY(0); }}
          style={{ transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`, transformStyle: "preserve-3d", transition: "transform 0.15s ease-out" }}
          className="relative z-10 my-4 w-full max-w-4xl rounded-[2.2rem] border border-white/12 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.025))] p-6 sm:p-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_30px_90px_rgba(0,0,0,0.4)] backdrop-blur-2xl"
        >

          <div style={{ transform: "translateZ(35px)" }} className="flex flex-col gap-5 border-b border-white/10 pb-7 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-5">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-white/5 ring-1 ring-white/15 shadow-[0_10px_30px_rgba(168,85,247,0.15)]">
                <GhostAvatar size="md" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] uppercase tracking-[0.3em] text-violet-300 font-semibold">Identity Core</p>
                {isLoading ? (
                  <Skeleton w="w-36" h="h-7" />
                ) : (
                  <h1 className="mt-1 text-3xl font-semibold tracking-tight text-white drop-shadow-[0_0_15px_rgba(168,85,247,0.25)]">
                    @{profile?.username}
                  </h1>
                )}
                {isLoading ? (
                  <Skeleton w="w-44" />
                ) : (
                  <p className="mt-1.5 truncate text-sm text-white/45">{profile?.email}</p>
                )}
                <div className="mt-2 flex items-center gap-2">
                  {isLoading ? (
                    <Skeleton w="w-20" h="h-5" />
                  ) : profile?.isVerified ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-0.5 text-[11px] font-medium text-emerald-300">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
                      Verified
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/20 bg-amber-400/10 px-2.5 py-0.5 text-[11px] font-medium text-amber-300">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                      Unverified
                    </span>
                  )}
                </div>
              </div>
            </div>

            {!isLoading && profile && (
              <div className="shrink-0 rounded-2xl border border-white/8 bg-white/[0.03] px-5 py-3 text-center">
                <p className="text-[10px] uppercase tracking-widest text-white/35 font-medium">Member since</p>
                <p className="mt-1 text-sm font-semibold text-white/70">{memberSince(profile.createdAt)}</p>
                <p className="text-xs text-violet-300/70">{daysSince(profile.createdAt)} days active</p>
              </div>
            )}
          </div>

          <div className="mt-7 grid gap-4 sm:grid-cols-3" style={{ transformStyle: "preserve-3d" }}>
            <StatCard
              label="Conversations"
              value={isLoading ? null : String(stats?.conversations ?? 0)}
              icon="💬"
              delay={250}
            />
            <StatCard
              label="Messages Sent"
              value={isLoading ? null : String(stats?.messagesSent ?? 0)}
              icon="📨"
              delay={350}
            />
            <StatCard
              label="Days Active"
              value={isLoading || !profile ? null : `${daysSince(profile.createdAt)}`}
              icon="⚡"
              delay={450}
            />
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2" style={{ transformStyle: "preserve-3d" }}>

            <div style={{ transform: "translateZ(20px)" }} className="rounded-[1.6rem] border border-white/8 bg-white/[0.01] p-5 transition-all duration-300 hover:border-violet-400/20">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-white/85">Accept Anonymous Messages</p>
                  <p className="mt-1 text-xs text-white/40 leading-relaxed">
                    Allow others to send you anonymous ghost messages via your link.
                  </p>
                </div>
                {isLoading ? (
                  <div className="h-8 w-14 shrink-0 animate-pulse rounded-full bg-white/8" />
                ) : (
                  <button
                    onClick={handleToggleMessages}
                    disabled={toggling}
                    className={[
                      "h-8 w-14 shrink-0 rounded-full border p-1 transition-all duration-300 outline-none relative",
                      profile?.isAcceptingMessages
                        ? "border-violet-400/40 bg-violet-500/30 shadow-[0_0_20px_rgba(168,85,247,0.3)]"
                        : "border-white/10 bg-black/40",
                      toggling ? "opacity-60" : "",
                    ].join(" ")}
                  >
                    <span className={[
                      "block h-5 w-5 rounded-full bg-white shadow-[0_2px_10px_rgba(0,0,0,0.4)] transition-all duration-300",
                      profile?.isAcceptingMessages ? "translate-x-6 bg-violet-100" : "translate-x-0",
                    ].join(" ")} />
                  </button>
                )}
              </div>
              <div className={`mt-3 text-xs font-medium ${profile?.isAcceptingMessages ? "text-emerald-400/80" : "text-white/30"}`}>
                {isLoading ? "" : profile?.isAcceptingMessages ? "● Receiving messages" : "○ Not accepting messages"}
              </div>
            </div>

            <div style={{ transform: "translateZ(20px)" }} className="rounded-[1.6rem] border border-white/8 bg-white/[0.01] p-5 transition-all duration-300 hover:border-violet-400/20">
              <p className="text-sm font-medium text-white/85">Your Ghost Link</p>
              <p className="mt-1 text-xs text-white/40 leading-relaxed">
                Share this link so anyone can send you an anonymous message.
              </p>
              <div className="mt-4 flex items-center gap-2">
                <div className="flex-1 truncate rounded-xl border border-white/8 bg-black/30 px-3 py-2 text-xs text-white/50 font-mono">
                  {isLoading ? (
                    <div className="h-3 w-full animate-pulse rounded bg-white/8" />
                  ) : (
                    <span className="truncate">/u/{profile?.username}</span>
                  )}
                </div>
                <button
                  onClick={handleCopyLink}
                  disabled={isLoading}
                  className={[
                    "shrink-0 rounded-xl border px-3 py-2 text-xs font-medium transition-all duration-200 active:scale-95",
                    copied
                      ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-300"
                      : "border-violet-400/30 bg-violet-500/10 text-violet-300 hover:bg-violet-500/20",
                  ].join(" ")}
                >
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
            </div>

          </div>

          <div style={{ transform: "translateZ(15px)" }} className="mt-6 rounded-[1.6rem] border border-emerald-400/10 bg-emerald-400/[0.03] px-5 py-4">
            <div className="flex items-center gap-3">
              <span className="text-lg">🔒</span>
              <div>
                <p className="text-sm font-medium text-emerald-300/80">End-to-end encrypted</p>
                <p className="text-xs text-white/35 leading-relaxed mt-0.5">
                  All messages are encrypted in transit. Your identity is never revealed to senders.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </HomePage>
  );
}

function StatCard({ label, value, delay = 0, icon }: { label: string; value: string | null; delay?: number; icon: string }) {
  return (
    <div
      style={{ animationDelay: `${delay}ms`, transform: "translateZ(20px)" }}
      className="group rounded-[1.6rem] border border-white/8 bg-white/[0.01] p-5 transition-all duration-300 hover:scale-[1.03] hover:border-violet-400/30 hover:bg-[linear-gradient(180deg,rgba(168,85,247,0.08),rgba(255,255,255,0.02))] hover:shadow-[0_15px_35px_rgba(139,92,246,0.12)]"
    >
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-white/45 tracking-wide uppercase">{label}</p>
        <span className="text-lg opacity-60 group-hover:opacity-100 transition-opacity">{icon}</span>
      </div>
      {value === null ? (
        <div className="mt-4 h-9 w-16 animate-pulse rounded-lg bg-white/8" />
      ) : (
        <p className="mt-4 text-3xl font-semibold tracking-tight text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.1)] group-hover:text-violet-200 transition-colors">
          {value}
        </p>
      )}
    </div>
  );
}
