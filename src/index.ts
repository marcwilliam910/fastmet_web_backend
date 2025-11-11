import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import preRegisteredDriverRoute from "./routes/preRegisterDriverRoute";
import preRegisteredUserRoute from "./routes/preRegisterUserRoute";
import authRoute from "./routes/authRoute";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:4000",
      "https://fastmet-pre-registration.vercel.app",
      "https://fastmet-admin-dashboard.vercel.app",
    ],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());

app.use("/api/drivers/pre-register", preRegisteredDriverRoute);
app.use("/api/users/pre-register", preRegisteredUserRoute);
app.use("/api/auth", authRoute);

// Database connect then start server
const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(() => {
    console.error("MongoDB connection failed");
    process.exit(1);
  });
