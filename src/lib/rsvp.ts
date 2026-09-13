import { readJson, updateJson } from "./db";
import type { Rsvp, RsvpStatus } from "./types";

const FILE = "rsvps.json";

const MAX_NAME_LENGTH = 60;
const MAX_NOTES_LENGTH = 500;

export async function getAllRsvps(): Promise<Record<string, Rsvp>> {
  return readJson<Record<string, Rsvp>>(FILE, {});
}

export async function getRsvp(guestId: string): Promise<Rsvp | null> {
  const all = await getAllRsvps();
  return all[guestId] ?? null;
}

/** Guest-facing: create or update the RSVP tied to this browser's guestId. */
export async function upsertRsvp(input: {
  guestId: string;
  name: string;
  status: RsvpStatus;
  notes?: string;
}): Promise<Rsvp> {
  const record: Rsvp = {
    guestId: input.guestId,
    name: input.name.trim().slice(0, MAX_NAME_LENGTH),
    status: input.status,
    notes: (input.notes ?? "").slice(0, MAX_NOTES_LENGTH),
    respondedAt: new Date().toISOString(),
  };

  const updated = await updateJson<Record<string, Rsvp>>(FILE, {}, (all) => {
    all[input.guestId] = record;
    return all;
  });

  return updated[input.guestId];
}

/** Admin-only: correct a response's status without touching notes. */
export async function setRsvpStatus(guestId: string, status: RsvpStatus): Promise<Rsvp | null> {
  const updated = await updateJson<Record<string, Rsvp>>(FILE, {}, (all) => {
    if (all[guestId]) {
      all[guestId] = { ...all[guestId], status, respondedAt: new Date().toISOString() };
    }
    return all;
  });
  return updated[guestId] ?? null;
}

/** Admin-only: remove a response entirely (typos, duplicates, spam entries). */
export async function deleteRsvp(guestId: string): Promise<boolean> {
  let existed = false;
  await updateJson<Record<string, Rsvp>>(FILE, {}, (all) => {
    existed = Boolean(all[guestId]);
    if (existed) delete all[guestId];
    return all;
  });
  return existed;
}

export function toCsv(rows: Rsvp[]): string {
  const header = ["Name", "Status", "Responded At", "Notes"];
  const escape = (v: string) => `"${v.replace(/"/g, '""')}"`;
  const lines = [header.join(",")];
  for (const r of rows) {
    lines.push([escape(r.name), escape(r.status), escape(r.respondedAt), escape(r.notes)].join(","));
  }
  return lines.join("\n");
}
