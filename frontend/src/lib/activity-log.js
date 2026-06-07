import ActivityLog from "@/models/ActivityLog";

const MAX_ACTIVITY_ROWS = 500;

export async function recordActivity(entry) {
  const created = await ActivityLog.create(entry);

  const excess = await ActivityLog.countDocuments().then((count) => Math.max(0, count - MAX_ACTIVITY_ROWS));
  if (excess > 0) {
    const stale = await ActivityLog.find().sort({ createdAt: 1 }).limit(excess).select("_id").lean();
    if (stale.length) {
      await ActivityLog.deleteMany({ _id: { $in: stale.map((row) => row._id) } });
    }
  }

  return created;
}
