import { NextRequest, NextResponse } from "next/server";
import DBConnection from "@/app/lib/dbConnect";
import { User } from "@/app/model/User";

export const POST = async (req: NextRequest) => {
  try {
    await DBConnection();
    const { username, code } = await req.json();

    if (!username || !code) {
      return NextResponse.json(
        { success: false, message: "Username and verification code are required." },
        { status: 400 }
      );
    }

    const user = await User.findOne({ username });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found." },
        { status: 404 }
      );
    }

    if (user.isVerified) {
      return NextResponse.json(
        { success: false, message: "Account is already verified." },
        { status: 400 }
      );
    }

    if (user.verifyCode !== code) {
      return NextResponse.json(
        { success: false, message: "Invalid verification code." },
        { status: 400 }
      );
    }

    if (new Date() > new Date(user.verifyCodeExpire)) {
      return NextResponse.json(
        { success: false, message: "Verification code has expired. Please sign up again to receive a new code." },
        { status: 400 }
      );
    }

    user.isVerified = true;
    await user.save();

    return NextResponse.json(
      { success: true, message: "Account verified successfully. You can now sign in." },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("[VERIFY CODE ERROR]:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error. Please try again later." },
      { status: 500 }
    );
  }
};
