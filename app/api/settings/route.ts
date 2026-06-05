import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import DBConnection from "@/app/lib/dbConnect";
import { User } from "@/app/model/User";
import { Conversation } from "@/app/model/Conversation";
import { Message } from "@/app/model/Message";
import bcrypt from "bcryptjs";

export const PATCH = async (req: NextRequest) => {
    const session = await getServerSession(authOptions);
    if (!session?.user?._id) {
        return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        await DBConnection();

        if (body.type === "username") {
            const { newUsername } = body as { newUsername: string };
            if (!newUsername?.trim() || newUsername.trim().length < 3) {
                return NextResponse.json({ success: false, message: "Username must be at least 3 characters" }, { status: 400 });
            }
            if (newUsername.trim().length > 30) {
                return NextResponse.json({ success: false, message: "Username must be 30 characters or fewer" }, { status: 400 });
            }

            const taken = await User.findOne({
                username: { $regex: new RegExp(`^${newUsername.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i") },
                _id: { $ne: session.user._id },
            });
            if (taken) {
                return NextResponse.json({ success: false, message: "Username is already taken" }, { status: 409 });
            }

            await User.findByIdAndUpdate(session.user._id, { username: newUsername.trim() });
            return NextResponse.json({ success: true, message: "Username updated successfully" });
        }

        if (body.type === "password") {
            const { currentPassword, newPassword } = body as { currentPassword: string; newPassword: string };

            if (!currentPassword || !newPassword) {
                return NextResponse.json({ success: false, message: "Both current and new password are required" }, { status: 400 });
            }
            if (newPassword.length < 6) {
                return NextResponse.json({ success: false, message: "New password must be at least 6 characters" }, { status: 400 });
            }

            const user = await User.findById(session.user._id).select("password");
            if (!user) return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });

            const match = await bcrypt.compare(currentPassword, user.password);
            if (!match) {
                return NextResponse.json({ success: false, message: "Current password is incorrect" }, { status: 400 });
            }

            const hashed = await bcrypt.hash(newPassword, 10);
            await User.findByIdAndUpdate(session.user._id, { password: hashed });
            return NextResponse.json({ success: true, message: "Password updated successfully" });
        }

        return NextResponse.json({ success: false, message: "Invalid request type" }, { status: 400 });

    } catch (error: unknown) {
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
};

export const DELETE = async (req: NextRequest) => {
    const session = await getServerSession(authOptions);
    if (!session?.user?._id) {
        return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    try {
        const { password } = await req.json();
        if (!password) {
            return NextResponse.json({ success: false, message: "Password is required to delete your account" }, { status: 400 });
        }

        await DBConnection();

        const user = await User.findById(session.user._id).select("password");
        if (!user) return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return NextResponse.json({ success: false, message: "Incorrect password" }, { status: 400 });
        }

        const convIds = await Conversation.find({ participants: session.user._id }).distinct("_id");
        await Message.deleteMany({ conversationId: { $in: convIds } });
        await Conversation.deleteMany({ participants: session.user._id });
        await User.findByIdAndDelete(session.user._id);

        return NextResponse.json({ success: true, message: "Account deleted successfully" });
    } catch (error: unknown) {
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
};
