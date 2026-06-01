import { GhostAuthScene } from "../components/ghost-auth-scene";

export default function RegisterPage() {
  return (
    <GhostAuthScene
      title="Create Account"
      subtitle="Join the anonymous world"
      backHref="/login"
      backLabel="Already have an account? Login"
      ghostSrc="/ghost-2.png"
      slideDirection="right"
    >
      <form className="space-y-3">
        <div className="space-y-2">
          <label
            htmlFor="register-name"
            className="text-[11px] uppercase tracking-[0.22em] text-white/45"
          >
            Full Name
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/30">
              <UserIcon />
            </span>
            <input
              id="register-name"
              type="text"
              placeholder="Full Name"
              className="h-10 w-full rounded-lg border border-white/10 bg-[#100c1d] px-10 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-violet-400/40 focus:bg-[#151024]"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="register-email"
            className="text-[11px] uppercase tracking-[0.22em] text-white/45"
          >
            Email
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/30">
              <MailIcon />
            </span>
            <input
              id="register-email"
              type="email"
              placeholder="Email"
              className="h-10 w-full rounded-lg border border-white/10 bg-[#100c1d] px-10 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-violet-400/40 focus:bg-[#151024]"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="register-password"
            className="text-[11px] uppercase tracking-[0.22em] text-white/45"
          >
            Password
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/30">
              <LockIcon />
            </span>
            <input
              id="register-password"
              type="password"
              placeholder="Password"
              className="h-10 w-full rounded-lg border border-white/10 bg-[#100c1d] px-10 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-violet-400/40 focus:bg-[#151024]"
            />
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white/30">
              <EyeOffIcon />
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="register-confirm"
            className="text-[11px] uppercase tracking-[0.22em] text-white/45"
          >
            Confirm Password
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/30">
              <LockIcon />
            </span>
            <input
              id="register-confirm"
              type="password"
              placeholder="Confirm Password"
              className="h-10 w-full rounded-lg border border-white/10 bg-[#100c1d] px-10 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-violet-400/40 focus:bg-[#151024]"
            />
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white/30">
              <EyeOffIcon />
            </span>
          </div>
        </div>

        <label className="flex items-start gap-2 pt-1 text-[11px] text-white/55">
          <input
            type="checkbox"
            className="mt-0.5 h-3.5 w-3.5 rounded border-white/20 bg-transparent text-violet-500 focus:ring-violet-400"
          />
          <span>I agree to the Terms & Conditions</span>
        </label>

        <button
          type="button"
          className="mt-1 flex h-10 w-full items-center justify-center rounded-lg bg-gradient-to-r from-[#7b3df0] via-[#8d43ff] to-[#c65dff] text-sm font-medium text-white shadow-[0_10px_28px_rgba(136,68,255,0.42)] transition hover:brightness-110"
        >
          Create Account
        </button>
      </form>
    </GhostAuthScene>
  );
}

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 12a3.9 3.9 0 1 0 0-7.8 3.9 3.9 0 0 0 0 7.8Z" />
      <path d="M4.5 20c1.4-3 3.8-4.4 7.5-4.4s6.1 1.4 7.5 4.4" strokeLinecap="round" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="4.5" y="6.5" width="15" height="11" rx="2" />
      <path d="M5.5 8l6.5 5 6.5-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="5.5" y="10.5" width="13" height="8.5" rx="2" />
      <path d="M8 10.5V8.6a4 4 0 0 1 8 0v1.9" strokeLinecap="round" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M3.5 12s2.9-5 8.5-5 8.5 5 8.5 5-2.9 5-8.5 5-8.5-5-8.5-5Z" />
      <path d="M9.5 12a2.5 2.5 0 1 0 5 0 2.5 2.5 0 0 0-5 0Z" />
      <path d="M4 4l16 16" strokeLinecap="round" />
    </svg>
  );
}
