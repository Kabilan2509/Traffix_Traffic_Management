import mongoose from "mongoose";

const PlatformSettingsSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, index: true, default: "global" },
    autoOptimise: { type: Boolean, default: true },
    emergencyBroadcast: { type: Boolean, default: true },
    auditLogging: { type: Boolean, default: true },
    congestionThreshold: { type: Number, default: 75, min: 40, max: 95 },
    syncInterval: { type: Number, default: 10, min: 2, max: 30 },
    updatedBy: { type: String, default: "system" },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default mongoose.models.PlatformSettings || mongoose.model("PlatformSettings", PlatformSettingsSchema);
