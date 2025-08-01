import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected sucessfully");
  } catch (error) {
    console.log("Error while connecting MongoDB", error.message);
    throw error
  }
};

export default connectDB;
