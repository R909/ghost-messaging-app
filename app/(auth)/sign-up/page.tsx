"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { signUpSchema } from "@/app/schemas/signUpSchems";
import { GhostAuthScene } from "../../components/ghost-auth-scene";

const registerSchema = signUpSchema.extend({
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type RegisterValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterValues) => {
    setIsLoading(true);
    setServerError(null);
    try {
      const res = await fetch("/api/sign-up", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: data.username,
          email: data.email,
          password: data.password,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        setServerError(json.message || "Registration failed. Please try again.");
        return;
      }
      router.push(`/verify/${data.username}`);
    } catch {
      setServerError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <GhostAuthScene
      title="Create Account"
      subtitle="Join the anonymous world"
      backHref="/sign-in"
      backLabel="Already have an account? Login"
      ghostSrc="/ghost-2.png"
      slideDirection="right"
    >
      <form className="space-y-4 pt-2" onSubmit={handleSubmit(onSubmit)}>
        {serverError && (
          <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-xs text-red-300">
            {serverError}
          </div>
        )}

        <div className="space-y-2">
          <label
            htmlFor="register-username"
            className="text-[10px] font-semibold uppercase tracking-[0.25em] text-white/45"
          >
            Username / Alias
          </label>
          <div
            className={`relative rounded-xl border transition-all duration-300 ${
              focusedField === "username"
                ? "border-violet-400/50 bg-[#140f26] shadow-[0_0_20px_rgba(168,85,247,0.15)]"
                : errors.username
                  ? "border-red-400/40 bg-[#0e0a1a]"
                  : "border-white/10 bg-[#0e0a1a]"
            }`}
          >
            <span
              className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors duration-300 ${focusedField === "username" ? "text-violet-400" : "text-white/30"}`}
            >
              <UserIcon />
            </span>
            <input
              id="register-username"
              type="text"
              placeholder="Your Alias"
              {...register("username")}
              onFocus={() => setFocusedField("username")}
              onBlur={() => setFocusedField(null)}
              className="h-11 w-full bg-transparent pl-11 pr-4 text-sm text-white outline-none placeholder:text-white/20"
            />
          </div>
          {errors.username && (
            <p className="text-[11px] text-red-400">{errors.username.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label
            htmlFor="register-email"
            className="text-[10px] font-semibold uppercase tracking-[0.25em] text-white/45"
          >
            Email Address
          </label>
          <div
            className={`relative rounded-xl border transition-all duration-300 ${
              focusedField === "email"
                ? "border-violet-400/50 bg-[#140f26] shadow-[0_0_20px_rgba(168,85,247,0.15)]"
                : errors.email
                  ? "border-red-400/40 bg-[#0e0a1a]"
                  : "border-white/10 bg-[#0e0a1a]"
            }`}
          >
            <span
              className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors duration-300 ${focusedField === "email" ? "text-violet-400" : "text-white/30"}`}
            >
              <MailIcon />
            </span>
            <input
              id="register-email"
              type="email"
              placeholder="ghost@network.com"
              {...register("email")}
              onFocus={() => setFocusedField("email")}
              onBlur={() => setFocusedField(null)}
              className="h-11 w-full bg-transparent pl-11 pr-4 text-sm text-white outline-none placeholder:text-white/20"
            />
          </div>
          {errors.email && (
            <p className="text-[11px] text-red-400">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label
            htmlFor="register-password"
            className="text-[10px] font-semibold uppercase tracking-[0.25em] text-white/45"
          >
            Password
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
              id="register-password"
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

        <div className="space-y-2">
          <label
            htmlFor="register-confirm"
            className="text-[10px] font-semibold uppercase tracking-[0.25em] text-white/45"
          >
            Confirm Password
          </label>
          <div
            className={`relative rounded-xl border transition-all duration-300 ${
              focusedField === "confirm"
                ? "border-violet-400/50 bg-[#140f26] shadow-[0_0_20px_rgba(168,85,247,0.15)]"
                : errors.confirmPassword
                  ? "border-red-400/40 bg-[#0e0a1a]"
                  : "border-white/10 bg-[#0e0a1a]"
            }`}
          >
            <span
              className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors duration-300 ${focusedField === "confirm" ? "text-violet-400" : "text-white/30"}`}
            >
              <LockIcon />
            </span>
            <input
              id="register-confirm"
              type={showConfirm ? "text" : "password"}
              placeholder="••••••••••••"
              {...register("confirmPassword")}
              onFocus={() => setFocusedField("confirm")}
              onBlur={() => setFocusedField(null)}
              className="h-11 w-full bg-transparent pl-11 pr-11 text-sm text-white outline-none placeholder:text-white/20"
            />
            <button
              type="button"
              onClick={() => setShowConfirm((p) => !p)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
            >
              {showConfirm ? <EyeIcon /> : <EyeOffIcon />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-[11px] text-red-400">{errors.confirmPassword.message}</p>
          )}
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="mt-2 flex h-11 w-full items-center justify-center rounded-xl bg-gradient-to-r from-[#7b3df0] via-[#8d43ff] to-[#c65dff] text-sm font-medium text-white shadow-[0_12px_30px_rgba(136,68,255,0.35)] transition-all duration-300 hover:brightness-110 hover:shadow-[0_15px_35px_rgba(136,68,255,0.5)] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isLoading ? "Creating Account..." : "Create Account"}
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

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="4.5" y="6.5" width="15" height="11" rx="2" />
      <path d="M5.5 8l6.5 5 6.5-5" strokeLinecap="round" strokeLinejoin="round" />
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
