import { GhostBackdrop, GhostAvatar, HomePage } from "../components/home";

export default function ProfilePage() {
  return (
    <HomePage active="profile">
      <div className="relative flex h-full flex-1 items-center justify-center overflow-hidden p-4 sm:p-6">
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(168,85,247,0.14),transparent_24%),radial-gradient(circle_at_82%_24%,rgba(124,58,237,0.1),transparent_22%),radial-gradient(circle_at_50%_76%,rgba(192,132,252,0.08),transparent_26%)]" />
          <div className="absolute left-[-5rem] top-[8%] h-60 w-60 rounded-full bg-[radial-gradient(circle,rgba(192,132,252,0.22),transparent_68%)] blur-3xl animate-float-slow" />
          <div className="absolute right-[-4rem] bottom-[-5rem] h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(124,58,237,0.22),transparent_68%)] blur-3xl animate-drift" />
          <div className="absolute inset-x-8 bottom-8 h-px bg-[linear-gradient(90deg,transparent,rgba(216,180,254,0.7),transparent)] opacity-70" />
        </div>
        <GhostBackdrop
          src="/ghost-2.png"
          alt="Floating ghost behind the profile page"
          className="animate-drift"
          imageClassName="opacity-[0.11] scale-110"
        />
        <div className="relative z-10 w-full rounded-[1.8rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.025))] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_20px_70px_rgba(0,0,0,0.28)] backdrop-blur-xl">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 ring-1 ring-white/10">
                <GhostAvatar />
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.28em] text-violet-200/90">
                  Profile
                </p>
                <h1 className="mt-1 text-3xl font-semibold tracking-tight text-white drop-shadow-[0_0_18px_rgba(168,85,247,0.2)]">
                  Ghost_467
                </h1>
                <p className="mt-1 text-sm text-white/60">
                  Anonymous messenger, active today.
                </p>
              </div>
            </div>

            <button className="rounded-2xl bg-gradient-to-br from-[#c084fc] via-[#8b5cf6] to-[#6d28d9] px-5 py-3 font-medium text-white shadow-[0_14px_34px_rgba(124,58,237,0.35)] transition hover:brightness-110">
              Edit Profile
            </button>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <StatCard label="Conversations" value="28" />
            <StatCard label="Ghost Links" value="12" />
            <StatCard label="Secure Streak" value="19 days" />
          </div>
        </div>
      </div>
    </HomePage>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.4rem] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.025))] p-4 transition duration-200 hover:border-violet-400/20 hover:bg-[linear-gradient(180deg,rgba(168,85,247,0.1),rgba(255,255,255,0.03))]">
      <p className="text-sm text-white/55">{label}</p>
      <p className="mt-2 text-3xl font-semibold tracking-tight text-white drop-shadow-[0_0_14px_rgba(168,85,247,0.15)]">
        {value}
      </p>
    </div>
  );
}
