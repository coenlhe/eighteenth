"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { Photo, Rsvp, RsvpStatus } from "@/lib/types";

type SortKey = "name" | "status" | "respondedAt";

export function DashboardClient({
  rows: initialRows,
  photos: initialPhotos,
  expectedGuests,
}: {
  rows: Rsvp[];
  photos: Photo[];
  expectedGuests: string[];
}) {
  const router = useRouter();
  const [rows, setRows] = useState(initialRows);
  const [photos, setPhotos] = useState(initialPhotos);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | RsvpStatus>("ALL");
  const [sortKey, setSortKey] = useState<SortKey>("respondedAt");
  const [confirmDeletePhotoId, setConfirmDeletePhotoId] = useState<string | null>(null);
  const [confirmDeleteRsvpId, setConfirmDeleteRsvpId] = useState<string | null>(null);

  const stats = useMemo(
    () => ({
      total: rows.length,
      attending: rows.filter((r) => r.status === "ATTENDING").length,
      declined: rows.filter((r) => r.status === "DECLINED").length,
    }),
    [rows]
  );

  const checklist = useMemo(
    () =>
      expectedGuests.map((expectedName) => {
        const match = rows.find((r) => {
          const a = r.name.trim().toLowerCase();
          const b = expectedName.trim().toLowerCase();
          return a === b || a.includes(b) || b.includes(a);
        });
        return { expectedName, status: match?.status ?? null };
      }),
    [expectedGuests, rows]
  );

  const visibleRows = useMemo(() => {
    let filtered = rows;
    if (statusFilter !== "ALL") filtered = filtered.filter((r) => r.status === statusFilter);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      filtered = filtered.filter((r) => r.name.toLowerCase().includes(q));
    }
    return [...filtered].sort((a, b) => {
      if (sortKey === "name") return a.name.localeCompare(b.name);
      if (sortKey === "status") return a.status.localeCompare(b.status);
      return b.respondedAt.localeCompare(a.respondedAt);
    });
  }, [rows, search, statusFilter, sortKey]);

  async function changeStatus(guestId: string, status: RsvpStatus) {
    const res = await fetch(`/api/admin/rsvp/${guestId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      setRows((prev) => prev.map((r) => (r.guestId === guestId ? { ...r, status } : r)));
    }
  }

  async function confirmDeleteRsvp(guestId: string) {
    const res = await fetch(`/api/admin/rsvp/${guestId}`, { method: "DELETE" });
    if (res.ok) {
      setRows((prev) => prev.filter((r) => r.guestId !== guestId));
    }
    setConfirmDeleteRsvpId(null);
  }

  async function confirmDeletePhoto(id: string) {
    const res = await fetch(`/api/admin/photos/${id}`, { method: "DELETE" });
    if (res.ok) {
      setPhotos((prev) => prev.filter((p) => p.id !== id));
    }
    setConfirmDeletePhotoId(null);
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-display text-2xl">RSVP dashboard</h1>
        <button
          type="button"
          onClick={logout}
          className="min-h-11 rounded-sm border border-border px-4 py-2 text-sm text-ink-muted hover:border-primary hover:text-primary"
        >
          Log out
        </button>
      </div>

      <p className="mb-4 text-sm text-ink-muted">
        There&apos;s no fixed guest list — this is everyone who has typed their name and
        responded so far via the shared invitation link.
      </p>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <StatCard label="Responses" value={stats.total} />
        <StatCard label="Attending" value={stats.attending} />
        <StatCard label="Declined" value={stats.declined} />
      </div>

      {/* Guest checklist — cross-references your expected guest list
          (config.ts) against submitted names. Purely a reference; it
          doesn't gate access and matching is a simple text comparison,
          so double-check anyone that looks off. */}
      {expectedGuests.length > 0 && (
        <div className="mt-10">
          <h2 className="font-display text-lg">
            Guest checklist ({checklist.filter((c) => c.status).length}/{checklist.length} responded)
          </h2>
          <div className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2 rounded-md border border-border bg-surface p-4 sm:grid-cols-3">
            {checklist.map((c) => (
              <div key={c.expectedName} className="flex items-center gap-2 text-sm">
                <span
                  aria-hidden="true"
                  className={`h-2 w-2 shrink-0 rounded-full ${
                    c.status === "ATTENDING"
                      ? "bg-green-600"
                      : c.status === "DECLINED"
                        ? "bg-red-500"
                        : "bg-border"
                  }`}
                />
                <span className={c.status ? "" : "text-ink-muted"}>{c.expectedName}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="mt-10 flex flex-wrap items-center gap-3">
        <input
          type="text"
          placeholder="Search by name…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="min-h-11 flex-1 rounded-sm border border-border bg-surface px-4 py-2 focus-visible:outline-none"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
          className="min-h-11 rounded-sm border border-border bg-surface px-3 py-2"
        >
          <option value="ALL">All statuses</option>
          <option value="ATTENDING">Attending</option>
          <option value="DECLINED">Declined</option>
        </select>
        <select
          value={sortKey}
          onChange={(e) => setSortKey(e.target.value as SortKey)}
          className="min-h-11 rounded-sm border border-border bg-surface px-3 py-2"
        >
          <option value="respondedAt">Sort by date responded</option>
          <option value="name">Sort by name</option>
          <option value="status">Sort by status</option>
        </select>
        <a
          href="/api/admin/export"
          className="min-h-11 rounded-sm border border-primary px-4 py-2 text-primary hover:bg-primary hover:text-primary-contrast"
        >
          Export CSV
        </a>
      </div>

      {/* Table */}
      <div className="mt-4 overflow-x-auto rounded-md border border-border">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="bg-surface text-ink-muted">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">RSVP</th>
              <th className="px-4 py-3">Date responded</th>
              <th className="px-4 py-3">Notes</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {visibleRows.map((r) => (
              <tr key={r.guestId} className="border-t border-border">
                <td className="px-4 py-3">{r.name}</td>
                <td className="px-4 py-3">
                  <select
                    value={r.status}
                    onChange={(e) => changeStatus(r.guestId, e.target.value as RsvpStatus)}
                    className="rounded-sm border border-border bg-background px-2 py-1"
                  >
                    <option value="ATTENDING">Attending</option>
                    <option value="DECLINED">Declined</option>
                  </select>
                </td>
                <td className="px-4 py-3 text-ink-muted">{new Date(r.respondedAt).toLocaleString()}</td>
                <td className="px-4 py-3 text-ink-muted">{r.notes || "—"}</td>
                <td className="px-4 py-3">
                  {confirmDeleteRsvpId === r.guestId ? (
                    <button
                      type="button"
                      onClick={() => confirmDeleteRsvp(r.guestId)}
                      className="rounded-sm bg-red-600 px-2 py-1 text-xs text-white"
                    >
                      Confirm delete
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setConfirmDeleteRsvpId(r.guestId)}
                      className="rounded-sm border border-border px-2 py-1 text-xs text-ink-muted hover:border-red-600 hover:text-red-600"
                    >
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {visibleRows.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-ink-muted">
                  No responses match.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Photos */}
      <h2 className="font-display mt-14 text-xl">Uploaded photos ({photos.length})</h2>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {photos.map((p) => (
          <div key={p.id} className="rounded-sm border border-border p-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/uploads/thumbs/${p.thumbFilename}`}
              alt={p.caption || "Uploaded photo"}
              className="aspect-square w-full rounded-sm object-cover"
            />
            <p className="mt-2 truncate text-xs text-ink-muted">{p.uploaderName || "Anonymous"}</p>
            <p className="text-xs text-ink-muted">{new Date(p.createdAt).toLocaleString()}</p>
            <div className="mt-2 flex gap-2">
              <a
                href={`/uploads/full/${p.filename}`}
                download
                className="flex-1 rounded-sm border border-border px-2 py-1 text-center text-xs hover:border-primary hover:text-primary"
              >
                Download
              </a>
              {confirmDeletePhotoId === p.id ? (
                <button
                  type="button"
                  onClick={() => confirmDeletePhoto(p.id)}
                  className="flex-1 rounded-sm bg-red-600 px-2 py-1 text-xs text-white"
                >
                  Confirm
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmDeletePhotoId(p.id)}
                  className="flex-1 rounded-sm border border-border px-2 py-1 text-xs text-ink-muted hover:border-red-600 hover:text-red-600"
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        ))}
        {photos.length === 0 && <p className="text-ink-muted">No photos uploaded yet.</p>}
      </div>
    </main>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md border border-border bg-surface p-4 text-center">
      <p className="text-2xl font-semibold">{value}</p>
      <p className="text-xs uppercase tracking-wide text-ink-muted">{label}</p>
    </div>
  );
}
