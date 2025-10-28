import { model, Schema } from "mongoose";
export interface IDriver {
  fullName: string;
  address: string;
  contactNumber: string;
  email: string;
  birthDate: Date;
  gender: string;
  vehicleType: "motorcycle" | "sedan" | "pickup" | "suv";
}

const DriverSchema = new Schema<IDriver>(
  {
    fullName: { type: String, required: true },
    address: { type: String, required: true },
    contactNumber: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    birthDate: { type: Date, required: true },
    gender: {
      type: String,
      required: true,
      enum: ["male", "female", "others"],
    },
    vehicleType: {
      type: String,
      enum: ["motorcycle", "sedan", "pickup", "suv"],
      required: true,
    },
  },
  { timestamps: true }
);

const DriverModel = model("Driver", DriverSchema);
export default DriverModel;
