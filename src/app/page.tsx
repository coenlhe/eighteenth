import { config, googleMapsEmbedUrl, googleMapsUrl } from "@/lib/config";
import { Section } from "@/components/Section";
import { MapEmbed } from "@/components/MapEmbed";
import { GuestExperience } from "@/components/GuestExperience";
import { FloralDivider } from "@/components/FloralDivider";
import { RibbonBand } from "@/components/RibbonBand";
import { GalleryWall } from "@/components/GalleryWall";

export default function InvitePage() {
  return (
    <main
      className="min-h-screen w-full bg-cover bg-top bg-fixed bg-no-repeat text-[#fcfaed]"
      style={{ backgroundImage: `url(${config.images.background})` }}
    >
      {/* ── 1. HERO ─────────────────────────────────────────── */}
      <Section
        id="top"
        className="relative flex min-h-[90vh] flex-col items-center justify-center overflow-hidden text-center"
      >
        <p className="text-sm uppercase tracking-[0.2em] text-[#fef08a]/90 font-medium drop-shadow-sm">
          {config.date}
        </p>
        <h1 className="font-display mt-4 text-4xl leading-tight sm:text-5xl text-[#fef08a] drop-shadow-lg">
          {config.heroTitle}
        </h1>
        <p className="font-script mt-2 text-2xl text-[#fef3c7] drop-shadow-md">
          {config.heroSubtitle}
        </p>

        {/* Hero Portrait Frame */}
        <div className="mt-8 w-full max-w-sm flex justify-center">
          <img
            src={config.images.hero}
            alt="Hero photograph"
            className="w-full h-auto max-w-[320px] drop-shadow-2xl transition-transform duration-300 hover:scale-[1.02]"
          />
        </div>

        <dl className="mt-8 grid grid-cols-1 gap-1 text-[#fcfaed] sm:grid-cols-3 sm:gap-6">
          <div>
            <dt className="text-xs uppercase tracking-wide text-[#fef08a]/80">Date</dt>
            <dd className="font-medium text-[#fcfaed]">{config.date}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-[#fef08a]/80">Time</dt>
            <dd className="font-medium text-[#fcfaed]">{config.meetUpTime}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-[#fef08a]/80">Venue</dt>
            <dd className="font-medium text-[#fcfaed]">{config.venueName}</dd>
          </div>
        </dl>

        <a
          href="#message"
          className="btn-primary mt-10 inline-flex min-h-11 items-center justify-center rounded-full px-8 py-3 text-sm font-medium uppercase tracking-[0.15em] shadow-soft"
        >
          Open your invitation
        </a>
      </Section>

      {/* ── 2. PERSONAL MESSAGE ─────────────────────────────── */}
      <Section id="message">
        <FloralDivider />
        <div className="space-y-4 text-center">
          {config.personalMessage.map((line, i) =>
            i === 0 ? (
              <p key={i} className="drop-cap font-display mx-auto max-w-sm text-left text-2xl leading-snug text-[#fef08a]">
                {line}
              </p>
            ) : (
              <p key={i} className="text-[#fcfaed]/90 text-lg leading-relaxed">
                {line}
              </p>
            )
          )}
        </div>
      </Section>

      {/* ── GALLERY WALL ────────────────────────────────────── */}
      <Section id="gallery-wall">
        <GalleryWall />
      </Section>

      {/* ── 3. WHEN & WHERE ─────────────────────────────────── */}
      <Section id="when-where" className="bg-black/40 backdrop-blur-md rounded-2xl my-6 border border-white/10">
        <h2 className="font-display text-center text-2xl text-[#fef08a]">When &amp; where</h2>
        <dl className="mx-auto mt-8 grid max-w-md grid-cols-2 gap-y-4 text-sm">
          <dt className="text-[#d6c7b2]">Date</dt>
          <dd className="text-right font-medium text-[#fcfaed]">{config.date}</dd>
          <dt className="text-[#d6c7b2]">Meet-up time</dt>
          <dd className="text-right font-medium text-[#fcfaed]">{config.meetUpTime}</dd>
          <dt className="text-[#d6c7b2]">Venue</dt>
          <dd className="text-right font-medium text-[#fcfaed]">{config.venueName}</dd>
          <dt className="text-[#d6c7b2]">Address</dt>
          <dd className="text-right font-medium text-[#fcfaed]">{config.address}</dd>
        </dl>
        <div className="mt-8">
          <MapEmbed embedUrl={googleMapsEmbedUrl()} mapsUrl={googleMapsUrl()} />
        </div>
      </Section>

      {/* ── 4. WHAT WE'LL DO ────────────────────────────────── */}
      <Section id="flow" className="bg-black/50 backdrop-blur-md rounded-2xl my-6 border border-amber-200/20 p-6 text-white">
        <h2 className="font-display text-center text-2xl text-[#fef08a] drop-shadow-md">What we&apos;ll do</h2>
        <div className="mt-8 divide-y divide-amber-100/20 text-[#fef3c7]">
          {config.flow.map((step, i) => (
            <RibbonBand key={i} eyebrow={step.emoji} title={step.title}>
              <span className="text-[#fcfaed] font-medium drop-shadow-sm">{step.text}</span>
            </RibbonBand>
          ))}
        </div>
      </Section>

      {/* ── 5. DRESS CODE ───────────────────────────────────── */}
      <Section id="dress-code" className="bg-black/40 backdrop-blur-md rounded-2xl my-6 border border-white/10">
        <h2 className="font-display text-center text-2xl text-[#fef08a]">Dress code</h2>
        <p className="mt-3 text-center font-medium text-[#fcfaed] text-lg">{config.dressCode.label}</p>
        <p className="mt-1 text-center text-[#d6c7b2]">{config.dressCode.note}</p>
        
        {/* Dress Code Image */}
        <div className="mx-auto mt-8 flex justify-center max-w-xl">
          <img
            src="/images/dresscode.png"
            alt="Dress code reference guide"
            className="w-full h-auto rounded-lg drop-shadow-2xl transition-transform duration-300 hover:scale-[1.01]"
          />
        </div>
      </Section>

      {/* ── 6. WHAT TO BRING ────────────────────────────────── */}
      <Section id="what-to-bring">
        <h2 className="font-display text-center text-2xl text-[#fef08a]">What to bring</h2>
        <ul className="mx-auto mt-8 max-w-sm space-y-3">
          {config.whatToBring.map((item, i) => (
            <li key={i} className="flex items-center gap-3 text-[#fcfaed]">
              <span aria-hidden="true">{item.emoji}</span>
              <span>{item.text}</span>
            </li>
          ))}
        </ul>
      </Section>

      {/* ── 7, 8, 9. PERSONALIZED INVITATION, RSVP, MEMORIES ─── */}
      <GuestExperience phase={config.eventPhase} />

      {/* ── 10. CLOSING ─────────────────────────────────────── */}
      <Section id="closing" className="text-center">
        <FloralDivider />
        <p className="font-display text-xl text-[#fef08a]">{config.closingLine1}</p>
        <p className="mt-2 text-[#fcfaed]/80">{config.closingLine2}</p>
      </Section>
    </main>
  );
}