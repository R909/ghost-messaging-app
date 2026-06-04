"use client";

import { signOut } from "next-auth/react";
import { useState } from "react";

export default function LogoutButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    await signOut({ callbackUrl: "/sign-in" });
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isLoading}
      className="group flex w-full items-center gap-3 rounded-2xl border border-white/[0.04] bg-white/[0.02] px-4 py-3.5 text-xs font-medium text-white/50 transition-all duration-300 hover:border-red-400/20 hover:bg-red-500/[0.06] hover:text-red-300/80 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-60"
    >
      <span className="transition-transform duration-300 group-hover:scale-110">
        <PowerIcon />
      </span>
      <span>{isLoading ? "Signing out..." : "Sign Out"}</span>
    </button>
  );
}

function PowerIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 3v9" strokeLinecap="round" />
      <path d="M7.1 5.4a9 9 0 1 0 9.8 0" strokeLinecap="round" />
    </svg>
  );
}
