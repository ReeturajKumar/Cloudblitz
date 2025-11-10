import { Schema, model, Types } from "mongoose";

export type EnquiryStatus = "new" | "in_progress" | "closed";

export interface IEnquiry {
  customerName: string;
  email?: string;
  phone?: string;
  message?: string;
  status: EnquiryStatus;
  assignedTo?: Types.ObjectId | null;
  deleted?: boolean;
}

const enquirySchema = new Schema<IEnquiry>(
  {
    customerName: { type: String, required: true },
    email: { type: String },
    phone: { type: String },
    message: { type: String },
    status: {
      type: String,
      enum: ["new", "in_progress", "closed"],
      default: "new",
    },
    assignedTo: { type: Schema.Types.ObjectId, ref: "User", default: null },
    deleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default model<IEnquiry>("Enquiry", enquirySchema);
