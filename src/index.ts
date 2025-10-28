import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import driverRoute from "../src/routes/driverRoute";
import authRoute from "../src/routes/authRoute";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/drivers", driverRoute);
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
