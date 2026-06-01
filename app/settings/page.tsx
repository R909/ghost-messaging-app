import { PageShell } from "../components/page-shell";

const settings = [
  { title: "Ghost Mode", description: "Hides your identity in chats." },
  { title: "Self-destruct Timer", description: "Messages vanish after 24 hours." },
  { title: "Read Receipts", description: "Only show seen ticks on request." },
];

export default function SettingsPage() {
  return (
    <PageShell active="settings">
      <div className="flex h-full flex-1 items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-4xl rounded-[1.8rem] border border-white/8 bg-white/[0.04] p-5">
          <h1 className="text-3xl font-semibold tracking-tight text-white">
            Settings
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-white/60">
            These are placeholder preferences for the static version. We can turn
            them into real toggles later.
          </p>

          <div className="mt-6 space-y-4">
            {settings.map((item, index) => (
              <div
                key={item.title}
                className="flex items-center justify-between rounded-[1.4rem] border border-white/8 bg-white/[0.03] p-4"
              >
                <div>
                  <p className="font-medium text-white">{item.title}</p>
                  <p className="text-sm text-white/55">{item.description}</p>
                </div>
                <button
                  className={[
                    "h-8 w-14 rounded-full border p-1 transition",
                    index === 0
                      ? "border-emerald-400/30 bg-emerald-400/15"
                      : "border-white/10 bg-black/20",
                  ].join(" ")}
                >
                  <span
                    className={[
                      "block h-6 w-6 rounded-full bg-white shadow-[0_0_20px_rgba(255,255,255,0.2)] transition",
                      index === 0 ? "translate-x-6" : "translate-x-0",
                    ].join(" ")}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageShell>
  );
}
