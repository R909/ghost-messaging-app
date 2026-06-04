import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import DBConnection from "@/app/lib/dbConnect";
import { User } from "@/app/model/User";
import { Conversation } from "@/app/model/Conversation";
import { Message } from "@/app/model/Message";

export const GET = async () => {
    const session = await getServerSession(authOptions);
    if (!session?.user?._id) {
        return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    try {
        await DBConnection();

        const user = await User.findById(session.user._id).select(
            "username email isAcceptingMessages isVerified createdAt"
        );
        if (!user) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        }

        const [conversations, messagesSent] = await Promise.all([
            Conversation.countDocuments({ participants: session.user._id }),
            Message.countDocuments({ sender: session.user._id }),
        ]);

        return NextResponse.json({
            success: true,
            profile: {
                username: user.username,
                email: user.email,
                isAcceptingMessages: user.isAcceptingMessages,
                isVerified: user.isVerified,
                createdAt: user.createdAt,
            },
            stats: { conversations, messagesSent },
        });
    } catch (error: unknown) {
        console.error("[GET PROFILE]:", error);
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
};

export const PATCH = async (req: NextRequest) => {
    const session = await getServerSession(authOptions);
    if (!session?.user?._id) {
        return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    try {
        const { isAcceptingMessages } = await req.json();

        if (typeof isAcceptingMessages !== "boolean") {
            return NextResponse.json(
                { success: false, message: "isAcceptingMessages must be a boolean" },
                { status: 400 }
            );
        }

        await DBConnection();

        await User.findByIdAndUpdate(session.user._id, { isAcceptingMessages });

        return NextResponse.json({
            success: true,
            message: `Messages ${isAcceptingMessages ? "enabled" : "disabled"} successfully`,
        });
    } catch (error: unknown) {
        console.error("[PATCH PROFILE]:", error);
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
};
