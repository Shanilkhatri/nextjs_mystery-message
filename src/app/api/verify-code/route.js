import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { z } from "zod";
import { verifySchema } from "@/schemas/verifySchema";

export const POST = async (request) => {
    await dbConnect();
    try {   
        const {otp, username} = await request.json();

        // validate otp
        const {error} = verifySchema.safeParse({otp});
        if(error){
            return Response.json({
                success: false,
                message: error.format().otp._errors || []
            }, {
                status: 400
            })
        }   
        const existingUser = await UserModel.findOne({ username, isVerified: false });
        if (!existingUser) {
            return Response.json({
                success: false,
                message: "User not found"
            }, {
                status: 400
            })
        }
        if (existingUser.verifyCode !== otp) {
            return Response.json({
                success: false,
                message: "Invalid OTP"
            }, {
                status: 400
            })
        }
        // code expiry check
        if(existingUser.verifyCodeExpiry < new Date()){
            return Response.json({
                success: false,
                message: "Code expired! Please signup again."
            }, {
                status: 400
            })
        }
        existingUser.isVerified = true;
        await existingUser.save();
        return Response.json({
            success: true,
            message: "User verified successfully"
        })
    } catch (error) {
        return Response.json({
            success: false,
            message: "Something went wrong"
        }, {
            status: 500
        })
    }   
}