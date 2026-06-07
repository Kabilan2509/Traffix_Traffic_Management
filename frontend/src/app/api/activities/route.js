import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { recordActivity } from "@/lib/activity-log";
import ActivityLog from "@/models/ActivityLog";
import { defaultEvents } from "@/lib/seed-data";

function normalizeMeta(meta) {
  if (!meta) return {};
  if (typeof meta.get === "function") {
    return Object.fromEntries(meta.entries());
  }
  return meta;
}

function formatActivity(activity, index = 0) {
  const meta = normalizeMeta(activity.meta);
  const createdAt = activity.createdAt ? new Date(activity.createdAt) : new Date();
  return {
    id: activity._id?.toString?.() || activity.id || `activity-${index + 1}`,
    time: meta.time || createdAt.toLocaleString("en-IN", { hour12: false }),
    type: activity.action || activity.kind || "System Event",
    junction: activity.target || "Traffix",
    details: activity.summary || "Activity recorded",
    status: activity.status || "Success",
    actor: activity.actor || "system",
    role: activity.role || "Unknown",
    kind: activity.kind || "system",
    createdAt: createdAt.toISOString(),
  };
}

export async function GET() {
  try {
    await connectToDatabase();

    const existing = await ActivityLog.countDocuments();
    if (existing === 0) {
      for (const event of defaultEvents) {
        await recordActivity({
          kind: "seed",
          actor: "system",
          role: "System",
          target: event.junction,
          action: event.type,
          summary: event.details,
          status: event.status,
          meta: {
            time: event.time,
            eventId: event.eventId,
          },
        });
      }
    }

    const activities = await ActivityLog.find().sort({ createdAt: -1 }).limit(200).lean();
    return NextResponse.json(activities.map(formatActivity));
  } catch {
    return NextResponse.json(
      defaultEvents.map((event, index) => ({
        id: event.eventId,
        time: event.time,
        type: event.type,
        junction: event.junction,
        details: event.details,
        status: event.status,
        actor: "system",
        role: "System",
        kind: "seed",
        createdAt: new Date(Date.now() - index * 60000).toISOString(),
      }))
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    await connectToDatabase();

    const activity = await recordActivity({
      kind: body.kind || "user",
      actor: body.actor || "Unknown User",
      role: body.role || "Unknown",
      target: body.target || "Portal",
      action: body.action || "user.action",
      summary: body.summary || "User activity recorded",
      status: body.status || "Success",
      meta: body.meta || undefined,
    });

    return NextResponse.json({
      ok: true,
      id: activity._id.toString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
