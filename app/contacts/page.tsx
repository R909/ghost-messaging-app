import { PageShell, GhostAvatar } from "../components/page-shell";

const contacts = [
  { name: "Ghost_467", status: "Online now", mood: "Calm" },
  { name: "Night_Owl", status: "Away", mood: "Thinking" },
  { name: "Shadow_77", status: "Busy", mood: "Silent" },
  { name: "Invisible_23", status: "Typing...", mood: "Warm" },
];

export default function ContactsPage() {
  return (
    <PageShell active="contacts">
      <div className="flex h-full flex-1 items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-4xl rounded-[1.8rem] border border-white/8 bg-white/[0.04] p-5">
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
                className="flex items-center justify-between rounded-[1.4rem] border border-white/8 bg-white/[0.03] p-4"
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
                <span className="rounded-full border border-violet-400/20 bg-violet-500/10 px-3 py-1 text-xs text-violet-200">
                  {contact.mood}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageShell>
  );
}
