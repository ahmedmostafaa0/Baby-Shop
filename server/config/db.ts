import mongoose from "mongoose";

// Cache the connection across serverless invocations and never kill the
// process on a failed connect (that caused intermittent 500s on Vercel).
let connecting: Promise<typeof mongoose> | null = null;

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) return;
  try {
    if (!connecting) {
      connecting = mongoose.connect(process.env.MONGO_URI as string, {
        serverSelectionTimeoutMS: 8000,
      });
    }
    const conn = await connecting;
    console.log(`Mongo Connected: ${conn.connection.host}`);
  } catch (error) {
    connecting = null;
    if (error instanceof Error) {
      console.log(`Error: ${error.message}`);
    } else {
      console.log("Unknown error while connecting to MongoDB");
    }
  }
};

export default connectDB;
