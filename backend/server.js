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

app.set("query parser", (str) => {
  return qs.parse(str, { arrayLimit: 1000 });
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(cors({
  origin: [
    'http://localhost:5173',
    process.env.CLIENT_URL
  ],
  credentials: true
}));

app.use("/api/user", userRoute);
app.use("/api/company", companyRoute);
app.use("/api/job", jobRouter);
app.use("/api/application", applicationRoute);

const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on PORT : ${PORT}`);
  });
}

export default app; 