import { GhostBackdrop, HomePage } from "../components/home";

const settings = [
  { title: "Ghost Mode", description: "Hides your identity in chats." },
  { title: "Self-destruct Timer", description: "Messages vanish after 24 hours." },
  { title: "Read Receipts", description: "Only show seen ticks on request." },
];

export default function SettingsPage() {
  return (
    <HomePage active="settings">
      <div className="relative flex h-full flex-1 items-center justify-center overflow-hidden p-4 sm:p-6">
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(168,85,247,0.15),transparent_24%),radial-gradient(circle_at_80%_24%,rgba(124,58,237,0.1),transparent_22%),radial-gradient(circle_at_44%_78%,rgba(192,132,252,0.09),transparent_26%)]" />
          <div className="absolute left-[-4rem] bottom-[-5rem] h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(167,139,250,0.22),transparent_68%)] blur-3xl animate-drift" />
          <div className="absolute right-[-5rem] top-[-4rem] h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(124,58,237,0.2),transparent_68%)] blur-3xl animate-pulse-soft" />
          <div className="absolute inset-x-8 top-8 h-px bg-[linear-gradient(90deg,transparent,rgba(216,180,254,0.6),transparent)] opacity-70" />
        </div>
        <GhostBackdrop
          src="/ghost-1.png"
          alt="Floating ghost behind the settings page"
          className="animate-float-slow"
          imageClassName="opacity-[0.1] scale-110"
        />
        <div className="relative z-10 w-full rounded-[1.8rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.025))] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_20px_70px_rgba(0,0,0,0.28)] backdrop-blur-xl">
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
                className="flex items-center justify-between rounded-[1.4rem] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.025))] p-4 transition duration-200 hover:border-violet-400/20 hover:bg-[linear-gradient(180deg,rgba(168,85,247,0.1),rgba(255,255,255,0.03))]"
              >
                <div>
                  <p className="font-medium text-white">{item.title}</p>
                  <p className="text-sm text-white/55">{item.description}</p>
                </div>
                <button
                  className={[
                    "h-8 w-14 rounded-full border p-1 transition",
                    index === 0
                      ? "border-violet-400/30 bg-violet-400/20 shadow-[0_0_18px_rgba(168,85,247,0.15)]"
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
    </HomePage>
  );
}
