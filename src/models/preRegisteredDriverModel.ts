import {model, Schema} from "mongoose";
export interface IPreRegisteredDriver {
  fullName: string;
  address: string;
  contactNumber: string;
  email: string;
  birthDate: Date;
  gender: "male" | "female" | "other";
  vehicleType: "motorcycle" | "sedan" | "pickup" | "suv";
}

const PreRegisteredDriverSchema = new Schema<IPreRegisteredDriver>(
  {
    fullName: {type: String, required: true},
    address: {type: String, required: true},
    contactNumber: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    birthDate: {type: Date, required: true},
    gender: {
      type: String,
      required: true,
      enum: ["male", "female", "other"],
    },
    vehicleType: {
      type: String,
      enum: ["motorcycle", "sedan", "pickup", "suv"],
      required: true,
    },
  },
  {timestamps: true}
);

const PreRegisteredDriverModel = model(
  "PreRegisteredDriver",
  PreRegisteredDriverSchema,
  "pre_registered_drivers" // custom collection name
);
export default PreRegisteredDriverModel;
