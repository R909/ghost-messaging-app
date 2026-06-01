import { PageShell, GhostAvatar } from "../components/page-shell";

const links = [
  { code: "ghst://violet-13", status: "Active", expiry: "Expires in 4h" },
  { code: "ghst://moon-88", status: "Hidden", expiry: "Expires in 1 day" },
  { code: "ghst://night-07", status: "Shared", expiry: "Expires in 2 days" },
];

export default function GhostLinksPage() {
  return (
    <PageShell active="ghost-links">
      <div className="flex h-full flex-1 items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-4xl rounded-[1.8rem] border border-white/8 bg-white/[0.04] p-5 shadow-[0_12px_50px_rgba(0,0,0,0.25)]">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-violet-300/80">
                Ghost Links
              </p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">
                Temporary anonymous links
              </h1>
              <p className="mt-2 max-w-xl text-sm leading-6 text-white/60">
                Share a ghost link instead of a phone number. Each link expires
                automatically and keeps identity hidden.
              </p>
            </div>
            <div className="flex items-center gap-3 rounded-[1.4rem] border border-white/8 bg-black/20 px-4 py-3">
              <GhostAvatar />
              <div>
                <p className="text-sm font-medium text-white">Link Generator</p>
                <p className="text-xs text-white/55">Create a fresh invite</p>
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-4">
            {links.map((link) => (
              <div
                key={link.code}
                className="flex flex-col gap-4 rounded-[1.5rem] border border-white/8 bg-white/[0.03] p-4 lg:flex-row lg:items-center lg:justify-between"
              >
                <div>
                  <p className="text-lg font-medium text-white">{link.code}</p>
                  <p className="mt-1 text-sm text-white/55">{link.expiry}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-300">
                    {link.status}
                  </span>
                  <button className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 transition hover:bg-white/10">
                    Copy
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button className="mt-6 rounded-2xl bg-gradient-to-br from-[#b06cff] to-[#7d3cff] px-5 py-3 font-medium text-white">
            Generate New Link
          </button>
        </div>
      </div>
    </PageShell>
  );
}
