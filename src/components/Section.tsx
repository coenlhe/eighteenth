import type { ReactNode } from "react";

export function Section({
  id,
  className = "",
  children,
}: {
  id?: string;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <section
      id={id}
      className={`animate-fade-up px-6 py-[var(--space-section-y)] ${className}`}
    >
      <div className="mx-auto w-full max-w-2xl">{children}</div>
    </section>
  );
}
