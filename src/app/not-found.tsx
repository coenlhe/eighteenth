export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center">
      <p className="font-display text-2xl text-ink">Page not found.</p>
      <p className="max-w-sm text-ink-muted">
        Double-check the link, or head back to the invitation.
      </p>
      <a href="/" className="mt-2 text-sm text-primary underline">
        Go to the invitation
      </a>
    </main>
  );
}
