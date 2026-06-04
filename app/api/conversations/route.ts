import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import DBConnection from "@/app/lib/dbConnect";
import { Conversation } from "@/app/model/Conversation";
import { User } from "@/app/model/User";

export const GET = async () => {
    const session = await getServerSession(authOptions);
    if (!session?.user?._id) {
        return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    try {
        await DBConnection();

        const conversations = await Conversation.find({
            participants: session.user._id,
        })
            .populate("participants", "username _id")
            .sort({ lastMessageAt: -1 });

        return NextResponse.json({ success: true, conversations });
    } catch (error: unknown) {
        console.error("[GET CONVERSATIONS]:", error);
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
};

export const POST = async (req: NextRequest) => {
    const session = await getServerSession(authOptions);
    if (!session?.user?._id) {
        return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    try {
        const { username } = await req.json();
        if (!username?.trim()) {
            return NextResponse.json({ success: false, message: "Username is required" }, { status: 400 });
        }

        await DBConnection();

        // Case-insensitive username lookup; no isVerified filter so all registered users are reachable
        const targetUser = await User.findOne({
            username: { $regex: new RegExp(`^${username.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i") },
        });
        if (!targetUser) {
            return NextResponse.json({ success: false, message: "No user found with that username" }, { status: 404 });
        }

        if (targetUser._id.toString() === session.user._id) {
            return NextResponse.json({ success: false, message: "You cannot message yourself" }, { status: 400 });
        }

        // Return existing conversation if one already exists between the two users
        let conversation = await Conversation.findOne({
            participants: { $all: [session.user._id, targetUser._id], $size: 2 },
        }).populate("participants", "username _id");

        if (!conversation) {
            conversation = await Conversation.create({
                participants: [session.user._id, targetUser._id],
            });
            conversation = await Conversation.findById(conversation._id).populate("participants", "username _id");
        }

        return NextResponse.json({ success: true, conversation });
    } catch (error: unknown) {
        console.error("[POST CONVERSATIONS]:", error);
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
};
