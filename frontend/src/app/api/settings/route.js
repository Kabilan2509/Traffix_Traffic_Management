import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { recordActivity } from "@/lib/activity-log";
import { defaultSettings } from "@/lib/seed-data";
import PlatformSettings from "@/models/PlatformSettings";

function sanitizePayload(body = {}) {
  return {
    autoOptimise: Boolean(body.autoOptimise),
    emergencyBroadcast: Boolean(body.emergencyBroadcast),
    auditLogging: Boolean(body.auditLogging),
    congestionThreshold: Number(body.congestionThreshold),
    syncInterval: Number(body.syncInterval),
  };
}

export async function GET() {
  try {
    await connectToDatabase();

    let settings = await PlatformSettings.findOne({ key: "global" }).lean();
    if (!settings) {
      settings = await PlatformSettings.create({
        key: "global",
        ...defaultSettings,
        updatedBy: "system",
      });
    }

    return NextResponse.json({
      autoOptimise: settings.autoOptimise,
      emergencyBroadcast: settings.emergencyBroadcast,
      auditLogging: settings.auditLogging,
      congestionThreshold: settings.congestionThreshold,
      syncInterval: settings.syncInterval,
      updatedBy: settings.updatedBy,
      updatedAt: settings.updatedAt,
      persisted: true,
    });
  } catch {
    return NextResponse.json({
      ...defaultSettings,
      persisted: false,
    });
  }
}

export async function POST(request) {
  const body = await request.json();
  const actor = body.actor || "Unknown User";
  const role = body.role || "Unknown";
  const nextSettings = sanitizePayload(body);

  try {
    await connectToDatabase();

    const current = await PlatformSettings.findOne({ key: "global" }).lean();
    const previous = current
      ? {
          autoOptimise: current.autoOptimise,
          emergencyBroadcast: current.emergencyBroadcast,
          auditLogging: current.auditLogging,
          congestionThreshold: current.congestionThreshold,
          syncInterval: current.syncInterval,
        }
      : defaultSettings;

    const changedKeys = Object.keys(nextSettings).filter((key) => previous[key] !== nextSettings[key]);

    const settings = await PlatformSettings.findOneAndUpdate(
      { key: "global" },
      {
        $set: {
          ...nextSettings,
          updatedBy: actor,
        },
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      }
    ).lean();

    await recordActivity({
      kind: "settings",
      actor,
      role,
      target: "System Configuration",
      action: "settings.save",
      summary: changedKeys.length
        ? `Updated settings: ${changedKeys.join(", ")}`
        : "Saved settings with no value changes",
      status: "Success",
      meta: {
        changed: changedKeys.join(",") || "none",
      },
    });

    return NextResponse.json({
      autoOptimise: settings.autoOptimise,
      emergencyBroadcast: settings.emergencyBroadcast,
      auditLogging: settings.auditLogging,
      congestionThreshold: settings.congestionThreshold,
      syncInterval: settings.syncInterval,
      updatedBy: settings.updatedBy,
      updatedAt: settings.updatedAt,
      persisted: true,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ...nextSettings,
        persisted: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
