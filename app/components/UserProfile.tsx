"use client";

import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import { useState } from "react";
import { GhostAvatar } from "./home";

export default function UserProfile() {
  const { data: session } = useSession();
  const username = session?.user?.username ?? "Ghost User";
  const [isLoading, setIsLoading] = useState(false);

  return (
    <>
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.06] border border-white/5 shadow-inner">
          <GhostAvatar size="sm" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-white/90">@{username}</p>
          <p className="text-xs text-white/40">End-to-end encrypted</p>
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-emerald-400/10 bg-emerald-400/[0.04] px-3 py-2 text-xs font-medium text-emerald-400/90 backdrop-blur-sm shadow-[inset_0_1px_0_rgba(52,211,153,0.05)] transition-all duration-300 hover:bg-emerald-400/[0.06]">
        Your messages self-destruct in 24 hours.
      </div>

      <button
        onClick={async () => { setIsLoading(true); await signOut({ callbackUrl: "/sign-in" }); }}
        disabled={isLoading}
        className="group mt-3 flex w-full items-center gap-3 rounded-2xl border border-white/[0.04] bg-white/[0.02] px-4 py-3.5 text-xs font-medium text-white/50 transition-all duration-300 hover:border-red-400/20 hover:bg-red-500/[0.06] hover:text-red-300/80 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-60"
      >
        <span className="transition-transform duration-300 group-hover:scale-110">
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M12 3v9" strokeLinecap="round" />
            <path d="M7.1 5.4a9 9 0 1 0 9.8 0" strokeLinecap="round" />
          </svg>
        </span>
        <span>{isLoading ? "Signing out..." : "Sign Out"}</span>
      </button>
    </>
  );
}
