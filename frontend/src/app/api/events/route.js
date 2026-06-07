import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { recordActivity } from "@/lib/activity-log";
import { defaultEvents } from "@/lib/seed-data";
import ActivityLog from "@/models/ActivityLog";

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

    const events = await ActivityLog.find().sort({ createdAt: -1 }).limit(100).lean();
    return NextResponse.json(
      events.map((event, index) => ({
        id: event._id.toString(),
        eventId: event.meta?.get ? event.meta.get("eventId") || `EVT-${String(index + 1).padStart(4, "0")}` : event.meta?.eventId || `EVT-${String(index + 1).padStart(4, "0")}`,
        time: event.meta?.get ? event.meta.get("time") || new Date(event.createdAt).toLocaleTimeString("en-IN", { hour12: false }) : event.meta?.time || new Date(event.createdAt).toLocaleTimeString("en-IN", { hour12: false }),
        type: event.action,
        junction: event.target,
        details: event.summary,
        status: event.status,
      }))
    );
  } catch (error) {
    return NextResponse.json(defaultEvents);
  }
}
