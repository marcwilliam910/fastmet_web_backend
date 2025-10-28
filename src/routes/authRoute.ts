import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { auth } from "../middleware/auth";
import AdminModel from "../models/adminModel";

const router = Router();

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const admin = await AdminModel.findOne({ username });
  if (!admin) return res.status(401).json({ message: "Invalid credentials" });

  const match = await bcrypt.compare(password, admin.password);
  if (!match) return res.status(401).json({ message: "Invalid credentials" });

  const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET!, {
    expiresIn: "1d",
  });

  res.json({ token });
});

router.get("/verify", auth, (_, res) => res.sendStatus(200));

export default router;
