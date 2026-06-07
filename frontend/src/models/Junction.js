import mongoose from "mongoose";

const JunctionSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    congestion: { type: String, required: true },
    phase: { type: String, required: true },
    density: { type: Number, required: true },
    vehicles: { type: Number, required: true },
    delay: { type: Number, required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default mongoose.models.Junction || mongoose.model("Junction", JunctionSchema);
