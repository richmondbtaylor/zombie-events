# Zombie Events

> A half-built copy of **Luma and Eventbrite**. It runs, it kind of works, and it is not ready for real users.
> Your job tonight: bring it back to life.

**Replaces:** Luma (Luma Plus about $59/month, billed annually) and Eventbrite (fees per ticket: 3.7% + $1.79 per paid ticket, plus 2.9% payment processing) <!-- Sources: https://luma.com/pricing and https://www.eventbrite.com/organizer/pricing/ , checked 2026-10-29. Luma showed only the annual-billing price; no month-to-month price was listed. -->

**Live demo:** https://zombie-events.vercel.app (a shared demo: data resets whenever the server restarts)

## Run it (2 minutes)

You need [Node.js 20 or newer](https://nodejs.org).

```bash
npm install
npm run dev
```

Open http://localhost:3104.

## What works

- **Events home** (`/`): upcoming events as cards (date, title, place, a bar for going vs capacity, price, "Full" tag) and a past events section.
- Create an event: title, date and time, location, description, capacity, price and a page color.
- **Edit event** (`/host/<id>/edit`): change any of those fields.
- **Public event page** (`/e/<id>`): a colored header with date, time, place and spots left, the RSVP form (name and email) and a "who's going" list.
- **Waitlist:** when an event is full, the public page shows a "Join waitlist" form, and the host dashboard lists the waitlist with a Remove button.
- **Host dashboard** (`/host/<id>`): counts (going, capacity, checked in, spots left, waitlist), a guest list you can search by name or email, and a Cancel RSVP button.
- Export CSV button (shows "Not built yet").
- A check-in page at `/host/<id>/checkin` where the host marks guests as checked in.
- A pricing page (the Buy buttons do not work yet, see ZOMBIE.md).

## What's broken

See [ZOMBIE.md](ZOMBIE.md). That's the to-do list for the night.

## How we build tonight

- **Mel** ([openmel.dev](https://openmel.dev)) does the building. Open this folder in Mel and give it tasks from ZOMBIE.md.
- **Prompt Anything** ([promptanything.io](https://www.promptanything.io)) writes the prompts. Use it inside Mel for features, agents, customer success flows, code fixes and reading this repo.
- **MEL.md** in this folder tells Mel's agents what this project is and how to work on it.

## Submit

Fork this repo, push your work, and send your link through the submission form before the deadline.
Many people can pick the same app. The one that actually works wins.

## License

MIT. Use it, ship it, share it.
