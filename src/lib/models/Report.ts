import mongoose, { Schema, Document, Model } from "mongoose";

export interface IReport extends Document {
  _id: mongoose.Types.ObjectId;
  reporterId: mongoose.Types.ObjectId;
  reportedUserId: mongoose.Types.ObjectId;
  callId?: string;
  reason:
    | "inappropriate-behavior"
    | "harassment"
    | "spam"
    | "underage"
    | "illegal-content"
    | "other";
  description?: string;
  status: "pending" | "reviewed" | "resolved" | "dismissed";
  reviewedBy?: mongoose.Types.ObjectId;
  reviewNotes?: string;
  actionTaken?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ReportSchema = new Schema<IReport>(
  {
    reporterId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    reportedUserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    callId: {
      type: String,
      default: null,
    },
    reason: {
      type: String,
      required: true,
      enum: [
        "inappropriate-behavior",
        "harassment",
        "spam",
        "underage",
        "illegal-content",
        "other",
      ],
    },
    description: {
      type: String,
      maxlength: 1000,
      default: "",
    },
    status: {
      type: String,
      enum: ["pending", "reviewed", "resolved", "dismissed"],
      default: "pending",
      index: true,
    },
    reviewedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    reviewNotes: {
      type: String,
      default: null,
    },
    actionTaken: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

// Indexes
ReportSchema.index({ status: 1, createdAt: -1 });
ReportSchema.index({ reportedUserId: 1, status: 1 });

const Report: Model<IReport> =
  mongoose.models.Report || mongoose.model<IReport>("Report", ReportSchema);

export default Report;
