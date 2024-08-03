import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signupSchema";

const UserNameQuerySchema = z
    .object({
        // reused validation for username
        username: usernameValidation
    })
 
export async function GET(request) {
    await dbConnect();
    try{
        const {searchParams} = new URL(request.url);
        const queryParam = {
            username: searchParams.get('username')
        }
        // validate username
        const {error} = UserNameQuerySchema.safeParse(queryParam);
        if(error){
            return Response.json({
                success: false,
                message: error.format().username._errors || []
            }, {
                status: 400
            })
        }
        const {username} = queryParam;
         const existingVerifiedUser = await UserModel.findOne({ username, isVerified: true });
         if (existingVerifiedUser) {
             return Response.json({
                 success: false,
                 message: "A verified user already exists with this username"
             }, {
                  status: 400
             })
         }
     
         return Response.json({
             success: true,
             message: "Username is available"
         })
    }catch(error){
        return Response.json({
            success: false,
            message: "Something went wrong"
        }, {
            status: 500
        })
    }
}