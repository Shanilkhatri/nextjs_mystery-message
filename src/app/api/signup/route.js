import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcrypt";

import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request) {
    await dbConnect();

    try {
        const { username, email, password } = await request.json();
        const existingUserVerficationByUsername = await UserModel.findOne({ username, isVerified: true })

        if (existingUserVerficationByUsername) {
            return Response.json({
                success: false,
                message: "Username already exists with this username"
            }, {
                status: 400
            })
        }

        const existingUserVerficationByEmail = await UserModel.findOne({ email })
        // new otp
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        if(existingUserVerficationByEmail){
            // case: when user exists
            if(existingUserVerficationByEmail.isVerified){
                // case: when user is already verified
                return Response.json({
                    success: false,
                    message: "User already exists with this email"
                }, {
                    status: 400
                })
            }else{
                // case: when user is not verified
                const hashedPassword = await bcrypt.hash(password, 10);
                const otpExpiry = new Date(Date.now() + 60 * 60 * 1000);
                
                existingUserVerficationByEmail.password = hashedPassword;
                existingUserVerficationByEmail.verifyCode = otp;
                existingUserVerficationByEmail.verifyCodeExpiry = otpExpiry;
                existingUserVerficationByEmail.isVerified = false;
                // save user
                await existingUserVerficationByEmail.save();
            }
        }else{
            // case: when user does not exist
            const hashedPassword = await bcrypt.hash(password, 10);

            const otpExpiry = new Date(Date.now() + 60 * 60 * 1000);
            const user = new UserModel(
                { 
                    username, 
                    email, 
                    password: hashedPassword,
                    verifyCode: otp,
                    verifyCodeExpiry: otpExpiry,
                    isVerified: false,
                    isAcceptingMessages: true,
                    messages: []
                });
            // save user
            await user.save();
        }
        // send verification email
        const emailResponse = await sendVerificationEmail(email, username, otp);
        if(!emailResponse.success){
            return Response.json({
                success: false,
                message: emailResponse.message
            }, {
                status: 500
            },{
                status: 500
            })
        }
        return Response.json({
            success: true,
            message: "User registered successfully. Please verify your email"
        }, {
            status: 201
        })
        
    }catch(error){
        console.error("error registering user: ", error)
        return Response.json({
            success: false,
            message: "Error registering user"
        },{
            status: 500
        }
    )
    }
}