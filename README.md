# [Your Name]'s 18th Birthday Invitation

A private, personal digital invitation — one link for your whole group chat.
Guests open it, type their own name, RSVP, and (after the celebration) share
photos into a shared gallery that stays online as a permanent memory archive.

This README assumes no prior web-development experience. Follow it top to bottom.

---

## 1. How guest access works (important)

There's **one single link** for the whole site — you post it once in your
group chat. There are no individual per-guest links.

When someone opens the link:
1. They browse the invitation (date, venue, dress code, etc.).
2. Near the bottom, they're asked **"What's your name?"** — they type it in.
3. Their browser remembers that name (so if they come back later, it
   recognizes them and shows their existing RSVP instead of asking again).
4. They RSVP and, after the event, can upload photos under that name.

This is simpler to send out (one link, not 19), but it means **anyone with
the link can type any name** — there's no verification. It's built for a
trusted group chat, not a public event. Your private admin dashboard has a
**guest checklist** (see §8) that cross-checks names against your expected
list so you can spot anything odd.

If someone accidentally submits a typo'd name or a duplicate, you can't edit
their name directly, but you can delete the bad entry from the admin
dashboard and ask them to redo it.

---

## 2. What you're looking at

- **Next.js** website (React + TypeScript), styled with **Tailwind CSS**.
- Default look: vintage, romantic **cream & mocha with dusty-rose accents**
  — fully re-themeable
  via CSS variables (§6).
- No external database — RSVPs and photo info are stored as JSON files in
  `/data`; uploaded photos live in `/public/uploads`.
