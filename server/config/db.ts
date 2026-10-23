import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  const uri =
    process.env.MONGODB_URI ||
    process.env.MONGO_URI ||
    "mongodb://127.0.0.1:27017/ai-recipe-generator";

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.warn(
      `MongoDB connection warning: ${err instanceof Error ? err.message : "Unable to connect"}. (AI features will still function, but database saves may fail until MongoDB is active.)`,
    );
  }
};

export default connectDB;
