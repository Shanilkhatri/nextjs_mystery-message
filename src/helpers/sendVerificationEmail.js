import { resend } from "@/lib/resend";

import VerificationEmail from "../../emails/VerificationEmail";

export const sendVerificationEmail = async (email, username, otp) => {
    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Mystery Message - Verify Your Account',
            react: VerificationEmail({ username, otp }),
          });

        console.log("Email sent successfully");
        return {
            success: true,
            message : "Email sent successfully"
        }
    } catch (error) {
        console.log("Email error",error)
        return {
            success: false,
            message : "Something went wrong"
        }
    }
}