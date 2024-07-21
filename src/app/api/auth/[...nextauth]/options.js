import {NextAuthOptions} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";


export const authOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                email: {label: "Email", type: "email"},
                password: {label: "Password", type: "password"}
            },
            // This function is called by NextAuth to verify that the user trying to log in is valid.
            // It takes in two parameters: credentials and req.
            // Credentials is an object containing the user's email and password.
            // Req is the request object that was passed to the API endpoint.
            async authorize(credentials, req) {
                // Connect to the database.
                await dbConnect();

                try {
                    // Find a user with the same email as the one provided in the credentials.
                    const user = await UserModel.findOne({email: credentials.identifier.email});

                    // If no user is found, throw an error.
                    if (!user) {
                        throw new Error("User not found");
                    }

                    // If the user is not verified, throw an error.
                    if (!user.isVerified) {
                        throw new Error("User not verified");
                    }

                    // Compare the provided password with the stored password.
                    // If they do not match, throw an error.
                    if (!bcrypt.compareSync(credentials.password, user.password)) {
                        throw new Error("Incorrect password");
                    }

                    // If everything is successful, return the user object.
                    // This will be used to create a JWT token and store it in the session.
                    return user;
                } catch (error) {
                    // If there is an error at any point, throw it so that NextAuth can handle it.
                    throw new Error(error);
                }
            }
        })
    ],
    callbacks: {
// This function is called by NextAuth to customize the JWT token that is attached to the session.
        // It takes in two parameters: token and user.
        // Token is the JWT token that will be sent to the client.
        // User is the user object fetched from the database.

        async jwt({token, user}) {
            // If a user object exists, assign the user's properties to the token.
            if (user) {
                token.id = user._id;
                token.isVerified = user.isVerified;
                token.isAcceptingMessages = user.isAcceptingMessages;
                token.username = user.username;
            }
            // Return the updated token.
            return token;
        },
        // This function is called by NextAuth to customize the session object that is stored on the client-side.
        // It takes in two parameters: session and token.
        // Session is the session object that will be stored on the client side.
        // Token is the JWT token that was attached to the session.
        async session({session, token}) {
            // If a token exists, update the session object with the token's properties.
            if (token) {
                // Assign the user's ID from the token to the session object.
                session.user._id = token._id;
                // Assign the user's verification status from the token to the session object.
                session.user.isVerified = token.isVerified;
                // Assign the user's message acceptance status from the token to the session object.
                session.user.isAcceptingMessages = token.isAcceptingMessages;
                // Assign the user's username from the token to the session object.
                session.user.username = token.username;
            }
            // Return the updated session object.
            return session;
        }
    },
    pages: {
        signIn: "/signin"
    },
    session: {
        strategy: "jwt"
    },
    secret: process.env.NEXTAUTH_SECRET

}