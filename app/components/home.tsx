import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";
import UserProfile from "./UserProfile";

export type GhostRoute =
  | "chats"
  | "ghost-links"
  | "contacts"
  | "settings"
  | "profile";

const navigation = [
  { label: "Chats", href: "/dashboard/chats", route: "chats" as const, icon: ChatBubbleIcon },
  {
    label: "Ghost Links",
    href: "/dashboard/ghost-links",
    route: "ghost-links" as const,
    icon: LinkIcon,
  },
  { label: "Contacts", href: "/dashboard/contacts", route: "contacts" as const, icon: UserIcon },
  { label: "Settings", href: "/dashboard/settings", route: "settings" as const, icon: GearIcon },
  { label: "Profile", href: "/dashboard/profile", route: "profile" as const, icon: UserIcon },
];

export function HomePage({
  active,
  children,
}: {
  active: GhostRoute;
  children: ReactNode;
}) {
  return (
    <main className="min-h-screen overflow-hidden bg-[#030106] text-white">
      <div className="relative isolate flex min-h-screen w-full transition-all duration-500 ease-in-out">
        <BackgroundGlow />

        <section className="relative z-10 flex min-h-screen w-full flex-col overflow-hidden border border-white/10 bg-white/[0.02] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-[40px] transition-all duration-700 cubic-bezier(0.16,1,0.3,1) lg:flex-row m-0 lg:m-4 lg:min-h-[calc(100vh-2rem)] lg:w-[calc(100vw-2rem)] lg:rounded-[2.5rem]">
          
          <aside className="relative flex w-full flex-col border-b border-white/10 bg-black/30 p-4 sm:p-5 backdrop-blur-2xl transition-all duration-500 lg:w-[280px] lg:border-b-0 lg:border-r lg:p-6">
            <div className="flex items-center gap-3 px-2 pb-6 pt-2 transition-transform duration-300 hover:scale-[1.02]">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-white/20 via-violet-500/40 to-fuchsia-600/40 text-2xl shadow-[0_0_30px_rgba(168,85,247,0.3),inset_0_1px_1px_rgba(255,255,255,0.4)] border border-white/20 animate-pulse [animation-duration:4s]">
                👻
              </div>
              <div>
                <p className="text-lg font-semibold tracking-tight text-white/90 drop-shadow-sm">
                  GhostChat
                </p>
                <p className="text-xs tracking-wide text-white/40 uppercase font-medium">Anonymous by design</p>
              </div>
            </div>

            <nav className="mt-1 flex gap-3 overflow-x-auto pb-4 scrollbar-none lg:flex-col lg:overflow-visible lg:pb-0">
              {navigation.map(({ label, href, route, icon: Icon }, navIndex) => {
                const isActive = route === active;
                return (
                  <Link
                    key={label}
                    href={href}
                    style={{ 
                      animationDelay: `${navIndex * 50}ms`,
                    }}
                    className={[
                      "flex min-w-[90px] flex-1 flex-col items-center justify-center gap-2 rounded-2xl border px-3 py-4 text-xs font-medium transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] hover:scale-[1.03] active:scale-[0.97] lg:min-w-0 lg:flex-row lg:justify-start lg:rounded-2xl lg:px-4 lg:py-3.5 animate-fade-in-up",
                      isActive
                        ? "border-violet-400/30 bg-gradient-to-r from-violet-500/15 to-fuchsia-500/15 text-[#eecfff] shadow-[0_12px_24px_-10px_rgba(168,85,247,0.4),inset_0_1px_0_rgba(255,255,255,0.15)] backdrop-blur-md"
                        : "border-white/[0.04] bg-white/[0.02] text-white/50 hover:border-white/10 hover:bg-white/[0.06] hover:text-white/80",
                    ].join(" ")}
                  >
                    <div className={`transition-transform duration-300 ${isActive ? 'scale-110 text-violet-300 drop-shadow-[0_0_8px_rgba(168,85,247,0.6)]' : 'group-hover:scale-105'}`}>
                      <Icon />
                    </div>
                    <span className="text-center lg:text-left transition-colors duration-200">{label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="mt-3 rounded-2xl border border-white/5 bg-gradient-to-b from-white/[0.03] to-transparent p-4 lg:hidden">
              <UserProfile />
            </div>

            <div className="mt-auto hidden rounded-2xl border border-white/5 bg-gradient-to-b from-white/[0.03] to-transparent p-4 lg:block transition-all duration-500 hover:border-white/10 hover:bg-white/[0.04]">
              <UserProfile />
            </div>
          </aside>

          <div className="relative flex flex-1 flex-col overflow-hidden bg-black/[0.05] backdrop-blur-xl transition-all duration-500">
            {children}
          </div>
        </section>

        <div className="pointer-events-none absolute inset-x-0 bottom-6 z-20 text-center text-[11px] font-medium tracking-wide text-white/40 uppercase sm:bottom-8 transition-opacity duration-300">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/5 bg-black/40 px-4 py-2 shadow-[0_8px_32px_rgba(0,0,0,0.4)] backdrop-blur-md">
            <LockIcon />
            Your messages are private and end-to-end encrypted.
          </span>
        </div>
      </div>
    </main>
  );
}

export function GhostBackdrop({
  src,
  alt,
  className = "",
  imageClassName = "",
}: {
  src: string;
  alt: string;
  className?: string;
  imageClassName?: string;
}) {
  return (
    <div
      aria-hidden
      className={[
        "pointer-events-none absolute inset-0 overflow-hidden transition-all duration-700 ease-in-out",
        className,
      ].join(" ")}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(168,85,247,0.12),transparent_40%),radial-gradient(circle_at_30%_80%,rgba(34,211,238,0.05),transparent_36%)] z-[1]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(3,1,6,0.4),rgba(3,1,6,0.75))] z-[2]" />
      <Image
        src={src}
        alt={alt}
        fill
        sizes="100vw"
        className={[
          "object-cover object-center opacity-[0.16] mix-blend-screen filter saturate-[0.8] transition-all duration-1000 ease-out",
          imageClassName,
        ].join(" ")}
        priority={false}
      />
    </div>
  );
}

function BackgroundGlow() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden transition-opacity duration-1000">
      <div className="absolute inset-y-0 left-0 w-[45%] bg-[radial-gradient(circle_at_20%_25%,rgba(147,51,234,0.18),transparent_45%)] opacity-90 blur-2xl" />
      <div className="absolute right-[-10%] top-[-5%] h-[40rem] w-[40rem] rounded-full bg-fuchsia-600/[0.12] blur-[120px] mix-blend-screen animate-pulse [animation-duration:8s]" />
      <div className="absolute left-[15%] top-[15%] h-[24rem] w-[24rem] rounded-full bg-violet-500/[0.08] blur-[100px] mix-blend-screen" />
      <div className="absolute bottom-[-10%] right-[15%] h-[35rem] w-[35rem] rounded-full bg-purple-700/[0.1] blur-[130px] mix-blend-screen" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(3,1,6,0.5),rgba(3,1,6,0.95))]" />
      
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.008)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.008)_1px,transparent_1px)] bg-[size:60px_60px] opacity-60" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,#030106_80%)]" />

      <div className="absolute left-[12%] top-[25%] h-1 w-1 rounded-full bg-violet-300/40 blur-[0.5px] animate-pulse [animation-duration:3s]" />
      <div className="absolute left-[48%] top-[18%] h-1.5 w-1.5 rounded-full bg-fuchsia-300/30 blur-[0.5px] animate-pulse [animation-duration:5s]" />
      <div className="absolute left-[82%] top-[45%] h-1 w-1 rounded-full bg-violet-400/40 blur-[0.5px] animate-pulse [animation-duration:4s]" />
      <div className="absolute left-[28%] top-[68%] h-1.5 w-1.5 rounded-full bg-white/20 blur-[0.5px] animate-pulse [animation-duration:6s]" />
    </div>
  );
}

