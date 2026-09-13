"use client";

import { useState } from "react";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Login failed.");
      }

      // Hard reload ensures the newly saved cookie is sent to middleware on request
      window.location.assign("/admin/dashboard");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Login failed.");
      setSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 bg-background">
      <form onSubmit={submit} className="w-full max-w-sm space-y-4 rounded-md border border-border bg-surface p-8 shadow-sm">
        <h1 className="font-display text-center text-xl">Admin login</h1>
        <label className="block">
          <span className="mb-1.5 block text-sm text-ink-muted">Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full min-h-11 rounded-sm border border-border bg-background px-4 py-2.5 focus-visible:outline-none"
          />
        </label>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="min-h-11 w-full rounded-sm bg-primary px-5 py-3 font-medium text-primary-contrast transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {submitting ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </main>
  );
}