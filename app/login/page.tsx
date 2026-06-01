import Link from "next/link";
import { AuthShell } from "../components/auth-shell";

export default function LoginPage() {
  return (
    <AuthShell
      title="Welcome Back"
      subtitle="Login to continue your journey"
      backLink="/register"
      backLabel="Don't have an account? Register"
      backdropSrc="/ghost-1.png"
      pageDirection="left"
      ghostMotion="down"
    >
      <form className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm text-white/70" htmlFor="login-email">
            Email or username
          </label>
          <input
            id="login-email"
            type="text"
            placeholder="Enter your email or username"
            className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-violet-400/40 focus:bg-black/25"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm text-white/70" htmlFor="login-password">
            Password
          </label>
          <input
            id="login-password"
            type="password"
            placeholder="Enter your password"
            className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-violet-400/40 focus:bg-black/25"
          />
        </div>

        <div className="flex items-center justify-between gap-3 text-sm text-white/60">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-white/20 bg-black/30 text-violet-500 focus:ring-violet-400"
            />
            Remember me
          </label>
          <Link href="/chats" className="text-violet-200 transition hover:text-violet-100">
            Forgot password?
          </Link>
        </div>

        <Link
          href="/chats"
          className="flex w-full items-center justify-center rounded-2xl bg-gradient-to-br from-[#c084fc] via-[#8b5cf6] to-[#6d28d9] px-5 py-3 font-medium text-white shadow-[0_14px_34px_rgba(124,58,237,0.35)] transition hover:brightness-110"
        >
          Log In
        </Link>

      </form>
    </AuthShell>
  );
}
