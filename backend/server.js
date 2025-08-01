import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./utils/connectDB.js";
import dotenv from "dotenv";
import userRoute from "./routes/userRoute.js";

dotenv.config();
const app = express();

//Parse incoming requests with JSON payloads
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// Parse cookies from the HTTP headers (useful for auth/session tokens stored in cookies)
app.use(cookieParser());

// CORS configuration object to allow frontend at localhost:5173 to communicate with the backend
const corsOption = {
  origin: "http://localhost:5173", // Allow requests only from this origin (your React app)
  credentials: true, // Allow sending of cookies and HTTP authentication
};

// Enable CORS using the configuration above
app.use(cors(corsOption));

app.use("/api/user", userRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  connectDB();
  console.log(`Sever running on PORT : ${PORT}`);
});
