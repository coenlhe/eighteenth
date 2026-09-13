import React from "react";

interface RibbonBandProps {
  eyebrow?: string;
  title: string;
  children: React.ReactNode;
}

export function RibbonBand({ eyebrow, title, children }: RibbonBandProps) {
  return (
    <div className="py-4 px-6 border-b border-border/30">
      {eyebrow && <span className="text-xl mr-2">{eyebrow}</span>}
      <h3 className="inline-block font-medium text-ink">{title}</h3>
      <p className="mt-1 text-sm text-ink-muted">{children}</p>
    </div>
  );
}