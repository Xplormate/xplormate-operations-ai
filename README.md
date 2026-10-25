# Xplormate

The company website for [xplormate.com](https://xplormate.com), focused on AI transformation for manufacturing operations.

The site explains how Xplormate approaches recurring workflows across production, quality, maintenance, and materials: start with one workflow, apply AI to routine coordination, keep people in control, and measure the result. Visitors can explore example scenarios and enquire about a focused paid pilot.

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

If `NEXT_PUBLIC_SITE_URL` is unset, metadata uses `VERCEL_URL` when available, then `http://localhost:3000`. Set the local URL explicitly when checking metadata on port 5173.

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

The endpoint returns `201` after saving, `400` for invalid JSON, `422` for validation errors, and `503` when storage is unavailable. If the optional column is missing, it retries with the core fields so the enquiry can still be saved.

The current endpoint stores enquiries in Supabase; it does not send email notifications. Successful submissions trigger the `lead_submitted` analytics event without attaching the enquiry fields.

For local submission tests, use a separate test database or local test storage. For an authorised production test, clearly mark the entry and verify the saved fields directly in Supabase.

## Website sections

| Section | Main component |
| --- | --- |
| Hero scenes and sample operational readouts | `HeroSequence.tsx` |
| Introductory glow card | `page.tsx` |
| Scroll-highlighted statement | `PinnedStatement.tsx` |
| How we work and example tools | `page.tsx`, `ToolConveyor.tsx` |
| Five-step example operating loop | `OperatingLoop.tsx` |
| Six plant-area scenarios | `AreaCarousel.tsx` |
| Paid-pilot approach | `PilotStack.tsx` |
| FAQ, enquiry form, navigation, and footer | `page.tsx` |

The hero and tools carousel have pause controls. Dot fields and the tools conveyor pause off screen. Reduced-motion styles simplify animation and use still hero posters. On phones, the operating loop displays all steps without pinning, and the hero loads smaller video files; the statement retains its pinned layout.

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
├── tool-logos/               Illustrative third-party tool logos
└── ...                       Brand and supporting images
supabase/
└── migrations/               Lead-table schema changes
```

### Editing content and design

- **Homepage copy and examples:** edit `heroSlides`, `areas`, `stages`, `toolGroups`, `pilotSteps`, and `faq` in `app/page.tsx`.
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

Keep those variants together when replacing media and update `heroSlides` or `areas` if a path changes. Record the source and licence for any new third-party assets.

### Example labels and claims

Keep example operational data distinguishable from customer evidence:

- Hero readouts use **“Illustrative data”**.
- The operating loop uses **“Example workflow”**.
- Plant-area cards use **“Example scenarios”**.
- The tools section explains that the logos are examples, not partners or customers; avoid a second disclaimer beneath the carousel.

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
