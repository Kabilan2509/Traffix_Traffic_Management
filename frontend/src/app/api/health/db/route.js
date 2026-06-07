import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";

export async function GET() {
  try {
    const connection = await connectToDatabase();
    return NextResponse.json({
      ok: true,
      readyState: connection.connection.readyState,
      host: connection.connection.host,
      name: connection.connection.name,
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
