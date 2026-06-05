"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { GhostBackdrop, HomePage } from "../../components/home";

type Toast = { message: string; type: "success" | "error" };
type LocalPrefs = { ghostMode: boolean; selfDestruct: boolean; readReceipts: boolean };

const PREFS_KEY = "ghost_prefs";

const defaultPrefs: LocalPrefs = { ghostMode: true, selfDestruct: false, readReceipts: false };

function loadPrefs(): LocalPrefs {
  if (typeof window === "undefined") return defaultPrefs;
  try { return { ...defaultPrefs, ...JSON.parse(localStorage.getItem(PREFS_KEY) ?? "{}") }; }
  catch { return defaultPrefs; }
}

function savePrefs(p: LocalPrefs) {
  localStorage.setItem(PREFS_KEY, JSON.stringify(p));
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.25em] text-violet-300/70">
      {children}
    </p>
  );
}

function Toggle({ checked, onChange, disabled = false }: { checked: boolean; onChange: () => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      onClick={onChange}
      disabled={disabled}
      className={[
        "h-8 w-14 shrink-0 rounded-full border p-1 transition-all duration-300 outline-none",
        checked ? "border-violet-400/40 bg-violet-500/30 shadow-[0_0_20px_rgba(168,85,247,0.3)]" : "border-white/10 bg-black/40",
        disabled ? "opacity-50 cursor-not-allowed" : "",
      ].join(" ")}
    >
      <span className={[
        "block h-5 w-5 rounded-full bg-white shadow-[0_2px_10px_rgba(0,0,0,0.4)] transition-all duration-300",
        checked ? "translate-x-6 bg-violet-100" : "translate-x-0",
      ].join(" ")} />
    </button>
  );
}

