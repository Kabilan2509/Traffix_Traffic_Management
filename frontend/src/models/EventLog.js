import mongoose from "mongoose";

const EventLogSchema = new mongoose.Schema(
  {
    eventId: { type: String, required: true, unique: true, index: true },
    time: { type: String, required: true },
    type: { type: String, required: true },
    junction: { type: String, required: true },
    details: { type: String, required: true },
    status: { type: String, required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default mongoose.models.EventLog || mongoose.model("EventLog", EventLogSchema);
