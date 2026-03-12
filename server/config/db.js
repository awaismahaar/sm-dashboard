import mongoose from "mongoose";

export async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log(`DB Connection established`);
  } catch (error) {
    console.log("Error from db config", error);
  }
}
