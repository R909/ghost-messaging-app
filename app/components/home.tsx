import Link from "next/link";
import type { ReactNode } from "react";

export type GhostRoute =
  | "chats"
  | "ghost-links"
  | "contacts"
  | "settings"
  | "profile";

const navigation = [
  { label: "Chats", href: "/chats", route: "chats" as const, icon: ChatBubbleIcon },
  {
    label: "Ghost Links",
    href: "/ghost-links",
    route: "ghost-links" as const,
    icon: LinkIcon,
  },
  { label: "Contacts", href: "/contacts", route: "contacts" as const, icon: UserIcon },
  { label: "Settings", href: "/settings", route: "settings" as const, icon: GearIcon },
  { label: "Profile", href: "/profile", route: "profile" as const, icon: UserIcon },
];

export function HomePage({
  active,
  children,
}: {
  active: GhostRoute;
  children: ReactNode;
}) {
  return (
    <main className="min-h-screen overflow-hidden bg-[#050309] text-white">
      <div className="relative isolate flex min-h-screen items-center justify-center px-3 py-4 sm:px-6 lg:px-8">
        <BackgroundGlow />

        <section className="relative z-10 flex w-full flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 shadow-[0_30px_120px_rgba(0,0,0,0.55)] backdrop-blur-2xl lg:h-[calc(100vh-2rem)] lg:min-h-[780px] lg:flex-row">
          <aside className="relative flex w-full flex-col border-b border-white/10 bg-[#0d0a14]/90 p-4 sm:p-5 lg:w-[270px] lg:border-b-0 lg:border-r">
            <div className="flex items-center gap-3 px-2 pb-5 pt-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#f0d9ff] via-[#c07cff] to-[#7b35ff] text-2xl shadow-[0_0_30px_rgba(170,91,255,0.45)]">
                👻
              </div>
              <div>
                <p className="text-lg font-semibold tracking-tight text-white">
                  GhostChat
                </p>
                <p className="text-xs text-white/55">Anonymous by design</p>
              </div>
            </div>

            <nav className="mt-1 flex gap-3 overflow-x-auto pb-4 lg:flex-col lg:overflow-visible lg:pb-0">
              {navigation.map(({ label, href, route, icon: Icon }) => {
                const isActive = route === active;
                return (
                  <Link
                    key={label}
                    href={href}
                    className={[
                      "flex min-w-[82px] flex-1 flex-col items-center justify-center gap-2 rounded-2xl border px-3 py-4 text-xs transition duration-200 lg:min-w-0 lg:flex-row lg:justify-start lg:rounded-3xl lg:px-4",
                      isActive
                        ? "border-violet-400/40 bg-violet-500/20 text-[#e7d3ff] shadow-[0_0_30px_rgba(159,86,255,0.18)]"
                        : "border-white/8 bg-white/[0.03] text-white/60 hover:border-white/15 hover:bg-white/[0.05]",
                    ].join(" ")}
                  >
                    <Icon />
                    <span className="text-center lg:text-left">{label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="mt-auto hidden rounded-[1.5rem] border border-white/8 bg-[linear-gradient(180deg,rgba(147,51,234,0.14),rgba(8,8,16,0.35))] p-4 lg:block">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 text-lg">
                  <GhostAvatar size="sm" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Ghost Mode</p>
                  <p className="text-xs text-white/55">End-to-end encrypted</p>
                </div>
              </div>
              <div className="mt-4 rounded-2xl border border-emerald-400/20 bg-emerald-400/8 px-3 py-2 text-xs text-emerald-300">
                Your messages self-destruct in 24 hours.
              </div>
            </div>
          </aside>

          <div className="relative flex flex-1 flex-col overflow-hidden">{children}</div>
        </section>

        <div className="pointer-events-none absolute inset-x-0 bottom-4 text-center text-[11px] text-white/40 sm:bottom-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/8 bg-black/20 px-3 py-2">
            <LockIcon />
            Your messages are private and end-to-end encrypted.
          </span>
        </div>

        <div className="pointer-events-none absolute right-6 top-1/2 hidden -translate-y-1/2 lg:block">
          <div className="relative h-[280px] w-[160px]">
            <div className="absolute inset-x-0 bottom-0 h-[170px] rounded-[50%_50%_28%_28%] bg-[radial-gradient(circle_at_50%_15%,rgba(255,209,255,0.95),rgba(196,111,255,0.82)_56%,rgba(100,33,150,0.15)_100%)] blur-[0.2px] shadow-[0_0_80px_rgba(174,92,255,0.4)]" />
            <div className="absolute left-1/2 top-[18px] h-[120px] w-[108px] -translate-x-1/2 rounded-[50%_50%_44%_44%] bg-[radial-gradient(circle_at_50%_32%,rgba(255,243,255,1),rgba(226,181,255,0.95)_62%,rgba(121,49,169,0.55)_100%)] shadow-[0_0_80px_rgba(197,128,255,0.65)]">
              <span className="absolute left-[31px] top-[38px] h-4 w-4 rounded-full bg-[#3a1258]" />
              <span className="absolute right-[31px] top-[38px] h-4 w-4 rounded-full bg-[#3a1258]" />
            </div>
            <div className="absolute left-1/2 top-[126px] h-[90px] w-[130px] -translate-x-1/2 rounded-[42%_42%_44%_44%] [clip-path:polygon(0%_0%,100%_0%,100%_62%,88%_86%,72%_74%,58%_93%,43%_76%,28%_91%,14%_74%,0%_88%)] bg-[radial-gradient(circle_at_50%_30%,rgba(255,227,255,0.92),rgba(196,114,255,0.75)_50%,rgba(111,39,163,0.12)_100%)]" />
          </div>
        </div>
      </div>
    </main>
  );
}

function BackgroundGlow() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-y-0 left-0 w-[36%] bg-[radial-gradient(circle_at_18%_20%,rgba(154,73,255,0.22),transparent_32%),linear-gradient(90deg,rgba(69,26,118,0.2),transparent_70%)] opacity-80" />
      <div className="absolute right-[-8%] top-[8%] h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(circle,rgba(141,63,255,0.23),transparent_62%)] blur-3xl" />
      <div className="absolute left-[12%] top-[10%] h-[18rem] w-[18rem] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.05),transparent_70%)] blur-3xl" />
      <div className="absolute bottom-[-6rem] right-[18%] h-[24rem] w-[24rem] rounded-full bg-[radial-gradient(circle,rgba(120,44,210,0.16),transparent_68%)] blur-3xl" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,4,11,0.68),rgba(6,4,11,0.92))]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:90px_90px] opacity-[0.35]" />
    </div>
  );
}

