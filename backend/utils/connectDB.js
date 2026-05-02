import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.log("Error while connecting MongoDB", error.message);
    // Don't throw — let the app start so Vercel logs show the real error
  }
};

export default connectDB;
