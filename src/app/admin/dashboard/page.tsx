"use client";

import { useEffect, useState } from "react";
import type { Rsvp } from "@/lib/types";

export default function AdminDashboardPage() {
  const [rsvps, setRsvps] = useState<Rsvp[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchRsvps() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/rsvp");
      if (!res.ok) throw new Error("Failed to fetch RSVPs.");
      const data = await res.json();
      setRsvps(data.rsvps ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error loading data.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchRsvps();
  }, []);

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/admin/login";
  }

  // Calculate quick summary metrics using exact status values
  const attending = rsvps.filter((r) => r.status === "ATTENDING");
  const declined = rsvps.filter((r) => r.status === "DECLINED");

  return (
    <main className="min-h-screen bg-background p-6 md:p-10">
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border pb-5">
          <div>
            <h1 className="font-display text-3xl">Admin Dashboard</h1>
            <p className="text-sm text-ink-muted">Guest responses & RSVP summary</p>
          </div>
          <button
            onClick={handleLogout}
            className="rounded-sm border border-border bg-surface px-4 py-2 text-sm font-medium hover:bg-background"
          >
            Sign out
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="rounded-md border border-border bg-surface p-4">
            <span className="block text-2xl font-bold">{rsvps.length}</span>
            <span className="text-xs uppercase tracking-wide text-ink-muted">Total Responses</span>
          </div>
          <div className="rounded-md border border-border bg-surface p-4 text-emerald-600">
            <span className="block text-2xl font-bold">{attending.length}</span>
            <span className="text-xs uppercase tracking-wide text-ink-muted">Confirmed (Attending)</span>
          </div>
          <div className="rounded-md border border-border bg-surface p-4 text-rose-600">
            <span className="block text-2xl font-bold">{declined.length}</span>
            <span className="text-xs uppercase tracking-wide text-ink-muted">Declined</span>
          </div>
        </div>

        {/* Guest List / Notification Feed */}
        <div className="rounded-md border border-border bg-surface p-6">
          <h2 className="font-display mb-4 text-xl">Guest Responses</h2>

          {loading ? (
            <p className="py-8 text-center text-sm text-ink-muted">Loading responses…</p>
          ) : error ? (
            <p className="py-8 text-center text-sm text-rose-600">{error}</p>
          ) : rsvps.length === 0 ? (
            <p className="py-8 text-center text-sm text-ink-muted">No guest responses recorded yet.</p>
          ) : (
            <div className="divide-y divide-border">
              {rsvps.map((rsvp) => (
                <div key={rsvp.guestId} className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium text-ink">{rsvp.name}</p>
                    {rsvp.notes && <p className="text-xs italic text-ink-muted">&ldquo;{rsvp.notes}&rdquo;</p>}
                  </div>
                  <div className="text-right">
                    <span
                      className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                        rsvp.status === "ATTENDING"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-rose-100 text-rose-800"
                      }`}
                    >
                      {rsvp.status === "ATTENDING" ? "Attending" : "Declined"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}