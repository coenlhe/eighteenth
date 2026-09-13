"use client";

import { useEffect, useState } from "react";
import type { Photo } from "@/lib/types";

export function Gallery({ refreshKey }: { refreshKey: number }) {
  const [photos, setPhotos] = useState<Photo[] | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/photos")
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled) setPhotos(data.photos ?? []);
      })
      .catch(() => {
        if (!cancelled) setPhotos([]);
      });
    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  useEffect(() => {
    if (lightboxIndex === null) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setLightboxIndex(null);
      if (e.key === "ArrowRight") setLightboxIndex((i) => (i === null || !photos ? i : Math.min(i + 1, photos.length - 1)));
      if (e.key === "ArrowLeft") setLightboxIndex((i) => (i === null ? i : Math.max(i - 1, 0)));
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxIndex, photos]);

  if (photos === null) {
    return <p className="text-center text-sm text-ink-muted">Loading memories…</p>;
  }

  if (photos.length === 0) {
    return <p className="text-center text-sm text-ink-muted">No memories shared yet — be the first! ♡</p>;
  }

  return (
    <>
      <div className="columns-2 gap-3 sm:columns-3 [&>*]:mb-3">
        {photos.map((photo, i) => (
          <button
            key={photo.id}
            type="button"
            onClick={() => setLightboxIndex(i)}
            className="block w-full overflow-hidden rounded-sm"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/uploads/thumbs/${photo.thumbFilename}`}
              alt={photo.caption || "Shared memory"}
              loading="lazy"
              className="w-full object-cover transition-transform hover:scale-[1.03] motion-reduce:transform-none"
            />
          </button>
        ))}
      </div>

      {lightboxIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Photo viewer"
          className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-black/90 px-4 py-8"
          onClick={() => setLightboxIndex(null)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/uploads/full/${photos[lightboxIndex].filename}`}
            alt={photos[lightboxIndex].caption || "Shared memory"}
            className="max-h-[75vh] max-w-full rounded-sm object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <div className="text-center text-primary-contrast" onClick={(e) => e.stopPropagation()}>
            {photos[lightboxIndex].caption && <p>{photos[lightboxIndex].caption}</p>}
            {photos[lightboxIndex].uploaderName && (
              <p className="text-sm text-white/70">— {photos[lightboxIndex].uploaderName}</p>
            )}
          </div>
          <button
            type="button"
            onClick={() => setLightboxIndex(null)}
            className="absolute right-4 top-4 min-h-11 min-w-11 rounded-full bg-white/10 text-primary-contrast hover:bg-white/20"
            aria-label="Close photo viewer"
          >
            ✕
          </button>
        </div>
      )}
    </>
  );
}
