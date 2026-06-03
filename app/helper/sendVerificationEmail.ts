import { resend } from "../lib/resend";
import { EmailTemplate } from "@/emails/verificationEmail";
import { ApiResponse } from "../types/apiResponse";

export const sendVerificationEmail = async (
    email: string,
    firstName: string
): Promise<ApiResponse> => {
    try {
        await resend.emails.send({
            from: "Acme <onboarding@resend.dev>",
            to: email,
            subject: "Verify your email",
            react: EmailTemplate({ firstName }),
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