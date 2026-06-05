"use client";

import { useEffect, useState, useCallback } from "react";
import { GhostBackdrop, GhostAvatar, HomePage } from "../../components/home";

interface GhostLinkData {
  _id: string;
  code: string;
  status: "active" | "hidden";
  expiresAt: string;
}

function formatExpiry(expiresAt: string): string {
  const diff = new Date(expiresAt).getTime() - Date.now();
  if (diff <= 0) return "Expired";
  const hours = diff / (1000 * 60 * 60);
  if (hours < 1) return `Expires in ${Math.max(1, Math.floor(diff / 60000))}m`;
  if (hours < 24) return `Expires in ${Math.floor(hours)}h`;
  return `Expires in ${Math.floor(hours / 24)}d`;
}

type ExpiryOption = "4h" | "1d" | "7d";

const EXPIRY_LABELS: Record<ExpiryOption, string> = {
  "4h": "4 hours",
  "1d": "1 day",
  "7d": "7 days",
};

export default function GhostLinksPage() {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [links, setLinks] = useState<GhostLinkData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showExpiryPicker, setShowExpiryPicker] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchLinks = useCallback(async () => {
    try {
      const res = await fetch("/api/ghost-links");
      const data = await res.json();
      if (data.success) setLinks(data.links);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchLinks(); }, [fetchLinks]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - rect.left - rect.width / 2;
    const mouseY = e.clientY - rect.top - rect.height / 2;
    setRotateX(-((mouseY / rect.height) * 2.5));
    setRotateY((mouseX / rect.width) * 2.5);
  };

  const handleMouseLeave = () => { setRotateX(0); setRotateY(0); };

  const handleGenerate = async (expiresIn: ExpiryOption) => {
    setGenerating(true);
    setShowExpiryPicker(false);
    try {
      const res = await fetch("/api/ghost-links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ expiresIn }),
      });
      const data = await res.json();
      if (data.success) setLinks((prev) => [data.link, ...prev]);
    } finally {
      setGenerating(false);
    }
  };

  const handleCopy = (link: GhostLinkData) => {
    const url = `${window.location.origin}/m/${link.code}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedId(link._id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const handleToggleStatus = async (link: GhostLinkData) => {
    setTogglingId(link._id);
    const next = link.status === "active" ? "hidden" : "active";
    try {
      const res = await fetch(`/api/ghost-links/${link._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      const data = await res.json();
      if (data.success) {
        setLinks((prev) => prev.map((l) => (l._id === link._id ? data.link : l)));
      }
    } finally {
      setTogglingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/ghost-links/${id}`, { method: "DELETE" });
      if (res.ok) setLinks((prev) => prev.filter((l) => l._id !== id));
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <HomePage active="ghost-links">
      <div
        style={{ perspective: "1500px" }}
        className="relative flex h-full flex-1 items-center justify-center overflow-hidden p-4 sm:p-6"
        onClick={() => showExpiryPicker && setShowExpiryPicker(false)}
      >
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(168,85,247,0.16),transparent_24%),radial-gradient(circle_at_82%_22%,rgba(59,130,246,0.08),transparent_22%),radial-gradient(circle_at_50%_78%,rgba(168,85,247,0.12),transparent_26%)]" />
          <div className="absolute left-[-6rem] top-[-4rem] h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(192,132,252,0.22),transparent_68%)] blur-3xl animate-pulse-soft" />
          <div className="absolute right-[-4rem] bottom-[-5rem] h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(124,58,237,0.2),transparent_68%)] blur-3xl animate-drift" />
        </div>

        <GhostBackdrop
          src="/ghost-2.png"
          alt="Floating ghost behind the ghost links page"
          className="animate-drift"
          imageClassName="opacity-[0.11] scale-110"
        />

        <div
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{
            transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
            transformStyle: "preserve-3d",
            transition: "transform 0.15s ease-out",
          }}
          className="relative z-10 w-full max-w-4xl rounded-[2.2rem] border border-white/12 bg-white/[0.035] p-6 sm:p-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_30px_90px_rgba(0,0,0,0.4)] backdrop-blur-2xl animate-slide-up-fade"
        >
          <div
            style={{ transform: "translateZ(40px)" }}
            className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between border-b border-white/10 pb-6"
          >
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-violet-300 font-semibold">Ghost Links</p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white drop-shadow-[0_0_15px_rgba(168,85,247,0.3)]">
                Temporary Private Gateways
              </h1>
              <p className="mt-2 max-w-xl text-sm leading-6 text-white/50">
                Share a secure routing bridge instead of static identifiers. Links scrub usage records instantly upon timing out.
              </p>
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-violet-400/20 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(33,16,51,0.4))] px-4 py-3 shadow-[0_10px_30px_rgba(168,85,247,0.1)] shrink-0">
              <GhostAvatar />
              <div>
                <p className="text-sm font-medium text-white">Link Generator</p>
                <p className="text-xs text-violet-200/60">E2E Secure Core</p>
              </div>
            </div>
          </div>

          <div className="mt-6" style={{ transformStyle: "preserve-3d" }}>
            {loading ? (
              <div className="flex flex-col gap-3">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="h-[72px] animate-pulse rounded-[1.6rem] border border-white/6 bg-white/[0.02]" />
                ))}
              </div>
            ) : links.length === 0 ? (
              <div className="flex flex-col items-center gap-3 py-10 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04]">
                  <svg className="h-6 w-6 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
                  </svg>
                </div>
                <p className="text-sm text-white/40">No active ghost links. Generate one to start.</p>
              </div>
            ) : (
              <div className="grid gap-3">
                {links.map((link, index) => (
                  <div
                    key={link._id}
                    style={{ animationDelay: `${index * 80 + 200}ms`, transform: "translateZ(20px)" }}
                    className="group flex flex-col gap-3 rounded-[1.6rem] border border-white/6 bg-white/[0.01] p-4 transition-all duration-300 hover:border-violet-400/25 hover:bg-white/[0.03] lg:flex-row lg:items-center lg:justify-between animate-slide-up-fade"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-mono text-base font-medium text-white tracking-wide group-hover:text-violet-300 transition-colors">
                        ghst://{link.code}
                      </p>
                      <p className="mt-1 flex items-center gap-1.5 text-xs text-white/40">
                        <span className="h-1 w-1 rounded-full bg-violet-400" />
                        {formatExpiry(link.expiresAt)}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`rounded-xl border px-3 py-1 text-xs font-medium ${link.status === "active" ? "border-emerald-400/25 bg-emerald-400/10 text-emerald-300" : "border-white/10 bg-white/5 text-white/50"}`}>
                        {link.status === "active" ? "Active" : "Hidden"}
                      </span>

                      <button
                        onClick={() => handleCopy(link)}
                        className="rounded-xl border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs text-white/70 transition hover:bg-violet-500/20 hover:text-white hover:border-violet-400/30 active:scale-95"
                      >
                        {copiedId === link._id ? "Copied!" : "Copy"}
                      </button>

                      <button
                        onClick={() => handleToggleStatus(link)}
                        disabled={togglingId === link._id}
                        className="rounded-xl border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs text-white/70 transition hover:bg-violet-500/20 hover:text-white hover:border-violet-400/30 active:scale-95 disabled:opacity-50"
                      >
                        {togglingId === link._id ? "…" : link.status === "active" ? "Hide" : "Show"}
                      </button>

                      <button
                        onClick={() => handleDelete(link._id)}
                        disabled={deletingId === link._id}
                        className="rounded-xl border border-white/10 bg-white/5 p-1.5 text-white/40 transition hover:bg-rose-500/20 hover:text-rose-400 hover:border-rose-400/30 active:scale-95 disabled:opacity-50"
                        aria-label="Delete link"
                      >
                        {deletingId === link._id ? (
                          <span className="block h-4 w-4 text-center text-xs leading-4">…</span>
                        ) : (
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="relative mt-8" style={{ transform: "translateZ(30px)" }}>
            {showExpiryPicker && (
              <div
                onClick={(e) => e.stopPropagation()}
                className="absolute bottom-full mb-3 left-0 flex items-center gap-2 rounded-2xl border border-white/12 bg-[#0d0814] p-2 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-xl animate-slide-up-fade"
              >
                <p className="px-2 text-xs text-white/40 shrink-0">Expires in:</p>
                {(["4h", "1d", "7d"] as ExpiryOption[]).map((opt) => (
                  <button
                    key={opt}
                    onClick={() => handleGenerate(opt)}
                    className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 transition hover:bg-violet-500/25 hover:text-white hover:border-violet-400/30 active:scale-95"
                  >
                    {EXPIRY_LABELS[opt]}
                  </button>
                ))}
              </div>
            )}

            <button
              onClick={(e) => { e.stopPropagation(); setShowExpiryPicker((v) => !v); }}
              disabled={generating}
              className="w-full sm:w-auto rounded-xl bg-gradient-to-r from-[#c084fc] via-[#8b5cf6] to-[#6d28d9] px-6 py-3.5 font-medium text-white shadow-[0_15px_30px_rgba(124,58,237,0.3)] transition-all duration-300 hover:brightness-110 hover:shadow-[0_20px_40px_rgba(124,58,237,0.45)] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed animate-slide-up-fade [animation-delay:500ms]"
            >
              {generating ? "Generating…" : "Generate New Link"}
            </button>
          </div>
        </div>
      </div>
    </HomePage>
  );
}
