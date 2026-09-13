export function FloralDivider() {
  return (
    <div aria-hidden="true" className="mx-auto mb-8 flex w-full max-w-[220px] items-center gap-3 text-accent">
      <span className="h-px flex-1 bg-current opacity-40" />
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="shrink-0">
        <g fill="currentColor" opacity="0.85">
          <ellipse cx="12" cy="7" rx="3" ry="4.2" />
          <ellipse cx="12" cy="17" rx="3" ry="4.2" />
          <ellipse cx="7" cy="12" rx="4.2" ry="3" />
          <ellipse cx="17" cy="12" rx="4.2" ry="3" />
        </g>
        <circle cx="12" cy="12" r="2.4" fill="var(--color-primary)" />
      </svg>
      <span className="h-px flex-1 bg-current opacity-40" />
    </div>
  );
}
