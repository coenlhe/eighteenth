"use client";

import { useState } from "react";
import type { EventPhase } from "@/lib/config";
import { PhotoUpload } from "./PhotoUpload";
import { Gallery } from "./Gallery";

export function OurMemories({
  phase,
  guestId,
  guestName,
}: {
  phase: EventPhase;
  guestId: string;
  guestName: string;
}) {
  const [refreshKey, setRefreshKey] = useState(0);

  if (phase === "before") {
    return (
      <p className="rounded-md border border-border bg-surface p-6 text-center text-ink-muted">
        Photo gallery opens after the celebration ♡
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <PhotoUpload guestId={guestId} defaultName={guestName} onUploaded={() => setRefreshKey((k) => k + 1)} />
      <Gallery refreshKey={refreshKey} />
    </div>
  );
}
