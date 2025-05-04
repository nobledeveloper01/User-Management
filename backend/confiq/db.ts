import mongoose, { ConnectOptions } from 'mongoose';
import dotenv from "dotenv";

dotenv.config();

export const connectMongoDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;

    // Ensure mongoURI is defined
    if (!mongoURI) {
      throw new Error("MONGO_URI is not defined in the environment variables.");
    }

    const clientOptions: ConnectOptions = {
      serverApi: {
        version: "1",
        strict: true,
        deprecationErrors: true,
      },
    };

    const conn = await mongoose.connect(mongoURI, clientOptions);
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    if (error instanceof Error) {
      console.error("❌ MongoDB connection error:", error.message);
    } else {
      console.error("❌ MongoDB connection error:", error);
    }
    process.exit(1);
  }
};