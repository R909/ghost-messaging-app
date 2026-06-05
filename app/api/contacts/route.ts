import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import DBConnection from "@/app/lib/dbConnect";
import { Conversation } from "@/app/model/Conversation";
import { User } from "@/app/model/User";
import mongoose from "mongoose";

// GET /api/contacts — returns all users the current user has had a conversation with
export const GET = async () => {
    const session = await getServerSession(authOptions);
    if (!session?.user?._id) {
        return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    try {
        await DBConnection();

        const conversations = await Conversation.find({
            participants: session.user._id,
        }).populate("participants", "username _id isAcceptingMessages isVerified");

        const selfId = session.user._id.toString();
        const seen = new Set<string>();
        const contacts: { _id: string; username: string; isAcceptingMessages: boolean; isVerified: boolean }[] = [];

        for (const conv of conversations) {
            for (const participant of conv.participants as unknown as { _id: mongoose.Types.ObjectId; username: string; isAcceptingMessages: boolean; isVerified: boolean }[]) {
                const id = participant._id.toString();
                if (id !== selfId && !seen.has(id)) {
                    seen.add(id);
                    contacts.push({
                        _id: id,
                        username: participant.username,
                        isAcceptingMessages: participant.isAcceptingMessages,
                        isVerified: participant.isVerified,
                    });
                }
            }
        }

        return NextResponse.json({ success: true, contacts });
    } catch (error: unknown) {
        console.error("[GET CONTACTS]:", error);
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
};

// GET /api/contacts?search=<query> — search users by username (min 2 chars)
// Reusing GET with query param to keep things in one route handler
// Actually handled above; add search as a separate endpoint approach via POST
// POST /api/contacts — search for a user by username
export const POST = async (req: NextRequest) => {
    const session = await getServerSession(authOptions);
    if (!session?.user?._id) {
        return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    try {
        const { query } = await req.json();
        if (!query?.trim() || query.trim().length < 2) {
            return NextResponse.json({ success: false, message: "Query must be at least 2 characters" }, { status: 400 });
        }

        await DBConnection();

        const sanitized = query.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const users = await User.find({
            username: { $regex: sanitized, $options: "i" },
            _id: { $ne: session.user._id },
            isVerified: true,
        })
            .select("username _id isAcceptingMessages isVerified")
            .limit(10);

        return NextResponse.json({ success: true, users });
    } catch (error: unknown) {
        console.error("[POST CONTACTS SEARCH]:", error);
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
};
