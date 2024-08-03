import { getServerSession,User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export async function POST(request) {
    await dbConnect();
    const session = await getServerSession(authOptions);
    const user = session?.user;
    if (!user || !session) {
        return Response.json({
            success: false,
            message: "Unauthorized",
        }, {
            status: 401
        });
    }
    const userId = user._id;
    try{
        const {isAcceptingMessage} = await request.json();
        const updatedUser = await UserModel.findByIdAndUpdate(userId, {isAcceptingMessage},{new: true});
        if(!updatedUser){
            return Response.json({
                success: false,
                message: "Failed to update isAcceptingMessage",
            }, {
                status: 401
            });
        }
        return Response.json({
            success: true,
            message: "Updated",
            updatedUser
        });
    }catch(error){
        console.log(error);
        return Response.json({
            success: false,
            message: "Failed to update isAcceptingMessage",
        }, {
            status: 500
        });
    }
}

export async function GET(request) {
    await dbConnect();
    const session = await getServerSession(authOptions);
    const user = session?.user;
    if (!user || !session) {
        return Response.json({
            success: false,
            message: "Unauthorized",
        }, {
            status: 401
        });
    }
    const userId = user._id;
    try{
        const user = await UserModel.findById(userId);
        if(!user){
            return Response.json({
                success: false,
                message: "User not found",
            }, {
                status: 404
            });
        }
        return Response.json({
            success: true,
            message: "User found",
            isAcceptingMessage: user.isAcceptingMessage,
        });
    }catch(error){
        console.log(error);
        return Response.json({
            success: false,
            message: "Failed to get isAcceptingMessage",
        }, {
            status: 500
        }); 
    }   
}
