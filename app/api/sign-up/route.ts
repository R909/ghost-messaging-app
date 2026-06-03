import { sendVerificationEmail } from "@/app/helper/sendVerificationEmail";
import bcrypt from "bcryptjs";
import {User} from "@/app/model/User";
import DBConnection from "@/app/lib/dbConnect";

export const POST = async (req: Request) => {
    await DBConnection();

    const { username, password, email } = await req.json();

    const existingUser = await User.findOne({ email });

    if (existingUser) {
        return {
            success: false,
            message: "User already exists",
        };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
        username,
        password: hashedPassword,
        email,
    });

    try {
        await user.save();
        await sendVerificationEmail(email, username);
        return {
            success: true,
            message: "User created successfully",
        };
    } catch (error: any) {
        return {
            success: false,
            message: error.message,
        };
    }
}