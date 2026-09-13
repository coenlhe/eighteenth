import { NextResponse } from "next/server";
import { getAllRsvps } from "@/lib/rsvp";

export async function GET() {
  try {
    const allRsvpsRecord = await getAllRsvps();
    // Convert the dictionary/record into an array for the frontend
    const rsvps = Object.values(allRsvpsRecord);
    return NextResponse.json({ rsvps });
  } catch (error) {
    console.error("Error loading RSVPs:", error);
    return NextResponse.json(
      { error: "Failed to load RSVPs." },
      { status: 500 }
    );
  }
}