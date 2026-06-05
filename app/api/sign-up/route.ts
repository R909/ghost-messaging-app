import { sendVerificationEmail } from "@/app/helper/sendVerificationEmail";
import bcrypt from "bcryptjs";
import { User } from "@/app/model/User";
import DBConnection from "@/app/lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    await DBConnection();
    const body = await req.json();
    const { username, email, password } = body;

    if (!username || !email || !password) {
      return NextResponse.json(
        { success: false, message: "Username, email and password are required." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, message: "Password must be at least 6 characters." },
        { status: 400 }
      );
    }

    // Block if a verified user already holds this username
    const existingUserByUsername = await User.findOne({ username, isVerified: true });
    if (existingUserByUsername) {
      return NextResponse.json(
        { success: false, message: "This username is already taken. Please choose another." },
        { status: 409 }
      );
    }

    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    const verifyCodeExpire = new Date();
    verifyCodeExpire.setHours(verifyCodeExpire.getHours() + 1);

    const existingUserByEmail = await User.findOne({ email });

    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        // Already verified — reject to prevent account takeover
        return NextResponse.json(
          { success: false, message: "An account with this email already exists. Please sign in." },
          { status: 409 }
        );
      }

      // Registered but not yet verified — refresh credentials and resend code
      const hashedPassword = await bcrypt.hash(password, 10);
      existingUserByEmail.username = username;
      existingUserByEmail.password = hashedPassword;
      existingUserByEmail.verifyCode = verifyCode;
      existingUserByEmail.verifyCodeExpire = verifyCodeExpire;
      await existingUserByEmail.save();
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({
        username,
        email,
        password: hashedPassword,
        verifyCode,
        verifyCodeExpire,
        isVerified: false,
        isAcceptingMessages: true,
        messages: [],
      });
      await newUser.save();
    }

    const emailResponse = await sendVerificationEmail(username, email, verifyCode);

    if (!emailResponse.success) {
      return NextResponse.json(
        { success: false, message: emailResponse.message || "Failed to send verification email. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Account created successfully. Please check your email to verify your account." },
      { status: 201 }
    );

  } catch (error: unknown) {
    console.error("[REGISTER ERROR]:", error);

    if (error instanceof Error && error.name === "ValidationError") {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 400 }
      );
    }
  }
};
