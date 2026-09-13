import { pool } from "./db";
import type { Rsvp, RsvpStatus } from "./types";

export async function getRsvp(guestId: string): Promise<Rsvp | null> {
  const result = await pool.query(
    'SELECT guest_id as "guestId", name, status, notes, created_at as "createdAt" FROM rsvps WHERE guest_id = $1',
    [guestId]
  );
  return result.rows[0] || null;
}

export async function getAllRsvps(): Promise<Rsvp[]> {
  const result = await pool.query(
    'SELECT guest_id as "guestId", name, status, notes, created_at as "createdAt" FROM rsvps ORDER BY created_at DESC'
  );
  return result.rows;
}

export async function upsertRsvp(data: {
  guestId: string;
  name: string;
  status: RsvpStatus;
  notes?: string;
}): Promise<Rsvp> {
  const query = `
    INSERT INTO rsvps (guest_id, name, status, notes, created_at)
    VALUES ($1, $2, $3, $4, NOW())
    ON CONFLICT (guest_id) 
    DO UPDATE SET name = EXCLUDED.name, status = EXCLUDED.status, notes = EXCLUDED.notes
    RETURNING guest_id as "guestId", name, status, notes, created_at as "createdAt";
  `;
  const values = [data.guestId, data.name, data.status, data.notes || ""];
  const result = await pool.query(query, values);
  return result.rows[0];
}

export function toCsv(rsvps: Rsvp[]): string {
  const headers = ["Guest ID", "Name", "Status", "Notes", "Created At"];
  const rows = rsvps.map((r) => [
    r.guestId,
    `"${(r.name || "").replace(/"/g, '""')}"`,
    r.status,
    `"${(r.notes || "").replace(/"/g, '""')}"`,
    r.createdAt,
  ]);
  return [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
}
