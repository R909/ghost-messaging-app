import { GhostBackdrop, GhostAvatar, HomePage } from "../components/home";

const links = [
  { code: "ghst://violet-13", status: "Active", expiry: "Expires in 4h" },
  { code: "ghst://moon-88", status: "Hidden", expiry: "Expires in 1 day" },
  { code: "ghst://night-07", status: "Shared", expiry: "Expires in 2 days" },
];

export default function GhostLinksPage() {
  return (
    <HomePage active="ghost-links">
      <div className="relative flex h-full flex-1 items-center justify-center overflow-hidden p-4 sm:p-6">
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(168,85,247,0.16),transparent_24%),radial-gradient(circle_at_82%_22%,rgba(59,130,246,0.08),transparent_22%),radial-gradient(circle_at_50%_78%,rgba(168,85,247,0.12),transparent_26%)]" />
          <div className="absolute left-[-6rem] top-[-4rem] h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(192,132,252,0.22),transparent_68%)] blur-3xl animate-pulse-soft" />
          <div className="absolute right-[-4rem] bottom-[-5rem] h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(124,58,237,0.2),transparent_68%)] blur-3xl animate-drift" />
          <div className="absolute inset-x-8 top-8 h-px bg-[linear-gradient(90deg,transparent,rgba(216,180,254,0.65),transparent)] opacity-70" />
        </div>
        <GhostBackdrop
          src="/ghost-2.png"
          alt="Floating ghost behind the ghost links page"
          className="animate-drift"
          imageClassName="opacity-[0.11] scale-110"
        />
        <div className="relative z-10 w-full rounded-[1.8rem] border border-white/10 bg-white/[0.045] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_20px_70px_rgba(0,0,0,0.28)] backdrop-blur-xl animate-slide-up-fade">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-violet-200/90">
                Ghost Links
              </p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white drop-shadow-[0_0_18px_rgba(168,85,247,0.2)]">
                Temporary anonymous links
              </h1>
              <p className="mt-2 max-w-xl text-sm leading-6 text-white/60">
                Share a ghost link instead of a phone number. Each link expires
                automatically and keeps identity hidden.
              </p>
            </div>
            <div className="flex items-center gap-3 rounded-[1.4rem] border border-violet-400/20 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(33,16,51,0.34))] px-4 py-3 shadow-[0_0_24px_rgba(168,85,247,0.12)]">
              <GhostAvatar />
              <div>
                <p className="text-sm font-medium text-white">Link Generator</p>
                <p className="text-xs text-white/55">Create a fresh invite</p>
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-4">
            {links.map((link, index) => (
              <div
                key={link.code}
                style={{ animationDelay: `${index * 100 + 350}ms` }}
                className="flex flex-col gap-4 rounded-[1.5rem] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.025))] p-4 transition duration-200 hover:border-violet-400/25 hover:bg-[linear-gradient(180deg,rgba(168,85,247,0.12),rgba(255,255,255,0.03))] lg:flex-row lg:items-center lg:justify-between animate-slide-up-fade"
              >
                <div>
                  <p className="text-lg font-medium text-white">{link.code}</p>
                  <p className="mt-1 text-sm text-white/55">{link.expiry}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-300">
                    {link.status}
                  </span>
                  <button className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 transition hover:bg-violet-500/15 hover:text-violet-100">
                    Copy
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button className="mt-6 rounded-2xl bg-gradient-to-br from-[#c084fc] via-[#8b5cf6] to-[#6d28d9] px-5 py-3 font-medium text-white shadow-[0_14px_34px_rgba(124,58,237,0.35)] transition hover:brightness-110 active:scale-95 animate-slide-up-fade [animation-delay:700ms]">
            Generate New Link
          </button>
        </div>
      </div>
    </HomePage>
  );
}
