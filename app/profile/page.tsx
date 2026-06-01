import { PageShell, GhostAvatar } from "../components/page-shell";

export default function ProfilePage() {
  return (
    <PageShell active="profile">
      <div className="flex h-full flex-1 items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-4xl rounded-[1.8rem] border border-white/8 bg-white/[0.04] p-5">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 ring-1 ring-white/10">
                <GhostAvatar />
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.28em] text-violet-300/80">
                  Profile
                </p>
                <h1 className="mt-1 text-3xl font-semibold tracking-tight text-white">
                  Ghost_467
                </h1>
                <p className="mt-1 text-sm text-white/60">
                  Anonymous messenger, active today.
                </p>
              </div>
            </div>

            <button className="rounded-2xl bg-gradient-to-br from-[#b06cff] to-[#7d3cff] px-5 py-3 font-medium text-white">
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
    </PageShell>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.4rem] border border-white/8 bg-white/[0.03] p-4">
      <p className="text-sm text-white/55">{label}</p>
      <p className="mt-2 text-3xl font-semibold tracking-tight text-white">
        {value}
      </p>
    </div>
  );
}
