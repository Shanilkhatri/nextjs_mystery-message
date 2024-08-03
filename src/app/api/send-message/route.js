import UserModel from "@/model/User";
import dbConnect from "@/lib/dbConnect";

export async function POST(request) {
    await dbConnect();
    try {
        const { username, message } = await request.json();
        const user = await UserModel.findOne({ username });
        if (!user) {
            return Response.json({
                success: false,
                message: "User not found",
            }, {
                status: 404
            });
        }  
        if(user.isAcceptingMessage === false){
            return Response.json({
                success: false,
                message: "User is not accepting messages",  
            }) 
        }else{
            const newMessage = {message, createdAt: new Date()};
            //send message to user
            user.messages.push(newMessage);
            await user.save();
            return Response.json({
                success: true,
                message: "Message sent",
            }, {
                status: 200
            }); 
        }
    } catch (error) {
        console.log(error);
        return Response.json({
            success: false,
            message: "Failed to send message",
        }, {
            status: 500
        }); 
    }
}