import { NextResponse } from "next/server";
import { addRsvp } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, status, notes } = body;

    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json({ error: "Please enter your name." }, { status: 400 });
    }

    const newRsvp = await addRsvp({
      name: name.trim(),
      email: typeof email === "string" ? email.trim() : undefined,
      status: status || "ATTENDING",
    });

    return NextResponse.json({ success: true, rsvp: newRsvp });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
