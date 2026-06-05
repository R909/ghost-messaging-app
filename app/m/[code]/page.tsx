import { notFound } from "next/navigation";
import DBConnection from "@/app/lib/dbConnect";
import { GhostLink } from "@/app/model/GhostLink";
import GhostMessageForm from "./GhostMessageForm";

interface Props {
  params: Promise<{ code: string }>;
}

export default async function GhostMessagePage({ params }: Props) {
  const { code } = await params;

  await DBConnection();

  const link = await GhostLink.findOne({
    code,
    status: "active",
    expiresAt: { $gt: new Date() },
  }).lean();

  if (!link) {
    notFound();
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#030106]" style={{ fontFamily: "var(--font-geist-sans, system-ui, sans-serif)" }}>
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(168,85,247,0.18),transparent_30%),radial-gradient(circle_at_80%_70%,rgba(124,58,237,0.14),transparent_30%)]" />
        <div className="absolute left-[-6rem] top-[-4rem] h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(192,132,252,0.18),transparent_68%)] blur-3xl" />
        <div className="absolute right-[-4rem] bottom-[-4rem] h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(109,40,217,0.18),transparent_68%)] blur-3xl" />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          <div className="mb-8 flex flex-col items-center gap-3 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-400/20 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(33,16,51,0.4))] shadow-[0_10px_30px_rgba(168,85,247,0.15)]">
              <svg className="h-7 w-7 text-violet-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
              </svg>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-violet-300/80 font-semibold">Ghost Message</p>
              <h1 className="mt-1.5 text-2xl font-semibold tracking-tight text-white">Send Anonymously</h1>
              <p className="mt-2 text-sm leading-6 text-white/45">
                Your identity will never be revealed. This link expires automatically.
              </p>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_30px_80px_rgba(0,0,0,0.4)] backdrop-blur-2xl">
            <GhostMessageForm code={code} />
          </div>

          <p className="mt-6 text-center text-xs text-white/25">
            Powered by Ghost Messaging · Messages are end-to-end private
          </p>
        </div>
      </div>
    </div>
  );
}
