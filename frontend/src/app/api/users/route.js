import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";
import { recordActivity } from "@/lib/activity-log";

const fallbackUsers = [
  {
    userId: "USR-001",
    name: "Kabil R",
    email: "kabil@citytraffic.gov",
    role: "Super Admin",
    zone: "Central Command",
    status: "Active",
    createdAt: "2026-03-01T09:30:00.000Z",
  },
  {
    userId: "USR-002",
    name: "Anita Sharma",
    email: "anita.sharma@citytraffic.gov",
    role: "Traffic Engineer",
    zone: "Downtown Sector",
    status: "Active",
    createdAt: "2026-03-01T09:35:00.000Z",
  },
  {
    userId: "USR-003",
    name: "Rahul Menon",
    email: "rahul.menon@citytraffic.gov",
    role: "Traffic Operator",
    zone: "West Corridor",
    status: "Active",
    createdAt: "2026-03-01T09:40:00.000Z",
  },
  {
    userId: "USR-004",
    name: "Priya Nair",
    email: "priya.nair@citytraffic.gov",
    role: "Emergency Authority",
    zone: "Rapid Response Unit",
    status: "Suspended",
    createdAt: "2026-03-01T09:45:00.000Z",
  },
];

const memoryUsers = [...fallbackUsers];

function formatUsers(users) {
  return users.map((user, index) => ({
    id: user._id?.toString?.() || user.id || `fallback-${index + 1}`,
    userId: user.userId,
    name: user.name,
    email: user.email,
    role: user.role,
    zone: user.zone,
    status: user.status,
    createdAt: user.createdAt,
  }));
}

export async function GET() {
  try {
    await connectToDatabase();

    const existing = await User.countDocuments();
    if (existing === 0) {
      await User.insertMany(fallbackUsers);
    }

    const users = await User.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json(formatUsers(users));
  } catch {
    return NextResponse.json(formatUsers(memoryUsers));
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const name = body.name?.trim();
    const email = body.email?.trim().toLowerCase();
    const zone = body.zone?.trim();
    const role = body.role?.trim();
    const status = body.status?.trim() || "Active";

    if (!name || !email || !zone || !role) {
      return NextResponse.json(
        { ok: false, error: "Name, email, role, and zone are required." },
        { status: 400 }
      );
    }

    try {
      await connectToDatabase();

      const currentCount = await User.countDocuments();
      const userId = `USR-${String(currentCount + 1).padStart(3, "0")}`;

      const created = await User.create({
        userId,
        name,
        email,
        role,
        zone,
        status,
      });

      await recordActivity({
        kind: "user",
        actor: body.actor || "Super Admin",
        role: body.actorRole || "Super Admin",
        target: `${name} (${userId})`,
        action: "user.create",
        summary: `New authority account created for ${name} with role ${role}`,
        status: "Success",
        meta: {
          email,
          zone,
        },
      });

      return NextResponse.json({ ok: true, user: formatUsers([created])[0] });
    } catch {
      const duplicate = memoryUsers.some((user) => user.email === email);
      if (duplicate) {
        return NextResponse.json(
          { ok: false, error: "A user with the same email already exists." },
          { status: 400 }
        );
      }

      const userId = `USR-${String(memoryUsers.length + 1).padStart(3, "0")}`;
      const created = {
        id: `memory-${userId}`,
        userId,
        name,
        email,
        role,
        zone,
        status,
        createdAt: new Date().toISOString(),
      };

      memoryUsers.unshift(created);
      return NextResponse.json({ ok: true, user: created });
    }
  } catch (error) {
    const duplicate =
      error?.code === 11000
        ? "A user with the same email or ID already exists."
        : error.message || "Failed to create user.";

    return NextResponse.json({ ok: false, error: duplicate }, { status: 500 });
  }
}
