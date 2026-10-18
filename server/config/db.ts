import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI!); // ! - i am convincing ts , that MONGO_URI exists for sure
    console.log(`MongoDB connected: ${conn.connection.host}`); // server machine name or ip address
  } catch (err) {
    console.log(
      err instanceof Error ? `Error: ${err.message}` : `Unexpected error`,
    );
    process.exit(1);
  }
};

export default connectDB;
