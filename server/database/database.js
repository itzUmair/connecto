import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  mongoose.set("strictQuery", true);
  const startTime = new Date();
  console.log("establishing connection to database...");
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const endTime = new Date();
    console.log(
      `connected to database in ${(endTime - startTime) / 100} seconds.`
    );
  } catch (error) {
    throw error;
  }
};

export default connectDB;
