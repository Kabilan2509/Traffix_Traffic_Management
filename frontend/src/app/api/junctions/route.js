import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { defaultJunctions } from "@/lib/seed-data";
import Junction from "@/models/Junction";

export async function GET() {
  try {
    await connectToDatabase();

    const existing = await Junction.countDocuments();
    if (existing === 0) {
      await Junction.insertMany(defaultJunctions, { ordered: true });
    }

    const junctions = await Junction.find().sort({ id: 1 }).lean();
    return NextResponse.json(junctions);
  } catch (error) {
    return NextResponse.json(defaultJunctions);
  }
}
