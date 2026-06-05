import { NextRequest, NextResponse } from "next/server";
import DBConnection from "@/app/lib/dbConnect";
import { GhostLink } from "@/app/model/GhostLink";
import { User } from "@/app/model/User";

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json().catch(() => null);

    if (!body) {
      return NextResponse.json({ success: false, message: "Invalid request body" }, { status: 400 });
    }

    const { code, message } = body;

    if (!code || typeof code !== "string" || code.trim().length === 0) {
      return NextResponse.json({ success: false, message: "Link code is required" }, { status: 400 });
    }

    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return NextResponse.json({ success: false, message: "Message is required" }, { status: 400 });
    }

    if (message.trim().length > 1000) {
      return NextResponse.json(
        { success: false, message: "Message too long (max 1000 characters)" },
        { status: 400 }
      );
    }

    await DBConnection();

    const link = await GhostLink.findOne({
      code: code.trim(),
      status: "active",
      expiresAt: { $gt: new Date() },
    });

    if (!link) {
      return NextResponse.json(
        { success: false, message: "Ghost link not found or has expired" },
        { status: 404 }
      );
    }

    const user = await User.findById(link.userId).select("isAcceptingMessages");

    if (!user?.isAcceptingMessages) {
      return NextResponse.json(
        { success: false, message: "This user is not accepting messages right now" },
        { status: 403 }
      );
    }

    await User.findByIdAndUpdate(link.userId, {
      $push: { messages: message.trim() },
    });

    return NextResponse.json({ success: true, message: "Message sent successfully" });
  } catch {
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
};
