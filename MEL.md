# MEL.md

This is a hackathon project: a half-built copy of Luma and Eventbrite (event pages, RSVPs and check-in) that we are turning into a real SaaS product the whole group can use.

## The stack

- Next.js (App Router) + TypeScript + React. Plain CSS in `app/globals.css`, no Tailwind.
- Data: `lib/db.ts` reads and writes `data/db.json`. `data/seed.json` is the starting data (fake events in Miami, fake guests). This is temporary.
- Pages: `/` (upcoming and past events), `/new`, `/e/[id]` (public page, RSVP and waitlist), `/host/[id]` (dashboard with guest search and waitlist), `/host/[id]/edit`, `/host/[id]/checkin`.
- Routes: `app/api/events` (list, create), `app/api/events/[id]` (get, edit), `.../rsvp`, `.../waitlist`, `.../export` (stub), `app/api/guests/[id]` (check-in, cancel), `app/api/waitlist/[id]` (remove).
- `components/EventForm.tsx` is the form used by Create and Edit. `lib/events.ts` has the types, the color list and date helpers.
- Waitlist people live in the `waitlist` list in the data file, separate from `rsvps`.
- Payments: `app/api/checkout/route.ts` is a stub. Stripe is not connected.
- Runs on port 3104.

## The job

Work through `ZOMBIE.md` in order: make it work, make it secure, make it compliant, connect Stripe, ship it.
Every planted problem in the code is marked with a `ZOMBIE:` comment.

## Rules for agents

- Keep it running. Run `npm run build` after each change and fix what breaks.
- Never commit secrets. Keys go in `.env.local` (it is git-ignored).
- Use Stripe test mode keys only.
- Never show guest emails to the public.
- When you fix a `ZOMBIE:` item, delete its comment and tick its box in `ZOMBIE.md`.
- Small commits with plain messages.
