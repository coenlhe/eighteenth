export function MapEmbed({ embedUrl, mapsUrl }: { embedUrl: string; mapsUrl: string }) {
  return (
    <div className="w-full">
      <div className="aspect-[4/3] w-full overflow-hidden rounded-md shadow-soft sm:aspect-[16/9]">
        <iframe
          src={embedUrl}
          title="Venue location map"
          className="h-full w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
      <a
        href={mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-flex min-h-11 items-center justify-center rounded-full border border-primary px-5 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-primary-contrast"
      >
        Open in Google Maps
      </a>
    </div>
  );
}
