/**
 * Renders a real photo if `src` is set, otherwise an obviously-fake
 * placeholder box labeled with what should go there. This is how the
 * birthday person swaps in their own photos later without touching
 * component code — they just fill in `images.*` in lib/config.ts.
 */
export function PlaceholderImage({
  src,
  label,
  aspect = "aspect-[4/5]",
  alt,
  className = "",
}: {
  src: string | null;
  label: string;
  aspect?: string;
  alt: string;
  className?: string;
}) {
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        className={`w-full h-auto object-contain ${className}`}
      />
    );
  }
  return (
    <div
      role="img"
      aria-label={`${label} placeholder`}
      className={`placeholder-box w-full ${aspect} ${className}`}
    >
      [ {label} ]
    </div>
  );
}