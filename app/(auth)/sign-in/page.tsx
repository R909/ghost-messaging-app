"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { signInSchema } from "@/app/schemas/signInSchema";
import { GhostAuthScene } from "../../components/ghost-auth-scene";

type SignInValues = z.infer<typeof signInSchema>;

export default function LoginPage() {
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = async (data: SignInValues) => {
    setIsLoading(true);
    setAuthError(null);
    try {
      const result = await signIn("credentials", {
        identifier: data.identifier,
        password: data.password,
        redirect: false,
      });
      if (result?.error) {
        setAuthError(result.error);
      } else if (result?.ok) {
        router.replace("/dashboard");
        router.refresh();
      }
    } catch {
      setAuthError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <GhostAuthScene
      title="Access Dashboard"
      subtitle="Re-establish your anonymous terminal session"
      backHref="/sign-up"
      backLabel="Don't have an encrypted account? Register"
      ghostSrc="/ghost-1.png"
      slideDirection="left"
    >
      <form className="space-y-4 pt-2" onSubmit={handleSubmit(onSubmit)}>
        {authError && (
          <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-xs text-red-300">
            {authError}
          </div>
        )}

        <div className="space-y-2">
          <label
            htmlFor="login-identifier"
            className="text-[10px] font-semibold uppercase tracking-[0.25em] text-white/45"
          >
            Terminal Handle / Email
          </label>
          <div
            className={`relative rounded-xl border transition-all duration-300 ${
              focusedField === "identifier"
                ? "border-violet-400/50 bg-[#140f26] shadow-[0_0_20px_rgba(168,85,247,0.15)]"
                : errors.identifier
                  ? "border-red-400/40 bg-[#0e0a1a]"
                  : "border-white/10 bg-[#0e0a1a]"
            }`}
          >
            <span
              className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors duration-300 ${focusedField === "identifier" ? "text-violet-400" : "text-white/30"}`}
            >
              <UserIcon />
            </span>
            <input
              id="login-identifier"
              type="text"
              placeholder="ghost_user or email"
              {...register("identifier")}
              onFocus={() => setFocusedField("identifier")}
              onBlur={() => setFocusedField(null)}
              className="h-11 w-full bg-transparent pl-11 pr-4 text-sm text-white outline-none placeholder:text-white/20"
            />
          </div>
          {errors.identifier && (
            <p className="text-[11px] text-red-400">{errors.identifier.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label
            htmlFor="login-password"
            className="text-[10px] font-semibold uppercase tracking-[0.25em] text-white/45"
          >
            Secret Access Token
          </label>
          <div
            className={`relative rounded-xl border transition-all duration-300 ${
              focusedField === "password"
                ? "border-violet-400/50 bg-[#140f26] shadow-[0_0_20px_rgba(168,85,247,0.15)]"
                : errors.password
                  ? "border-red-400/40 bg-[#0e0a1a]"
                  : "border-white/10 bg-[#0e0a1a]"
            }`}
          >
            <span
              className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors duration-300 ${focusedField === "password" ? "text-violet-400" : "text-white/30"}`}
            >
              <LockIcon />
            </span>
            <input
              id="login-password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••••••"
              {...register("password")}
              onFocus={() => setFocusedField("password")}
              onBlur={() => setFocusedField(null)}
              className="h-11 w-full bg-transparent pl-11 pr-11 text-sm text-white outline-none placeholder:text-white/20"
            />
            <button
              type="button"
              onClick={() => setShowPassword((p) => !p)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
            >
              {showPassword ? <EyeIcon /> : <EyeOffIcon />}
            </button>
          </div>
          {errors.password && (
            <p className="text-[11px] text-red-400">{errors.password.message}</p>
          )}
        </div>

        <div className="flex items-center justify-between gap-3 pt-1 text-xs text-white/50">
          <label className="flex items-center gap-2 cursor-pointer select-none hover:text-white/80 transition-colors">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-white/20 bg-transparent text-violet-500 focus:ring-offset-0 focus:ring-violet-400/50"
            />
            Keep Session Alive
          </label>
          <Link href="#" className="text-white/45 transition hover:text-violet-300">
            Recover Passphrase
          </Link>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="mt-2 flex h-11 w-full items-center justify-center rounded-xl bg-gradient-to-r from-[#7b3df0] via-[#8d43ff] to-[#c65dff] text-sm font-medium text-white shadow-[0_12px_30px_rgba(136,68,255,0.35)] transition-all duration-300 hover:brightness-110 hover:shadow-[0_15px_35px_rgba(136,68,255,0.5)] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isLoading ? "Authenticating..." : "Initialize Session"}
        </button>
      </form>
    </GhostAuthScene>
  );
}

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 12a3.9 3.9 0 1 0 0-7.8 3.9 3.9 0 0 0 0 7.8Z" />
      <path d="M4.5 20c1.4-3 3.8-4.4 7.5-4.4s6.1 1.4 7.5 4.4" strokeLinecap="round" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="5.5" y="10.5" width="13" height="8.5" rx="2" />
      <path d="M8 10.5V8.6a4 4 0 0 1 8 0v1.9" strokeLinecap="round" />
    </svg>
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
