import { NextResponse } from "next/server";
import { setRsvpStatus, deleteRsvp } from "@/lib/rsvp";
import { verifySessionToken, ADMIN_COOKIE_NAME } from "@/lib/auth";
import { cookies } from "next/headers";
import type { RsvpStatus } from "@/lib/types";

const VALID: RsvpStatus[] = ["ATTENDING", "DECLINED"];

async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  return token ? verifySessionToken(token) : false;
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json().catch(() => ({}));
  if (!VALID.includes(body.status)) {
    return NextResponse.json({ error: "Invalid status." }, { status: 400 });
  }

  const rsvp = await setRsvpStatus(id, body.status);
  if (!rsvp) return NextResponse.json({ error: "No response found." }, { status: 404 });
  return NextResponse.json({ rsvp });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  const { id } = await params;
  const ok = await deleteRsvp(id);
  if (!ok) return NextResponse.json({ error: "No response found." }, { status: 404 });
  return NextResponse.json({ ok: true });
}