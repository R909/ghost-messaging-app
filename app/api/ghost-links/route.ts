import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import DBConnection from "@/app/lib/dbConnect";
import { GhostLink } from "@/app/model/GhostLink";

const ADJECTIVES = [
  "violet", "moon", "night", "echo", "ember", "frost",
  "shadow", "crimson", "onyx", "azure", "nova", "dusk",
  "cipher", "veil", "pulse", "aether",
];

const EXPIRY_MS: Record<string, number> = {
  "4h": 4 * 60 * 60 * 1000,
  "1d": 24 * 60 * 60 * 1000,
  "7d": 7 * 24 * 60 * 60 * 1000,
};

function generateCode(): string {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const num = Math.floor(Math.random() * 90) + 10;
  return `${adj}-${num}`;
}

export const GET = async () => {
  const session = await getServerSession(authOptions);
  if (!session?.user?._id) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    await DBConnection();

    await GhostLink.deleteMany({ userId: session.user._id, expiresAt: { $lt: new Date() } });

    const links = await GhostLink.find({ userId: session.user._id }).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, links });
  } catch {
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
};

export const POST = async (req: NextRequest) => {
  const session = await getServerSession(authOptions);
  if (!session?.user?._id) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const expiresIn: string = body.expiresIn ?? "1d";

    if (!EXPIRY_MS[expiresIn]) {
      return NextResponse.json(
        { success: false, message: "expiresIn must be one of: 4h, 1d, 7d" },
        { status: 400 }
      );
    }

    await DBConnection();

    let code = generateCode();
    let attempts = 0;
    while ((await GhostLink.exists({ code })) && attempts < 10) {
      code = generateCode();
      attempts++;
    }

    const link = await GhostLink.create({
      userId: session.user._id,
      code,
      status: "active",
      expiresAt: new Date(Date.now() + EXPIRY_MS[expiresIn]),
    });

    return NextResponse.json({ success: true, link }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
};
