import mongoose from "mongoose";

const ActivityLogSchema = new mongoose.Schema(
  {
    kind: { type: String, required: true, index: true },
    actor: { type: String, default: "system" },
    role: { type: String, default: "Unknown" },
    target: { type: String, required: true },
    action: { type: String, required: true },
    summary: { type: String, required: true },
    status: { type: String, default: "Success" },
    meta: { type: Map, of: String, default: undefined },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default mongoose.models.ActivityLog || mongoose.model("ActivityLog", ActivityLogSchema);
