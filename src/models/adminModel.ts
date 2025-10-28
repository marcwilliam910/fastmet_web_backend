import mongoose, { model } from "mongoose";

const AdminSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true }, // hashed
});

const AdminModel = model("Admin", AdminSchema);
export default AdminModel;
