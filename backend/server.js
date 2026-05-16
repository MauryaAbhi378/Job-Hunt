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

dotenv.config();

connectDB();

const app = express();

const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.CLIENT_URL,
  'http://44.218.21.26',
  'http://localhost:5173',
  'http://localhost:3000',
]
  .filter(Boolean)
  .flatMap((origin) => origin.split(","))
  .map((origin) => origin.trim().replace(/\/$/, ""));

app.set("query parser", (str) => {
  return qs.parse(str, { arrayLimit: 1000 });
});

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    const normalizedOrigin = origin.replace(/\/$/, "");
    if (allowedOrigins.includes(normalizedOrigin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", env: process.env.NODE_ENV });
});

app.use("/api/user", userRoute);
app.use("/api/company", companyRoute);
app.use("/api/job", jobRouter);
app.use("/api/application", applicationRoute);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on PORT : ${PORT}`);
});

export default app;
