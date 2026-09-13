"use client";

import { useState } from "react";
import type { Rsvp, RsvpStatus } from "@/lib/types";

export function RsvpForm({
  guestId,
  name,
  initialRsvp,
  allowChanges,
  onRsvpChange,
}: {
  guestId: string;
  name: string;
  initialRsvp: Rsvp | null;
  allowChanges: boolean;
  onRsvpChange?: (rsvp: Rsvp) => void;
}) {
  const [rsvp, setRsvp] = useState<Rsvp | null>(initialRsvp);
  const [choice, setChoice] = useState<RsvpStatus | null>(null);
  const [notes, setNotes] = useState(initialRsvp?.notes ?? "");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);

  const alreadyResponded = rsvp && !editing;

  async function submit(status: RsvpStatus) {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ guestId, name, status, notes }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Something went wrong.");
      setRsvp(data.rsvp);
      onRsvpChange?.(data.rsvp);
      setEditing(false);
      setChoice(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  if (alreadyResponded) {
    return (
      <div className="rounded-md border border-border bg-surface p-6 text-center">
        {rsvp!.status === "ATTENDING" ? (
          <>
            <p className="font-display text-xl">Thank you! ♡</p>
            <p className="mt-1 text-ink-muted">See you there!</p>
          </>
        ) : (
          <>
            <p className="font-display text-xl">I&apos;ll miss you! ♡</p>
            <p className="mt-1 text-ink-muted">Thank you for letting me know.</p>
          </>
        )}
        {allowChanges && (
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="mt-4 min-h-11 rounded-full border border-border px-4 py-2 text-sm text-ink-muted transition-colors hover:border-primary hover:text-primary"
          >
            Change my response
          </button>
        )}
      </div>
    );
  }

  if (choice === "ATTENDING") {
    return (
      <div className="space-y-4">
        <label className="block">
          <span className="mb-1.5 block text-sm text-ink-muted">Additional notes (optional)</span>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full rounded-sm border border-border bg-surface px-4 py-2.5 focus-visible:outline-none"
            placeholder="Anything else I should know?"
          />
        </label>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            disabled={submitting}
            onClick={() => submit("ATTENDING")}
            className="min-h-11 flex-1 rounded-full bg-primary px-5 py-3 font-medium text-primary-contrast transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {submitting ? "Confirming…" : "Confirm RSVP"}
          </button>
          <button
            type="button"
            onClick={() => setChoice(null)}
            className="min-h-11 rounded-full border border-border px-5 py-3 text-ink-muted hover:border-primary hover:text-primary"
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  if (choice === "DECLINED") {
    return (
      <div className="space-y-4">
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            disabled={submitting}
            onClick={() => submit("DECLINED")}
            className="min-h-11 flex-1 rounded-full bg-primary px-5 py-3 font-medium text-primary-contrast transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {submitting ? "Confirming…" : "Confirm"}
          </button>
          <button
            type="button"
            onClick={() => setChoice(null)}
            className="min-h-11 rounded-full border border-border px-5 py-3 text-ink-muted hover:border-primary hover:text-primary"
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <button
        type="button"
        onClick={() => setChoice("ATTENDING")}
        className="min-h-11 flex-1 rounded-full bg-primary px-5 py-3 font-medium text-primary-contrast transition-opacity hover:opacity-90"
      >
        Yes, I&apos;ll be there ♡
      </button>
      <button
        type="button"
        onClick={() => setChoice("DECLINED")}
        className="min-h-11 flex-1 rounded-full border border-border px-5 py-3 text-ink-muted transition-colors hover:border-primary hover:text-primary"
      >
        I&apos;m sorry, I can&apos;t make it
      </button>
    </div>
  );
}
