/**
 * ============================================================
 *   SITE CONFIG — edit everything about the invitation here.
 * ============================================================
 *
 * This is the ONE file most customization happens in. Change the
 * text below and the whole site updates — no need to touch any
 * component code.
 */

export type EventPhase = "before" | "after";

export const config = {
  /**
   * ── EVENT PHASE ──────────────────────────────────────────
   * "before"  -> RSVP is open, photo gallery shows a "coming soon" message.
   * "after"   -> Guests can upload + browse the shared photo gallery.
   */
  eventPhase: "after" as EventPhase,

  /** Allow a guest to submit a new RSVP after they already answered. */
  allowRsvpChanges: true,

  /**
   * ── EXPECTED GUESTS (admin reference only) ──────────────────
   */
  expectedGuests: [
    "Sage",
    "Haydi",
    "Erich",
    "Ash",
    "Hannah",
    "Bella",
    "Michaella",
    "Rhose",
    "Beverly",
    "Van",
    "Mary",
    "Mara",
    "Ayen",
    "Mazie",
    "Lhianne",
    "Feona",
    "Trisha",
    "Jasmine",
    "Dhiane",
  ],

  // ── WHO ──────────────────────────────────────────────────
  birthdayPersonName: "Coleen",
  heroTitle: "18 YEARS IN THE MAKING",
  heroSubtitle: "—an afternoon to indulge and celebrate.",

  // ── WHEN & WHERE ─────────────────────────────────────────
  date: "September 20, 2026", 
  meetUpTime: "12:30 PM", 
  venueName: "Lafaayette Luxury Suites Buffet",
  address: "1 Military Cut-off Rd, Baguio, 2600 Cordillera Administrative Region",
  
  map: {
    latitude: 16.4035451,
    longitude: 120.6051827,
    zoom: 16,
  },

  // ── PERSONAL MESSAGE ─────────────────────────────────────
  personalMessage: [
    "To mark my 18th birthday, I'm keeping things simple and celebrating over a wonderful afternoon feast.",
    "No debut routines or formal itineraries—just an afternoon to dress up, enjoy great food, snap some memory-worthy photos, and catch up.",
    "It’s all about good flavor, great company, and making timeless memories together.",
    "I can’t wait to celebrate with you!",
  ],

  // ── WHAT WE'LL DO (casual flow, NOT a formal program) ────
  flow: [
    { emoji: "📸", title: "Meet + photos", text: "We'll meet at the lobby and take pictures together." },
    { emoji: "🍽️", title: "Let's eat", text: "Buffet time!" },
    { emoji: "💬", title: "Catch up", text: "Eat, talk, laugh, and enjoy each other's company." },
    { emoji: "📸", title: "One more photo", text: "We'll take more pictures at the lobby after eating." },
    { emoji: "♡", title: "Until next time", text: "We'll say our goodbyes and head home." },
  ],

  // ── DRESS CODE ───────────────────────────────────────────
  dressCode: {
    label: "Smart Casual",
    note: "Come camera-ready — we're taking lots of pictures!",
    imagePath: null as string | null, // Put image in /public/images/dress-code.jpg if you have one
  },

  // ── WHAT TO BRING ────────────────────────────────────────
  whatToBring: [
    { emoji: "♡", text: "Yourself" },
    { emoji: "📱", text: "Your phone" },
    { emoji: "🍽️", text: "Your appetite" },
    { emoji: "💬", text: "Your best stories" },
    { emoji: "☂️", text: "Your umbrella" },
  ],

  // ── CLOSING ──────────────────────────────────────────────
  closingLine1: "Thank you for being part of my 18th.",
  closingLine2: "See you there. ♡",

  // ── IMAGES ───────────────────────────────────────────────
  images: {
    hero: "/images/portrait-card.png",
    background: "/images/background.png",
    venue: null as string | null,
  },
} as const;

/** Google Maps "open in maps" link, built from config above. */
export function googleMapsUrl(): string {
  const { latitude, longitude } = config.map;
  if (latitude && longitude) {
    return `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
  }
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(config.address)}`;
}

/** Embeddable (no-API-key) Google Maps URL for an <iframe>. */
export function googleMapsEmbedUrl(): string {
  const { latitude, longitude, zoom } = config.map;
  return `https://maps.google.com/maps?q=${latitude},${longitude}&z=${zoom}&output=embed`;
}