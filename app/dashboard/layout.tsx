import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: "GhostChat",
  description: "A ghost-inspired private messaging UI with static demo data.",
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
        <>{children}</>
  );
}
