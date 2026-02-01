import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICallHistory extends Document {
  _id: mongoose.Types.ObjectId;
  callId: string;
  participants: {
    odId: mongoose.Types.ObjectId;
    odName: string;
    joinedAt: Date;
    leftAt?: Date;
  }[];
  startedAt: Date;
  endedAt?: Date;
  duration: number;
  endReason: "completed" | "skipped" | "disconnected" | "reported";
  createdAt: Date;
}

const CallHistorySchema = new Schema<ICallHistory>(
  {
    callId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    participants: [
      {
        userId: {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        userName: {
          type: String,
          required: true,
        },
        joinedAt: {
          type: Date,
          required: true,
          default: Date.now,
        },
        leftAt: {
          type: Date,
          default: null,
        },
      },
    ],
    startedAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
    endedAt: {
      type: Date,
      default: null,
    },
    duration: {
      type: Number,
      default: 0,
    },
    endReason: {
      type: String,
      enum: ["completed", "skipped", "disconnected", "reported"],
      default: "completed",
    },
  },
  {
    timestamps: true,
  },
);

// Indexes
CallHistorySchema.index({ "participants.userId": 1 });
CallHistorySchema.index({ startedAt: -1 });
CallHistorySchema.index({ createdAt: -1 });

const CallHistory: Model<ICallHistory> =
  mongoose.models.CallHistory ||
  mongoose.model<ICallHistory>("CallHistory", CallHistorySchema);

export default CallHistory;