export function SectionHeaderButton({ children }: { children: ReactNode }) {
  return (
    <button className="grid h-11 w-11 place-items-center rounded-2xl border border-white/8 bg-white/[0.04] text-white/70 transition hover:bg-white/10">
      {children}
    </button>
  );
}

export function GhostAvatar({
  size = "md",
  accent = "",
}: {
  size?: "sm" | "md";
  accent?: string;
}) {
  const dimensions = size === "sm" ? "h-6 w-6" : "h-10 w-10";
  const eyes = size === "sm" ? "h-1.5 w-1.5 top-2.5" : "h-2.5 w-2.5 top-[11px]";

  return (
    <div
      className={[
        "relative grid place-items-center rounded-full",
        dimensions,
        accent,
      ].join(" ")}
    >
      <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_40%_35%,rgba(255,255,255,0.96),rgba(232,206,255,0.9)_52%,rgba(121,59,170,0.35)_100%)]" />
      <span className={`absolute left-[28%] ${eyes} rounded-full bg-[#35124f]`} />
      <span className={`absolute right-[28%] ${eyes} rounded-full bg-[#35124f]`} />
      <div
        className={[
          "absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-b-full bg-[linear-gradient(180deg,rgba(255,255,255,0.9),rgba(206,149,255,0.9))]",
          size === "sm" ? "h-2 w-4" : "h-3 w-7",
        ].join(" ")}
      />
    </div>
  );
}

function ChatBubbleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M7 8.5h10M7 12h6" strokeLinecap="round" />
      <path d="M5.5 4.5h13a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H10l-4.5 3v-3H5.5a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2Z" />
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M10 13a5 5 0 0 1 0-7l1-1a5 5 0 1 1 7 7l-1 1" strokeLinecap="round" />
      <path d="M14 11a5 5 0 0 1 0 7l-1 1a5 5 0 1 1-7-7l1-1" strokeLinecap="round" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
      <path d="M4.5 20c1.7-3.4 4.6-5 7.5-5s5.8 1.6 7.5 5" strokeLinecap="round" />
    </svg>
  );
}

function GearIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M10.2 3.8h3.6l.7 2.2c.5.1 1.1.4 1.6.7l2.1-1.1 2.5 2.5-1.1 2.1c.3.5.5 1.1.7 1.6l2.2.7v3.6l-2.2.7c-.1.5-.4 1.1-.7 1.6l1.1 2.1-2.5 2.5-2.1-1.1c-.5.3-1.1.5-1.6.7l-.7 2.2h-3.6l-.7-2.2a6.7 6.7 0 0 1-1.6-.7l-2.1 1.1-2.5-2.5 1.1-2.1c-.3-.5-.5-1.1-.7-1.6l-2.2-.7v-3.6l2.2-.7c.1-.5.4-1.1.7-1.6L3.8 7.6l2.5-2.5 2.1 1.1c.5-.3 1.1-.5 1.6-.7l.7-2.2Z" />
      <path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="5.5" y="11" width="13" height="8.5" rx="2" />
      <path d="M8 11V8.8a4 4 0 0 1 8 0V11" strokeLinecap="round" />
    </svg>
  );
}
