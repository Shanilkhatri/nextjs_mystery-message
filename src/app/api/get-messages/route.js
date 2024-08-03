import { getServerSession,User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import mongoose from "mongoose";


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
    // when writing aggregate pipeline, use mongoose object id instead of string
    const userId = new mongoose.Types.ObjectId(user._id);

    try {
        const user = await UserModel.aggregate([
            {
                $match: {
                    _id: userId
                }
            },
            {
                $unwind: "$messages"
                
            },
            {
                $sort: {
                    "messages.createdAt": -1
                }
            },
            {
                $group: { _id:"$_id", messages: { $push: "$messages" } }
            },
            {
                $limit: 10
            }
        ]);
        if (!user) {
            return Response.json({
                success: false,
                message: "No messages found"
            }, {
                status: 404
            });
        }
        return Response.json({
            success: true,  
            messages : user[0].messages
        }, {
            status: 200
        });
    } catch (error) {
        console.log(error);
        return Response.json({
            success: false,
            message: "Something went wrong"
        }, {
            status: 500
        });
    }
}