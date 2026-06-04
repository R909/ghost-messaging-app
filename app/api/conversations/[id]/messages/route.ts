import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import DBConnection from "@/app/lib/dbConnect";
import { Conversation } from "@/app/model/Conversation";
import { Message } from "@/app/model/Message";

type RouteContext = { params: Promise<{ id: string }> };

export const GET = async (_req: NextRequest, { params }: RouteContext) => {
    const session = await getServerSession(authOptions);
    if (!session?.user?._id) {
        return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    try {
        const { id } = await params;
        await DBConnection();

        const conversation = await Conversation.findOne({
            _id: id,
            participants: session.user._id,
        });
        if (!conversation) {
            return NextResponse.json({ success: false, message: "Conversation not found" }, { status: 404 });
        }

        const messages = await Message.find({ conversationId: id })
            .populate("sender", "username _id")
            .sort({ createdAt: 1 });

        // Mark incoming messages as seen
        await Message.updateMany(
            { conversationId: id, sender: { $ne: session.user._id }, seen: false },
            { seen: true }
        );

        return NextResponse.json({ success: true, messages });
    } catch (error: unknown) {
        console.error("[GET MESSAGES]:", error);
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
};

export const POST = async (req: NextRequest, { params }: RouteContext) => {
    const session = await getServerSession(authOptions);
    if (!session?.user?._id) {
        return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    try {
        const { id } = await params;
        const { content } = await req.json();

        if (!content?.trim()) {
            return NextResponse.json({ success: false, message: "Message content is required" }, { status: 400 });
        }

        await DBConnection();

        const conversation = await Conversation.findOne({
            _id: id,
            participants: session.user._id,
        });
        if (!conversation) {
            return NextResponse.json({ success: false, message: "Conversation not found" }, { status: 404 });
        }

        const message = await Message.create({
            conversationId: id,
            sender: session.user._id,
            content: content.trim(),
        });

        const populated = await Message.findById(message._id).populate("sender", "username _id");

        conversation.lastMessage = content.trim();
        conversation.lastMessageAt = new Date();
        await conversation.save();

        return NextResponse.json({ success: true, message: populated }, { status: 201 });
    } catch (error: unknown) {
        console.error("[POST MESSAGE]:", error);
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
};
