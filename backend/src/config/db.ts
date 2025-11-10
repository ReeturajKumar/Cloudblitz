import mongoose from "mongoose";

export default async function connectDB(uri: string) {
  try {
    if (!uri) throw new Error("MONGO_URI not provided");
    await mongoose.connect(uri);
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection failed:", err);
    process.exit(1);
  }
}
