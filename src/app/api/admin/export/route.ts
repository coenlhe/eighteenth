import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { getAllRsvps, toCsv } from "@/lib/rsvp";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const rsvpMap = await getAllRsvps();
  const rows = Object.values(rsvpMap).sort((a, b) => a.name.localeCompare(b.name));

  const csv = toCsv(rows);
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="rsvps.csv"`,
    },
  });
}
