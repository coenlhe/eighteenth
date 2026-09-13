"use client";

import { useEffect, useState } from "react";
import { Section } from "./Section";
import { RsvpForm } from "./RsvpForm";
import { OurMemories } from "./OurMemories";
import { config } from "../lib/config";
import type { Rsvp } from "../lib/types";
import type { EventPhase } from "../lib/config";

const NAME_KEY = "invite:guestName";
const ID_KEY = "invite:guestId";

function makeGuestId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `g_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

export function GuestExperience({ phase }: { phase: EventPhase }) {
  const [name, setName] = useState<string | null>(null);
  const [guestId, setGuestId] = useState<string | null>(null);
  const [draftName, setDraftName] = useState("");
  const [rsvp, setRsvp] = useState<Rsvp | null>(null);
  const [loadingRsvp, setLoadingRsvp] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Load any previously-entered name for this browser.
  useEffect(() => {
    const storedName = window.localStorage.getItem(NAME_KEY);
    const storedId = window.localStorage.getItem(ID_KEY);
    if (storedName && storedId) {
      setName(storedName);
      setGuestId(storedId);
    }
    setHydrated(true);
  }, []);

  // Once we know who's visiting, check the server for their existing RSVP.
  useEffect(() => {
    if (!guestId) return;
    let cancelled = false;
    setLoadingRsvp(true);
    fetch(`/api/rsvp?guestId=${encodeURIComponent(guestId)}`)
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled) setRsvp(data.rsvp ?? null);
      })
      .catch(() => {
        if (!cancelled) setRsvp(null);
      })
      .finally(() => {
        if (!cancelled) setLoadingRsvp(false);
      });
    return () => {
      cancelled = true;
    };
  }, [guestId]);

  function confirmName(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = draftName.trim();
    if (!trimmed) return;
    const id = makeGuestId();
    window.localStorage.setItem(NAME_KEY, trimmed);
    window.localStorage.setItem(ID_KEY, id);
    setName(trimmed);
    setGuestId(id);
    setDraftName("");
  }

  function changeName() {
    window.localStorage.removeItem(NAME_KEY);
    window.localStorage.removeItem(ID_KEY);
    setName(null);
    setGuestId(null);
    setRsvp(null);
  }

  // Avoid a flash of the name prompt before we've checked localStorage.
  if (!hydrated) {
    return (
      <>
        <Section id="for-you" className="bg-surface text-center" />
        <Section id="rsvp" />
        <Section id="memories" className="bg-surface" />
      </>
    );
  }

  return (
    <>
      {/* ── PERSONALIZED INVITATION ─────────────────────────── */}
      <Section id="for-you" className="bg-surface text-center">
        <p className="text-ink-muted">One last thing…</p>
        {name && guestId ? (
          <>
            <p className="mt-4">This invitation was made especially for</p>
            <p className="font-display mt-2 text-3xl">{name}</p>
            <p className="mt-4 text-ink-muted">I&apos;d really love to have you there. ♡</p>
            <button
              type="button"
              onClick={changeName}
              className="mt-5 text-xs text-ink-muted underline decoration-dotted underline-offset-4 hover:text-primary"
            >
              Not you? Type a different name
            </button>
          </>
        ) : (
          <form onSubmit={confirmName} className="mx-auto mt-6 max-w-xs space-y-3">
            <p>This invitation was made especially for you — what&apos;s your name?</p>
            <input
              type="text"
              value={draftName}
              onChange={(e) => setDraftName(e.target.value)}
              placeholder="Type your name"
              maxLength={60}
              className="w-full min-h-11 rounded-sm border border-border bg-background px-4 py-2.5 text-center focus-visible:outline-none"
            />
            <button
              type="submit"
              className="min-h-11 w-full rounded-full bg-primary px-5 py-3 font-medium text-primary-contrast transition-opacity hover:opacity-90"
            >
              That&apos;s me ♡
            </button>
          </form>
        )}
      </Section>

      {/* ── RSVP ─────────────────────────────────────────────── */}
      <Section id="rsvp">
        <h2 className="font-display text-center text-2xl">RSVP</h2>
        <div className="mt-8">
          {!name || !guestId ? (
            <p className="text-center text-sm text-ink-muted">Type your name above first ♡</p>
          ) : loadingRsvp ? (
            <p className="text-center text-sm text-ink-muted">Loading…</p>
          ) : (
            <RsvpForm
              guestId={guestId}
              name={name}
              initialRsvp={rsvp}
              allowChanges={config.allowRsvpChanges}
              onRsvpChange={setRsvp}
            />
          )}
        </div>
      </Section>

      {/* ── OUR MEMORIES ─────────────────────────────────────── */}
      <Section id="memories" className="bg-surface">
        <h2 className="font-display text-center text-2xl">Our memories</h2>
        <p className="mt-2 text-center text-ink-muted">Captured by the people who were there.</p>
        <div className="mt-8">
          {!name || !guestId ? (
            <p className="text-center text-sm text-ink-muted">Type your name above to share photos ♡</p>
          ) : (
            <OurMemories phase={phase} guestId={guestId} guestName={name} />
          )}
        </div>
      </Section>
    </>
  );
}