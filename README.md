# Xplormate

The company website for [xplormate.com](https://xplormate.com), focused on AI agents for manufacturing operations.

The site explains where Xplormate’s AI agents fit in manufacturing operations (materials, quality, maintenance, production and reporting): start with one workflow, keep people in control and measure the result against the plant’s own records. Visitors can follow a sample-data example and request a call about a small paid pilot.

**Stack:** Next.js 16 · React 19 · TypeScript · Supabase · Vercel

## Quick start

Requires **Node.js 22.13.0 or newer** and npm.

```bash
npm ci
npm run dev
```

Open [localhost:5173](http://localhost:5173). Pages render without database credentials; saving enquiries requires the Supabase setup below.

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the development server on port 5173 |
| `npm run lint` | Run ESLint |
| `npm run build` | Build for production and check TypeScript |
| `npm start -- --port 5173` | Serve the production build locally after building |

The build uses Google fonts through `next/font`; a fresh build may need network access to download them.

## Configuration

Create `.env.local` in the project root. Set the same variables in the appropriate Vercel environment when deploying.

```dotenv
NEXT_PUBLIC_SITE_URL=http://localhost:5173
SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
SUPABASE_SECRET_KEY=YOUR_SERVER_ONLY_KEY
```

| Variable | Required | Purpose |
| --- | --- | --- |
| `SUPABASE_URL` | For saving enquiries | Supabase project URL |
| `SUPABASE_SECRET_KEY` | For saving enquiries | Server-only Supabase key with access to insert leads |
| `NEXT_PUBLIC_SITE_URL` | Set for production | Canonical origin and social metadata; use `https://xplormate.com` in production |
| `NEXT_PUBLIC_LINKEDIN_PARTNER_ID` | No | Enable the LinkedIn Insight Tag |
| `NEXT_PUBLIC_CLARITY_ID` | No | Enable Microsoft Clarity |

The lead endpoint also accepts `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` as fallbacks. Keep server keys out of browser code and never give them a `NEXT_PUBLIC_` prefix. Local environment files are ignored by Git.

If `NEXT_PUBLIC_SITE_URL` is unset, metadata uses `VERCEL_PROJECT_PRODUCTION_URL`, then `VERCEL_URL`, when available, then `http://localhost:3000`. Set the local URL explicitly when checking metadata on port 5173.

Vercel Analytics is included in the app layout. The optional LinkedIn and Clarity tags load only when their IDs are configured.

## Enquiries and database setup

Apply these SQL migrations to the target Supabase database in order:

1. [`20260910110000_create_leads.sql`](supabase/migrations/20260910110000_create_leads.sql) creates `public.leads` and enables row-level security.
2. [`20260925120000_add_lead_challenge.sql`](supabase/migrations/20260925120000_add_lead_challenge.sql) adds the optional workflow description.

The form sends JSON to `POST /api/leads`. The server trims and validates the fields with Zod, then inserts a record with `source: "website"`.

| Field | Required | Validation |
| --- | --- | --- |
| `name` | Yes | 2–120 characters |
| `email` | Yes | Valid email address, up to 254 characters |
| `company` | Yes | 2–160 characters |
| `role` | Yes | 2–120 characters |
| `challenge` | No | Up to 2,000 characters |
| `hp_extra` | No | Hidden spam trap; must stay empty |
| `elapsed` | No | Milliseconds the form was open; under 1.5 s is treated as a bot |

Submissions that fill the hidden field or arrive too fast get a normal `201` reply but are not stored; each one is logged as "Lead dropped as bot" with the reason only. The endpoint returns `201` after saving, `400` for invalid JSON, `422` for validation errors, and `503` when storage is unavailable. If the optional column is missing, it retries with the core fields so the enquiry can still be saved.

The current endpoint stores enquiries in Supabase; it does not send email notifications. Successful submissions trigger the `lead_submitted` analytics event without attaching the enquiry fields. Button clicks send `cta_click` (`location`: `header`, `hero` or `phone_bar`) and `example_click` (`location`: `hero`) through `track()` from `@vercel/analytics`.

For local submission tests, use a separate test database or local test storage. For an authorised production test, clearly mark the entry and verify the saved fields directly in Supabase.

## Website sections

In page order:

| Section | Main component |
| --- | --- |
| Hero: four plant scenes on a loop (about 7 s each); each adds one entry to a sample-data agent card, marks the spot on the clip and draws a dotted line to that entry; a rotating word ends the sentence | `HeroStory.tsx` (timing, marker, line, phone line), `HeroSequence.tsx` (clips, scene buttons, pause), `AgentPanel.tsx` (card), `RotatingWord.tsx` |
| Problem line | `page.tsx` |
| 01 Example: a material shortage, step by step (sample data) | `OperatingLoop.tsx` |
| 02 Where agents help: four example areas | `AreaCarousel.tsx` |
| 03 Your systems and control: example systems by category, timed tabs, three control points | `ToolConveyor.tsx`, `page.tsx` |
| 04 How a pilot runs: 1 week Prototype / 3 weeks First workflow / 3 months Full system | `page.tsx` |
| 05 FAQ, 06 contact form, navigation and footer | `page.tsx` |
| Phones only: a “Book a 30-minute call” bar after the hero, hidden from the contact form down | `StickyCta.tsx` |

Calls to action: “Book a call” in the header (desktop only) and “Book a 30-minute call” in the hero and phone bar are the primary buttons; “See an example” is the only secondary one; the form submits with “Request a call”.

The hero and systems tabs have pause controls. The hero plays its four scenes in a loop, ending each round on the entry that needs approval and then starting again; a scene button jumps to that scene and plays on from there. The hero, the rotating word and the systems tabs stop while off screen. Reduced-motion settings stop every animation and show the final scene. Up to 1080px the agent card, marker and line are hidden; on phones the header button is hidden too, a one-line summary of the current scene (marked "Sample") sits over the clip, the example shows all steps without pinning, and the hero loads smaller video files.

## Project structure

```text
app/
├── page.tsx                  Homepage content and layout
├── layout.tsx                Fonts, metadata, and analytics
├── globals.css               Design tokens and responsive styles
├── components/               Interactive sections and scroll helpers
├── api/leads/route.ts        Enquiry validation and storage
├── privacy/page.tsx          Privacy policy
├── terms/page.tsx            Terms of service
├── trackers.tsx              Optional visitor-insight tags
├── opengraph-image.tsx       Open Graph preview image
└── twitter-image.tsx         Twitter/X preview image
public/
├── media/                    Hero videos, posters, and area photos
├── tool-logos/               Example system logos for the systems section
└── ...                       Brand and supporting images
supabase/
└── migrations/               Lead-table schema changes
```

### Editing content and design

- **Homepage copy and examples:** edit `heroScenes`, `agentRun`, `agents`, `systemGroups`, `controls`, `pilotPath` and `faq` in `app/page.tsx`. Each hero scene holds its clip, its card entry (`entry`), the marker spot (`focus`, x/y fractions of the 1280x720 clip), the readout and the phone line (`short`). Update the hero’s screen-reader summary (the hidden paragraph in `HeroStory.tsx`) when the entries change.
- **Contact details:** edit `businessEmail` and `linkedinProfile` in `app/page.tsx`; check the legal pages for corresponding details.
- **Colours, spacing, and responsive layout:** edit `app/globals.css`.
- **Fonts and site metadata:** edit `app/layout.tsx`. Fonts are Geist, Geist Mono, and Instrument Serif.
- **Interaction behaviour:** edit the relevant component in `app/components/`.

### Media conventions

Hero media lives in `public/media/`. Each video scene uses a desktop clip, a smaller phone variant, and a still poster:

| Pattern | Purpose |
| --- | --- |
| `hero-<scene>.mp4` | Desktop video |
| `hero-<scene>-m.mp4` | Phone video, selected on initial load at widths up to 760px |
| `hero-<scene>.webp` | Video poster and reduced-motion still |
| `area-<area>.webp` | Plant-area carousel photo |

Keep those variants together when replacing media and update `heroScenes` or `agents` if a path changes. Hero clips must stay 1280x720 (or change `MEDIA_W`/`MEDIA_H` in `HeroStory.tsx`) so the markers line up. Record the source and licence for any new third-party assets.

### Example labels and claims

Keep example operational data distinguishable from customer evidence:

- The hero card carries the hero’s **“Sample data”** label, and the phone summary line is marked **“Sample”**. Scene readouts are sample data too: keep them plausible and never present them as a live plant.
- The example agent run is labelled **“Sample data”**.
- The agents carousel uses **“Example areas”**; describe what an agent *would* do, not live deployments.
- The systems section shows example systems by category (logos where we have them, two-letter badges otherwise) under the label “Example systems”; they are examples, not partners or customers

Do not present sample counts, outcomes, tool logos, or factory imagery as verified customer results, integrations, partnerships, or Xplormate facilities. Publish customer proof only when it can be substantiated.

## Deployment

The company repository is [Xplormate/xplormate-operations-ai](https://github.com/Xplormate/xplormate-operations-ai). Its `main` branch is connected to production on Vercel at [xplormate.com](https://xplormate.com).

Use Vercel’s detected Next.js settings, with `npm run build` as the build command and the default output configuration. Configure database credentials and the site URL for the intended environment. Preview deployments should use separate test storage if submissions need testing.

Before pushing a website change:

1. Run `npm run lint` and `npm run build`.
2. Check desktop and phone layouts, navigation, carousel controls, and keyboard access.
3. Check reduced-motion behaviour when changing animation.
4. Test enquiry validation and storage when changing the form or API.
5. After deployment, confirm the deployed commit and the affected live pages.
