import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
  } catch (error) {
    console.log("Error while connecting MongoDB", error.message);
    throw error
  }
};

export default connectDB;