function InputField({
  label, id, type = "text", value, onChange, placeholder, error, hint,
}: {
  label: string; id: string; type?: string; value: string;
  onChange: (v: string) => void; placeholder?: string; error?: string; hint?: string;
}) {
  const [show, setShow] = useState(false);
  const [focused, setFocused] = useState(false);
  const isPassword = type === "password";

  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-white/45">{label}</label>
      <div className={`relative rounded-xl border transition-all duration-300 ${focused ? "border-violet-400/50 bg-[#140f26] shadow-[0_0_20px_rgba(168,85,247,0.12)]" : error ? "border-red-400/40 bg-[#0e0a1a]" : "border-white/10 bg-[#0e0a1a]"}`}>
        <input
          id={id}
          type={isPassword && !show ? "password" : "text"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          className="h-11 w-full bg-transparent px-4 pr-11 text-sm text-white outline-none placeholder:text-white/20"
        />
        {isPassword && (
          <button type="button" onClick={() => setShow((s) => !s)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
            {show ? <EyeIcon /> : <EyeOffIcon />}
          </button>
        )}
      </div>
      {error && <p className="text-[11px] text-red-400">{error}</p>}
      {hint && !error && <p className="text-[11px] text-white/30">{hint}</p>}
    </div>
  );
}

export default function SettingsPage() {
  const { data: session, update: updateSession } = useSession();

  // Account form state
  const [username, setUsername] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [usernameLoading, setUsernameLoading] = useState(false);

  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [pwError, setPwError] = useState("");
  const [pwLoading, setPwLoading] = useState(false);

  // Privacy
  const [acceptMessages, setAcceptMessages] = useState(false);
  const [acceptLoading, setAcceptLoading] = useState(false);
  const [privacyReady, setPrivacyReady] = useState(false);

  const [prefs, setPrefs] = useState<LocalPrefs>(defaultPrefs);

  const [showDelete, setShowDelete] = useState(false);
  const [deletePw, setDeletePw] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [toast, setToast] = useState<Toast | null>(null);

  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const showToast = (message: string, type: Toast["type"]) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Load user data
  useEffect(() => {
    if (!session?.user?._id) return;
    setUsername(session.user.username ?? "");
    fetch("/api/profile")
      .then((r) => r.json())
      .then((d) => { if (d.success) { setAcceptMessages(d.profile.isAcceptingMessages); } })
      .finally(() => setPrivacyReady(true));
    setPrefs(loadPrefs());
  }, [session?.user?._id]);

  const handleUsernameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUsernameError("");
    const trimmed = username.trim();
    if (!trimmed || trimmed.length < 3) { setUsernameError("Must be at least 3 characters"); return; }
    if (trimmed === session?.user?.username) { setUsernameError("That is already your username"); return; }

    setUsernameLoading(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "username", newUsername: trimmed }),
      });
      const data = await res.json();
      if (!data.success) { setUsernameError(data.message); return; }
      await updateSession({ username: trimmed });
      showToast("Username updated!", "success");
    } catch { setUsernameError("Something went wrong"); }
    finally { setUsernameLoading(false); }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwError("");
    if (!currentPw) { setPwError("Enter your current password"); return; }
    if (newPw.length < 6) { setPwError("New password must be at least 6 characters"); return; }
    if (newPw !== confirmPw) { setPwError("New passwords do not match"); return; }

    setPwLoading(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "password", currentPassword: currentPw, newPassword: newPw }),
      });
      const data = await res.json();
      if (!data.success) { setPwError(data.message); return; }
      setCurrentPw(""); setNewPw(""); setConfirmPw("");
      showToast("Password changed!", "success");
    } catch { setPwError("Something went wrong"); }
    finally { setPwLoading(false); }
  };

  const handleAcceptToggle = async () => {
    if (acceptLoading) return;
    const next = !acceptMessages;
    setAcceptMessages(next);
    setAcceptLoading(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isAcceptingMessages: next }),
      });
      const data = await res.json();
      if (data.success) {
        await updateSession({ isAcceptingMessages: next }); // sync JWT cookie
      } else {
        setAcceptMessages(!next);
        showToast("Failed to update", "error");
      }
    } catch { setAcceptMessages(!next); }
    finally { setAcceptLoading(false); }
  };

  const handlePrefToggle = (key: keyof LocalPrefs) => {
    setPrefs((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      savePrefs(next);
      return next;
    });
  };

  const handleDeleteAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setDeleteError("");
    if (!deletePw) { setDeleteError("Enter your password to confirm"); return; }
    setDeleteLoading(true);
    try {
      const res = await fetch("/api/settings", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: deletePw }),
      });
      const data = await res.json();
      if (!data.success) { setDeleteError(data.message); return; }
      await signOut({ callbackUrl: "/sign-in" });
    } catch { setDeleteError("Something went wrong"); }
    finally { setDeleteLoading(false); }
  };

  return (
    <HomePage active="settings">
      <div
        style={{ perspective: "1500px" }}
        className="relative flex h-full flex-1 items-start justify-center overflow-y-auto p-4 sm:p-6"
      >
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(168,85,247,0.15),transparent_24%),radial-gradient(circle_at_80%_24%,rgba(124,58,237,0.1),transparent_22%)]" />
          <div className="absolute left-[-4rem] bottom-[-5rem] h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(167,139,250,0.22),transparent_68%)] blur-3xl animate-drift" />
          <div className="absolute right-[-5rem] top-[-4rem] h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(124,58,237,0.2),transparent_68%)] blur-3xl animate-pulse-soft" />
        </div>

        <GhostBackdrop src="/ghost-1.png" alt="Settings ghost" className="animate-float-slow" imageClassName="opacity-[0.1] scale-110" />

        {toast && (
          <div className={`fixed right-5 top-5 z-50 rounded-2xl border px-5 py-3 text-sm font-medium shadow-lg backdrop-blur-xl transition-all duration-300 ${toast.type === "success" ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300" : "border-red-400/20 bg-red-400/10 text-red-300"}`}>
            {toast.message}
          </div>
        )}

        <div
          onMouseMove={(e) => {
            const r = e.currentTarget.getBoundingClientRect();
            setRotateX(-((e.clientY - r.top - r.height / 2) / r.height) * 2.5);
            setRotateY(((e.clientX - r.left - r.width / 2) / r.width) * 2.5);
          }}
          onMouseLeave={() => { setRotateX(0); setRotateY(0); }}
          style={{ transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`, transformStyle: "preserve-3d", transition: "transform 0.15s ease-out" }}
          className="relative z-10 my-4 w-full max-w-3xl rounded-[2.2rem] border border-white/12 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.025))] p-6 sm:p-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_30px_90px_rgba(0,0,0,0.4)] backdrop-blur-2xl"
        >
          <div style={{ transform: "translateZ(35px)" }}>
            <h1 className="text-3xl font-semibold tracking-tight text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.15)]">
              Settings
            </h1>
            <p className="mt-1.5 text-sm text-white/45">
              Manage your account, privacy, and preferences.
            </p>
          </div>

          <div className="mt-8 space-y-8" style={{ transformStyle: "preserve-3d" }}>

            <div style={{ transform: "translateZ(20px)" }}>
              <SectionLabel>Account</SectionLabel>
              <div className="space-y-4 rounded-[1.6rem] border border-white/8 bg-white/[0.01] p-5">

                <form onSubmit={handleUsernameSubmit} className="space-y-3">
                  <p className="text-sm font-medium text-white/80">Change Username</p>
                  <InputField
                    label="New username"
                    id="new-username"
                    value={username}
                    onChange={(v) => { setUsername(v); setUsernameError(""); }}
                    placeholder="your_alias"
                    error={usernameError}
                    hint="3–30 characters. Letters, numbers and underscores."
                  />
                  <button
                    type="submit"
                    disabled={usernameLoading}
                    className="rounded-xl bg-gradient-to-br from-[#b06cff] to-[#7d3cff] px-5 py-2.5 text-sm font-medium text-white transition-all hover:brightness-110 active:scale-95 disabled:opacity-60"
                  >
                    {usernameLoading ? "Saving..." : "Update Username"}
                  </button>
                </form>

                <div className="border-t border-white/6 pt-4">
                  <form onSubmit={handlePasswordSubmit} className="space-y-3">
                    <p className="text-sm font-medium text-white/80">Change Password</p>
                    <InputField
                      label="Current password"
                      id="current-pw"
                      type="password"
                      value={currentPw}
                      onChange={(v) => { setCurrentPw(v); setPwError(""); }}
                      placeholder="••••••••"
                    />
                    <InputField
                      label="New password"
                      id="new-pw"
                      type="password"
                      value={newPw}
                      onChange={(v) => { setNewPw(v); setPwError(""); }}
                      placeholder="••••••••"
                      hint="At least 6 characters."
                    />
                    <InputField
                      label="Confirm new password"
                      id="confirm-pw"
                      type="password"
                      value={confirmPw}
                      onChange={(v) => { setConfirmPw(v); setPwError(""); }}
                      placeholder="••••••••"
                      error={pwError}
                    />
                    <button
                      type="submit"
                      disabled={pwLoading}
                      className="rounded-xl bg-gradient-to-br from-[#b06cff] to-[#7d3cff] px-5 py-2.5 text-sm font-medium text-white transition-all hover:brightness-110 active:scale-95 disabled:opacity-60"
                    >
                      {pwLoading ? "Updating..." : "Change Password"}
                    </button>
                  </form>
                </div>

              </div>
            </div>

            <div style={{ transform: "translateZ(20px)" }}>
              <SectionLabel>Privacy</SectionLabel>
              <div className="rounded-[1.6rem] border border-white/8 bg-white/[0.01] p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-white/80">Accept Anonymous Messages</p>
                    <p className="mt-0.5 text-xs text-white/40 leading-relaxed">
                      Allow anyone with your ghost link to send you anonymous messages.
                    </p>
                  </div>
                  {privacyReady ? (
                    <Toggle checked={acceptMessages} onChange={handleAcceptToggle} disabled={acceptLoading} />
                  ) : (
                    <div className="h-8 w-14 animate-pulse rounded-full bg-white/8" />
                  )}
                </div>
                <p className={`mt-3 text-xs font-medium ${acceptMessages ? "text-emerald-400/80" : "text-white/30"}`}>
                  {acceptMessages ? "● Receiving messages" : "○ Not accepting messages"}
                </p>
              </div>
            </div>

            <div style={{ transform: "translateZ(20px)" }}>
              <SectionLabel>Preferences</SectionLabel>
              <div className="space-y-3 rounded-[1.6rem] border border-white/8 bg-white/[0.01] p-5">
                {([
                  { key: "ghostMode", title: "Ghost Mode", desc: "Mask socket metadata on message relays." },
                  { key: "selfDestruct", title: "Self-destruct Timer", desc: "Auto-scrub message threads after 24 hours." },
                  { key: "readReceipts", title: "Read Receipts", desc: "Show double-tick when the recipient reads your message." },
                ] as { key: keyof LocalPrefs; title: string; desc: string }[]).map(({ key, title, desc }) => (
                  <div key={key} className="flex items-center justify-between gap-4 rounded-xl border border-white/4 px-4 py-3 transition-all duration-200 hover:border-white/8 hover:bg-white/[0.02]">
                    <div>
                      <p className="text-sm font-medium text-white/80">{title}</p>
                      <p className="text-xs text-white/40 mt-0.5">{desc}</p>
                    </div>
                    <Toggle checked={prefs[key]} onChange={() => handlePrefToggle(key)} />
                  </div>
                ))}
              </div>
            </div>

            <div style={{ transform: "translateZ(20px)" }}>
              <SectionLabel>Danger Zone</SectionLabel>
              <div className="rounded-[1.6rem] border border-red-500/15 bg-red-500/[0.03] p-5">
                {!showDelete ? (
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-red-300/80">Delete Account</p>
                      <p className="mt-0.5 text-xs text-white/35 leading-relaxed">
                        Permanently removes your account, all conversations, and messages. This cannot be undone.
                      </p>
                    </div>
                    <button
                      onClick={() => setShowDelete(true)}
                      className="shrink-0 rounded-xl border border-red-400/25 bg-red-500/10 px-4 py-2.5 text-sm font-medium text-red-300 transition-all hover:bg-red-500/20 active:scale-95"
                    >
                      Delete
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleDeleteAccount} className="space-y-4">
                    <div>
                      <p className="text-sm font-semibold text-red-300">Are you absolutely sure?</p>
                      <p className="mt-1 text-xs text-white/40 leading-relaxed">
                        This will permanently delete your account, all messages, and conversations. Enter your password to confirm.
                      </p>
                    </div>
                    <InputField
                      label="Confirm with your password"
                      id="delete-pw"
                      type="password"
                      value={deletePw}
                      onChange={(v) => { setDeletePw(v); setDeleteError(""); }}
                      placeholder="••••••••"
                      error={deleteError}
                    />
                    <div className="flex gap-3">
                      <button
                        type="submit"
                        disabled={deleteLoading}
                        className="rounded-xl bg-red-500/80 px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-red-500 active:scale-95 disabled:opacity-60"
                      >
                        {deleteLoading ? "Deleting..." : "Confirm Delete"}
                      </button>
                      <button
                        type="button"
                        onClick={() => { setShowDelete(false); setDeletePw(""); setDeleteError(""); }}
                        className="rounded-xl border border-white/10 px-5 py-2.5 text-sm text-white/50 hover:text-white/80 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </HomePage>
  );
}

function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M3.5 12s2.9-5 8.5-5 8.5 5 8.5 5-2.9 5-8.5 5-8.5-5-8.5-5Z" />
      <path d="M9.5 12a2.5 2.5 0 1 0 5 0 2.5 2.5 0 0 0-5 0Z" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M3.5 12s2.9-5 8.5-5 8.5 5 8.5 5-2.9 5-8.5 5-8.5-5-8.5-5Z" />
      <path d="M9.5 12a2.5 2.5 0 1 0 5 0 2.5 2.5 0 0 0-5 0Z" />
      <path d="M4 4l16 16" strokeLinecap="round" />
    </svg>
  );
}
