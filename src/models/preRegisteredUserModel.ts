import {model, Schema} from "mongoose";
export interface IPreRegisteredUser {
  fullName: string;
  address: string;
  contactNumber: string;
  email: string;
  birthDate: Date;
  gender: "male" | "female" | "other";
}

const PreRegisteredUserSchema = new Schema<IPreRegisteredUser>(
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
  },
  {timestamps: true}
);

const PreRegisteredUserModel = model(
  "PreRegisteredUser",
  PreRegisteredUserSchema,
  "pre_registered_users" // custom collection name
);
export default PreRegisteredUserModel;
