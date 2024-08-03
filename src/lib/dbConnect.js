import mongoose from "mongoose";
const connection = {};

/**
 * Connect to the MongoDB database. If a connection already exists, we'll reuse
 * that instead of creating a new one.
 */
export default async function dbConnect() {
    // If the connection is already established, we don't need to do anything
    if (connection.isConnected) {
        console.log("Using existing connection");
        return;
    }
    try {
        console.log("process.env.MONGODB_URI", process.env.NEXT_APP_MONGODB_URI);
        // Connect to the MongoDB URI specified in the environment
        const db = await mongoose.connect(process.env.NEXT_APP_MONGODB_URI, {
            // We need to use the useNewUrlParser so that we can use the new
            // MongoClient that's required for Mongoose 6
            useNewUrlParser: true,
            // We need to use the useUnifiedTopology so that we can use the new
            // Server discovery and monitoring engine that's required for Mongoose 6
            useUnifiedTopology: true,
        });
        // Set the readyState on the connection so that we can check if the
        // connection is established later
        connection.isConnected = db.connections[0].readyState;
        console.log("Connected to MongoDB");
    } catch (error) {
        // If there's an error, log it so that we can see what happened
        console.log(error);
        process.exit(1);
    }
}
