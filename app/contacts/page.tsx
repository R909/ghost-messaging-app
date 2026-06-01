import { GhostBackdrop, GhostAvatar, HomePage } from "../components/home";

const contacts = [
  { name: "Ghost_467", status: "Online now", mood: "Calm" },
  { name: "Night_Owl", status: "Away", mood: "Thinking" },
  { name: "Shadow_77", status: "Busy", mood: "Silent" },
  { name: "Invisible_23", status: "Typing...", mood: "Warm" },
];

export default function ContactsPage() {
  return (
    <HomePage active="contacts">
      <div className="relative flex h-full flex-1 items-center justify-center overflow-hidden p-4 sm:p-6">
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_16%,rgba(168,85,247,0.14),transparent_24%),radial-gradient(circle_at_78%_26%,rgba(124,58,237,0.1),transparent_22%),radial-gradient(circle_at_50%_74%,rgba(192,132,252,0.08),transparent_26%)]" />
          <div className="absolute left-[-5rem] top-[10%] h-60 w-60 rounded-full bg-[radial-gradient(circle,rgba(196,181,253,0.2),transparent_68%)] blur-3xl animate-float-slow" />
          <div className="absolute right-[-3rem] bottom-[-4rem] h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(124,58,237,0.22),transparent_68%)] blur-3xl animate-pulse-soft" />
          <div className="absolute inset-x-8 bottom-8 h-px bg-[linear-gradient(90deg,transparent,rgba(167,139,250,0.7),transparent)] opacity-70" />
        </div>
        <GhostBackdrop
          src="/ghost-3.png"
          alt="Floating ghost behind the contacts page"
          className="animate-pulse-soft"
          imageClassName="opacity-[0.11] scale-110"
        />
        <div className="relative z-10 w-full rounded-[1.8rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.025))] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_20px_70px_rgba(0,0,0,0.28)] backdrop-blur-xl">
          <h1 className="text-3xl font-semibold tracking-tight text-white">
            Contacts
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-white/60">
            A simple static contact roster for now. We can wire this to real data
            later without changing the layout.
          </p>

          <div className="mt-6 grid gap-4">
            {contacts.map((contact) => (
              <div
                key={contact.name}
                className="flex items-center justify-between rounded-[1.4rem] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.025))] p-4 transition duration-200 hover:border-violet-400/20 hover:bg-[linear-gradient(180deg,rgba(168,85,247,0.1),rgba(255,255,255,0.03))]"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/5 ring-1 ring-white/10">
                    <GhostAvatar size="sm" />
                  </div>
                  <div>
                    <p className="font-medium text-white">{contact.name}</p>
                    <p className="text-sm text-white/55">{contact.status}</p>
                  </div>
                </div>
                <span className="rounded-full border border-violet-400/25 bg-violet-500/15 px-3 py-1 text-xs text-violet-100 shadow-[0_0_18px_rgba(168,85,247,0.12)]">
                  {contact.mood}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </HomePage>
  );
}
