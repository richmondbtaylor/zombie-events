import { NextResponse } from "next/server";
import { readDb, writeDb } from "@/lib/db";
import { COLORS, type Event, type Rsvp, type WaitlistEntry } from "@/lib/events";

// GET /api/events/:id  the event, its guests, its waitlist and the counts.
// Both the public page and the host dashboard use this route.
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = await readDb();
  const event = (db.events as Event[]).find((e) => e.id === id);
  if (!event) return NextResponse.json({ error: "Event not found." }, { status: 404 });

  // ZOMBIE: no host login. Anyone with the id gets the full guest list here.
  // Also a privacy bug: the public page shows every guest's email. Strip emails
  // for the public and only return them to the signed-in host.
  const guests = (db.rsvps as Rsvp[]).filter((r) => r.eventId === id);
  const waitlist = (db.waitlist as WaitlistEntry[]).filter((w) => w.eventId === id);
  const counts = {
    going: guests.length,
    checkedIn: guests.filter((g) => g.checkedIn).length,
    spotsLeft: event.capacity - guests.length,
    waitlist: waitlist.length,
  };
  return NextResponse.json({ event, guests, waitlist, counts });
}

// PATCH /api/events/:id  body: any of { title, startsAt, location, description, capacity, price, color }
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const b = await req.json().catch(() => null);
  if (!b) return NextResponse.json({ error: "Send the fields you want to change." }, { status: 400 });

  const db = await readDb();
  const event = (db.events as Event[]).find((e) => e.id === id);
  if (!event) return NextResponse.json({ error: "Event not found." }, { status: 404 });

  // ZOMBIE: no host login. Anyone can edit any event.
  if (b.title !== undefined && !String(b.title).trim()) return NextResponse.json({ error: "Title cannot be empty." }, { status: 400 });
  if (b.startsAt !== undefined && !String(b.startsAt).trim()) return NextResponse.json({ error: "Date and time cannot be empty." }, { status: 400 });

  const oldDate = event.startsAt;
  if (b.title !== undefined) event.title = String(b.title).trim();
  if (b.startsAt !== undefined) event.startsAt = String(b.startsAt);
  if (b.location !== undefined) event.location = String(b.location);
  if (b.description !== undefined) event.description = String(b.description);
  if (b.capacity !== undefined) event.capacity = Number(b.capacity) || event.capacity;
  if (b.price !== undefined) event.price = Math.max(0, Number(b.price) || 0);
  if (COLORS.some((c) => c.value === b.color)) event.color = String(b.color);
  await writeDb(db);

  // ZOMBIE: editing the date does not tell anyone. Guests and the waitlist keep the old
  // date in their heads. To do: email everyone on the list when startsAt changes.
  const note = event.startsAt !== oldDate
    ? "Saved. The date changed, but nobody was told. Emails are not built yet, see ZOMBIE.md."
    : "Saved.";
  return NextResponse.json({ event, note });
}
