"use client";

import { useRef, useState } from "react";

export function PhotoUpload({
  guestId,
  defaultName,
  onUploaded,
}: {
  guestId: string;
  defaultName: string;
  onUploaded: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [caption, setCaption] = useState("");
  const [name, setName] = useState(defaultName);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const previews = files.map((f) => ({ file: f, url: URL.createObjectURL(f) }));

  function handlePick(list: FileList | null) {
    if (!list) return;
    setFiles(Array.from(list).slice(0, 8));
    setDone(false);
  }

  async function submit() {
    if (!files.length) return;
    setSubmitting(true);
    setError(null);
    try {
      const form = new FormData();
      files.forEach((f) => form.append("files", f));
      form.append("caption", caption);
      form.append("uploaderName", name);
      form.append("guestId", guestId);

      const res = await fetch("/api/photos", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Upload failed.");

      setFiles([]);
      setCaption("");
      setDone(true);
      onUploaded();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="rounded-md border border-border bg-surface p-5">
      {done ? (
        <div className="py-4 text-center">
          <p className="font-display text-lg">Memory added! ♡</p>
          <p className="mt-1 text-sm text-ink-muted">Your photo is now part of our memories.</p>
          <button
            type="button"
            onClick={() => setDone(false)}
            className="mt-4 min-h-11 rounded-full border border-border px-4 py-2 text-sm text-ink-muted hover:border-primary hover:text-primary"
          >
            Share another
          </button>
        </div>
      ) : (
        <>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
            multiple
            className="sr-only"
            onChange={(e) => handlePick(e.target.files)}
          />

          {!files.length ? (
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="min-h-11 w-full rounded-full border border-primary px-5 py-3 font-medium text-primary transition-colors hover:bg-primary hover:text-primary-contrast"
            >
              Share your photos
            </button>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                {previews.map((p, i) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={i}
                    src={p.url}
                    alt={`Preview ${i + 1}`}
                    className="aspect-square w-full rounded-sm object-cover"
                  />
                ))}
              </div>

              <label className="block">
                <span className="mb-1.5 block text-sm text-ink-muted">Caption (optional)</span>
                <input
                  type="text"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="w-full min-h-11 rounded-sm border border-border bg-background px-4 py-2.5 focus-visible:outline-none"
                  placeholder="That dinner was so much fun!"
                />
              </label>

              <label className="block">
                <span className="mb-1.5 block text-sm text-ink-muted">Show your name as</span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full min-h-11 rounded-sm border border-border bg-background px-4 py-2.5 focus-visible:outline-none"
                  placeholder="Your name (leave blank to stay anonymous)"
                />
              </label>

              {error && <p className="text-sm text-red-600">{error}</p>}

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  disabled={submitting}
                  onClick={submit}
                  className="min-h-11 flex-1 rounded-full bg-primary px-5 py-3 font-medium text-primary-contrast transition-opacity hover:opacity-90 disabled:opacity-60"
                >
                  {submitting ? "Uploading…" : "Upload"}
                </button>
                <button
                  type="button"
                  onClick={() => setFiles([])}
                  className="min-h-11 rounded-full border border-border px-5 py-3 text-ink-muted hover:border-primary hover:text-primary"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
