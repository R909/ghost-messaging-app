import Link from "next/link";
import { AuthShell } from "../components/auth-shell";

export default function RegisterPage() {
  return (
    <AuthShell
      title="Create Account"
      subtitle="Join the anonymous world"
      backLink="/login"
      backLabel="Already have an account? Login"
      backdropSrc="/ghost-2.png"
      pageDirection="right"
      ghostMotion="up"
    >
      <form className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm text-white/70" htmlFor="register-name">
            Full name
          </label>
          <input
            id="register-name"
            type="text"
            placeholder="Ghost Walker"
            className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-violet-400/40 focus:bg-black/25"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm text-white/70" htmlFor="register-email">
            Email
          </label>
          <input
            id="register-email"
            type="email"
            placeholder="ghost@domain.com"
            className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-violet-400/40 focus:bg-black/25"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm text-white/70" htmlFor="register-password">
              Password
            </label>
            <input
              id="register-password"
              type="password"
              placeholder="Create password"
              className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-violet-400/40 focus:bg-black/25"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-white/70" htmlFor="register-confirm">
              Confirm
            </label>
            <input
              id="register-confirm"
              type="password"
              placeholder="Confirm password"
              className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-violet-400/40 focus:bg-black/25"
            />
          </div>
        </div>

        <label className="flex items-start gap-2 text-sm text-white/60">
          <input
            type="checkbox"
            className="mt-1 h-4 w-4 rounded border-white/20 bg-black/30 text-violet-500 focus:ring-violet-400"
          />
          <span>
            I agree to keep my ghost identity private and accept the demo terms.
          </span>
        </label>

        <Link
          href="/chats"
          className="flex w-full items-center justify-center rounded-2xl bg-gradient-to-br from-[#c084fc] via-[#8b5cf6] to-[#6d28d9] px-5 py-3 font-medium text-white shadow-[0_14px_34px_rgba(124,58,237,0.35)] transition hover:brightness-110"
        >
          Create Account
        </Link>

      </form>
    </AuthShell>
  );
}