export function SectionHeaderButton({ children }: { children: ReactNode }) {
  return (
    <button className="grid h-11 w-11 place-items-center rounded-2xl border border-white/[0.06] bg-white/[0.03] text-white/60 shadow-[0_4px_12px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-md transition-all duration-300 cubic-bezier(0.16,1,0.3,1) hover:scale-105 hover:border-white/12 hover:bg-white/[0.08] hover:text-white/90 active:scale-95">
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
    <div className={[ "relative grid place-items-center rounded-full transition-transform duration-300 hover:scale-105", dimensions, accent ].join(" ")}>
      <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_40%_35%,rgba(255,255,255,0.98),rgba(235,215,255,0.95)_52%,rgba(139,92,246,0.4)_100%)] shadow-sm" />
      <span className={`absolute left-[28%] ${eyes} rounded-full bg-[#2a0845] transition-all duration-300`} />
      <span className={`absolute right-[28%] ${eyes} rounded-full bg-[#2a0845] transition-all duration-300`} />
      <div className={[ "absolute -bottom-0.5 left-1/2 -translate-x-1/2 rounded-b-full bg-[linear-gradient(180deg,rgba(255,255,255,1),rgba(216,180,254,1))]", size === "sm" ? "h-2 w-4" : "h-3 w-7" ].join(" ")} />
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