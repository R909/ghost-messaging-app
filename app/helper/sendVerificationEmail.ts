import { resend } from "../lib/resend";
import { EmailTemplate } from "@/emails/verificationEmail";
import { ApiResponse } from "../types/apiResponse";

export const sendVerificationEmail = async (
    username: string,
    email: string,
    verificationCode: string
): Promise<ApiResponse> => {
    console.log(" process.env.RESEND_FROM_EMAIL", process.env.RESEND_FROM_EMAIL);
    
    try {
        await resend.emails.send({
            from: (process.env.RESEND_FROM_EMAIL!).toString(),
            to: email,
            subject: "Verify your email",
            react: EmailTemplate({ username, verificationCode }),
        });
        return {
            success: true,
            message: "Verification email sent successfully",
        };
    } catch (error: any) {
        return {
            success: false,
            message: error.message,
        };
    }
};