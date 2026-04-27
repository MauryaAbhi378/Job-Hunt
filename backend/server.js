import express from "express";
import qs from "qs";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./utils/connectDB.js";
import dotenv from "dotenv";
import userRoute from "./routes/userRoute.js";
import companyRoute from "./routes/companyRoute.js";
import jobRouter from "./routes/jobRoute.js";
import applicationRoute from "./routes/applicationRoute.js";
import path from "path"

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
const __dirname = path.resolve()

//To parse array
app.set("query parser", (str) => {
  return qs.parse(str, {
    arrayLimit: 1000,
  });
});

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

// CORS configuration object to allow frontend at localhost:5173 to communicate with the backend
const corsOption = {
  origin: "http://localhost:5173", // Allow requests only from this origin (your React app)
  credentials: true, // Allow sending of cookies and HTTP authentication
};

// Enable CORS using the configuration above
app.use(cors(corsOption));

app.use("/api/user", userRoute);
app.use("/api/company", companyRoute);
app.use("/api/job", jobRouter);
app.use("/api/application", applicationRoute);

app.use(express.static(path.resolve(__dirname, "frontend", "dist")));

app.get(/.*/, (_, res) => {
  res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
});

app.listen(PORT, () => {
  connectDB();
  console.log(`Sever running on PORT : ${PORT}`);
});