- Nothing on this site can be found via Google — see [§11](#11-keeping-it-out-of-search-engines).

```
birthday-invite/
├── src/
│   ├── lib/config.ts          ← ⭐ MOST CUSTOMIZATION HAPPENS HERE
│   ├── app/globals.css        ← ⭐ COLORS / FONTS (design tokens)
│   ├── app/page.tsx           ← the entire invitation (the one shared link)
│   ├── components/
│   │   └── GuestExperience.tsx  ← name entry + RSVP + photo sharing
│   └── app/admin/              ← your private dashboard
├── public/images/              ← ⭐ PUT YOUR PHOTOS HERE
├── public/uploads/             ← guest-uploaded photos land here automatically
├── data/                       ← created automatically; RSVPs
└── .env.example                ← copy to .env.local, fill in your own secrets
```

---

## 3. Install & run locally

You need [Node.js](https://nodejs.org) version 18 or newer installed.

```bash
# 1. Open a terminal in this project folder, then:
npm install

# 2. Create your local environment file:
cp .env.example .env.local
```

Open `.env.local` and set two things:

```env
ADMIN_PASSWORD=pick-a-real-password-here
SESSION_SECRET=a-long-random-string
```

Generate a good random secret with:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Then start the site:

```bash
npm run dev
```

Open **http://localhost:3000** — that's your invitation, exactly as guests
will see it. Scroll down, type any name in the "What's your name?" box, and
try RSVPing to test it out (see §9 for the full test checklist).

---

## 4. Customizing your event details

Open **`src/lib/config.ts`**. Every placeholder is written in `[BRACKETS]`.
Edit the values directly — no other files need to change for text content:

| What to change              | Field in `config.ts`                          |
| ---------------------------- | ---------------------------------------------- |
| Hero headline / subtitle     | `heroTitle`, `heroSubtitle`                    |
| Date                         | `date`                                         |
| Meet-up time                 | `meetUpTime`                                   |
| Venue name                   | `venueName`                                    |
| Full address                 | `address`                                      |
| Map location                 | `map.latitude` / `map.longitude` (see below)   |
| Personal message             | `personalMessage` (array of paragraphs)        |
| "What we'll do" flow steps   | `flow` (array of `{ emoji, title, text }`)     |
| Dress code                   | `dressCode.label`, `dressCode.note`            |
| What to bring                | `whatToBring` (array of `{ emoji, text }`)     |
| Closing message              | `closingLine1`, `closingLine2`                 |
| Your expected guest list     | `expectedGuests` (see §8 — admin reference only) |

### Setting the map location
Find your venue on [Google Maps](https://maps.google.com), right-click the pin,
and click the coordinates that pop up to copy them (e.g. `14.5995, 120.9842`).
Paste them into `map.latitude` / `map.longitude` in `config.ts`. The embedded
map and the "Open in Google Maps" button both use this automatically.

---

## 5. Replacing images

Photos are **not included** — every image slot shows an obvious `[ LABEL ]`
placeholder box until you add a real file.

1. Add your photo to `public/images/` — for example `public/images/hero.jpg`.
2. In `src/lib/config.ts`, set the matching field:
   ```ts
   images: {
     hero: "/images/hero.jpg",
   },
   ```
   Same idea for the dress-code reference photo: `dressCode.imagePath: "/images/dress-code.jpg"`.
3. Save — the placeholder box is replaced by your real photo automatically.

Leave a field as `null` to keep showing the placeholder box.

---

## 6. Changing colors & fonts

The site ships with a vintage, romantic **cream & mocha with dusty-rose
accents** theme by default (ivory background, brown "ribbon band" strips
with lace-scalloped edges, a rose pink for buttons). Open
**`src/app/globals.css`** and edit the values at the top under
`DESIGN TOKENS` to change it:

```css
--color-primary: #d98aa3;      /* buttons, links — dusty rose */
--color-background: #faf3ea;   /* page background — ivory/cream */
--color-text: #4a372e;         /* body text — deep mocha brown */
--color-band: #8b6f5c;         /* the brown ribbon-band strips in "What we'll do" */
--font-display: "Playfair Display", Georgia, serif;   /* headings */
--font-script: "Dancing Script", cursive;              /* small flourishes */
```

Every button, heading, band, and background on the site reads from these
variables, so changing a color here updates the whole site consistently.
A few extra decorative touches also live in `globals.css` if you want to
adjust them: `.vintage-frame` (the ornate border around the hero photo),
`.lace-edge` (the scalloped trim on the brown bands), and `.drop-cap` (the
oversized first letter on the personal message).

To use different Google Fonts, change **both**:
1. The font names in the `<link>` tag in `src/app/layout.tsx`.
2. The matching `--font-display` / `--font-script` values in `globals.css`.

> **Note on the build:** Next.js tries to optimize/inline the Google Fonts
> stylesheet at build time. If you build this project somewhere with
> restricted network access, you may see a harmless
> `Failed to minify the stylesheet for fonts.googleapis.com...` message in
> the terminal — the build still completes and the site still works
> (browsers just fetch the font normally at runtime instead of it being
> inlined). With normal internet access this warning won't appear.

---

## 7. Accessing your admin dashboard

Go to **`/admin/login`** and enter the `ADMIN_PASSWORD` you set in `.env.local`
(or in your hosting provider's environment variables once deployed).

The dashboard at `/admin/dashboard` shows:
- Totals: responses / attending / declined
- A **guest checklist** cross-referencing `expectedGuests` (§8)
- A searchable, filterable, sortable response table
- A button to manually correct anyone's RSVP status
- A **delete** button per response (for typos, duplicates, or spam entries)
- **Export CSV** — downloads all RSVP data as a spreadsheet-ready file
- All uploaded photos, with uploader name, timestamp, download, and delete

This page is not linked from anywhere on the public site and requires your
password — guests can never reach it.

---

## 8. The guest checklist

Since there's no per-guest link, there's also no automatic way to know who
from your group *hasn't* answered yet. To help with that, `config.ts` has an
`expectedGuests` list — your 19 names are already in there:

```ts
expectedGuests: ["Sage", "Haydi", "Erich", "Ash", "Hannah", "Bella",
  "Michaella", "Rhose", "Beverly", "Van", "Mary", "Mara", "Ayen", "Mazie",
  "Lhianne", "Feona", "Trisha", "Jasmine", "Dhiane"],
```

**This list does not control access or gate anything** — it's purely a
reference shown on your private dashboard, matching typed names against this
list (case-insensitive, partial match) so you can see at a glance who's
responded and who hasn't. Add or remove names any time; it's just for you.

If a guest types a nickname that doesn't match well (e.g., "Aish" for
"Ash"), the checklist might not catch it — check the full response table
below the checklist for anyone unmatched.

---

## 9. Testing before you send it out

Do this locally (`npm run dev`) or on a deployed preview before sending the
real link to anyone:

1. Open the site in an **incognito/private window** (fresh, no localStorage).
2. Scroll to the RSVP section, type a test name, and submit **Yes**.
3. Refresh the page — confirm it now shows your confirmation instead of the
   buttons again (duplicate prevention working).
4. Click **Change my response** and confirm you can switch to **No**.
5. Click **Not you? Type a different name**, enter a second test name, and
   confirm it gets tracked as a separate, independent RSVP.
6. Log into `/admin/dashboard` and confirm both test responses appear, with
   correct stats and checklist matching.
7. Delete your test entries from the dashboard when you're done (so they
   don't linger in real data before you send invites).
8. The gallery is open by default (`eventPhase: "after"`) — test uploading a
   test photo and confirm it appears instantly with no approval step.
9. Open the site on an actual phone and check it's comfortable to use,
   nothing overflows sideways, and buttons are easy to tap.

---

## 10. Managing RSVPs

- Guests tap **Yes, I'll be there ♡** or **I'm sorry, I can't make it**.
  If "yes," they can optionally add notes.
- Once submitted, a guest sees their confirmed response instead of the
  buttons — this prevents accidental duplicate RSVPs **from the same browser**.
  (Someone using a different browser or device would be treated as a new,
  separate response — there's no way to fully prevent this without asking
  guests to log in, which felt like overkill for a group-chat invite.)
- Guests can tap **Change my response** to update it later
  (controlled by `allowRsvpChanges` in `config.ts` — set to `false` to lock
  responses once submitted).
- You can correct anyone's status, or delete a bad/duplicate entry, from the
  admin dashboard.
- Export the full list anytime via **Export CSV** on the dashboard.

---

## 11. The photo gallery ("Our Memories")

This project ships with the gallery **already open** (`eventPhase: "after"`
in `config.ts`) — guests can upload and browse photos right away. No
approval step: a photo appears the instant it's uploaded.

If you'd rather guests only see a "coming soon" message until after the
party, open `src/lib/config.ts` and change:
```ts
eventPhase: "after" as EventPhase,
```
to:
```ts
eventPhase: "before" as EventPhase,
```
Then, once the party's over, flip it back to `"after"` (save, redeploy or
restart) to reopen it. Either way, once it's open it stays open permanently
— it won't close itself.

To manage photos — deleting anything inappropriate or low-quality — use the
**Uploaded photos** section of `/admin/dashboard`.

---

## 12. Keeping it out of search engines

This is already handled for you, on every single page:
- `robots.txt` disallows all crawling.
- Every response includes an `X-Robots-Tag: noindex, nofollow, noarchive` header.
- Every page's metadata also sets `noindex`.

You don't need to do anything else — just remember that "not indexed" is
different from "not accessible": **anyone with the link can open it.** Only
post it inside your trusted group chat, not anywhere public.

---

## 13. Deploying the website

The simplest option is **[Vercel](https://vercel.com)** (made by the creators
of Next.js, free tier is enough for this):

1. Push this project to a private GitHub repository.
2. Go to vercel.com → **Add New Project** → import that repository.
3. In the project's **Environment Variables** settings, add:
   - `ADMIN_PASSWORD` = your real password
   - `SESSION_SECRET` = your real random secret
4. Deploy. Vercel gives you a URL like `https://your-project.vercel.app`.
5. That URL is the one link you post to your group chat.

### ⚠️ Important: photo storage on Vercel/serverless hosts
This project stores uploaded photos on the local filesystem
(`/public/uploads`) and RSVPs as JSON files (`/data`), which works
perfectly for local hosting or a traditional always-on server (a VPS,
Render, Railway, a home server, etc.).

**Serverless platforms like Vercel do NOT persist filesystem writes** —
uploaded photos and new RSVPs could disappear between requests/deploys. If
you deploy there, swap:
- Photo storage (`src/lib/photos.ts`) for **Vercel Blob**, **Cloudinary**,
  **AWS S3**, or **Supabase Storage**.
- RSVP storage (`src/lib/db.ts`) for a small hosted database like
  **Supabase** or **Vercel Postgres**.

If this sounds like more than you want to handle, the simplest path is a
small always-on server (a $5–6/month VPS, or a platform like **Railway** or
**Render**) where the filesystem persists — no code changes needed there.

### Never commit real secrets
`.env.local` is already excluded via `.gitignore`. Only put secrets in your
hosting provider's environment variable settings, never directly in code.

---

## 14. Pre-launch checklist

```
□ Replace date, time, venue, address (config.ts)
□ Set real map coordinates (config.ts)
□ Add hero photograph (public/images/ + config.ts)
□ Add dress-code reference image, if any (public/images/ + config.ts)
□ Add any other photographs you want to use
□ Set your real dress code text
□ Set your real "What to Bring" list
□ Adjust colors/fonts to your taste (globals.css / layout.tsx), or keep the
  default vintage cream & mocha theme
□ Double-check `expectedGuests` in config.ts matches your real group
□ Test the full flow yourself: name entry, RSVP yes/no, edit, "not you"
  reset, admin login, checklist, CSV export, manual status correction,
  deleting a test entry (see §9 for the full walkthrough)
□ Confirm eventPhase matches what you want guests to see (default is "after"
  — gallery already open; set to "before" if you'd rather wait)
□ Test on a real phone (not just desktop browser resize)
□ Set ADMIN_PASSWORD and SESSION_SECRET as real, private values
□ Deploy the site
□ Test the deployed (live) version end-to-end before sending it out
□ Delete any test RSVP entries and test photos from the live admin dashboard
□ Send the ONE link to your group chat
□ Test photo upload + gallery on the live site
```

---

## 15. Security notes

- Admin password and session secret are read from environment variables only
  — never hardcoded, never sent to the browser.
- The admin session cookie is signed (HMAC) and `httpOnly`, so it can't be
  read or forged from client-side JavaScript.
- Uploaded files are validated by their actual file content (not just their
  extension), size-limited, and re-encoded through an image-processing
  library — a renamed executable or corrupted file is rejected, not stored.
- Because this uses one shared link with self-typed names rather than
  unique per-guest tokens, **anyone with the link can RSVP under any name**.
  This trade-off was made deliberately so you only have to send one link —
  keep the link inside your trusted group chat, and use the admin checklist
  to sanity-check names against your real guest list.
