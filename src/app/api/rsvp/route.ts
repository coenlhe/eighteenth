import { NextResponse } from "next/server";
import { getRsvp, upsertRsvp } from "@/lib/rsvp";
import type { RsvpStatus } from "@/lib/types";

const VALID_STATUSES: RsvpStatus[] = ["ATTENDING", "DECLINED"];

/** Fetch the current guest's own RSVP (looked up by their browser's guestId). */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const guestId = searchParams.get("guestId");
  if (!guestId) {
    return NextResponse.json({ error: "Missing guestId." }, { status: 400 });
  }
  const rsvp = await getRsvp(guestId);
  return NextResponse.json({ rsvp });
}

export async function POST(request: Request) {
  let body: { guestId?: string; name?: string; status?: string; notes?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { guestId, name, status, notes } = body;

  if (!guestId || typeof guestId !== "string" || guestId.length < 6 || guestId.length > 100) {
    return NextResponse.json({ error: "Missing or invalid guest ID." }, { status: 400 });
  }
  if (!name || typeof name !== "string" || !name.trim()) {
    return NextResponse.json({ error: "Please enter your name." }, { status: 400 });
  }
  if (!status || !VALID_STATUSES.includes(status as RsvpStatus)) {
    return NextResponse.json({ error: "Invalid RSVP status." }, { status: 400 });
  }

  const rsvp = await upsertRsvp({
    guestId,
    name,
    status: status as RsvpStatus,
    notes: typeof notes === "string" ? notes : "",
  });

  return NextResponse.json({ rsvp });
}
