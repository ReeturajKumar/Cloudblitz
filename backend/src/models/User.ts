import { Schema, model } from "mongoose";

export type Role = "admin" | "staff";

export interface IUser {
  name: string;
  email: string;
  passwordHash: string;
  role: Role;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["admin", "staff"], default: "staff" },
  },
  { timestamps: true }
);

export default model<IUser>("User", userSchema);
