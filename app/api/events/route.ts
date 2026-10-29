import { NextResponse } from "next/server";
import { readDb, writeDb, newId } from "@/lib/db";
import { COLORS, DEFAULT_COLOR, type Event, type Rsvp, type WaitlistEntry } from "@/lib/events";

// GET /api/events  list of events with RSVP counts
export async function GET() {
  const db = await readDb();
  const rsvps = db.rsvps as Rsvp[];
  const events = (db.events as Event[]).map((e) => ({
    ...e,
    going: rsvps.filter((r) => r.eventId === e.id).length,
    waitlist: (db.waitlist as WaitlistEntry[]).filter((w) => w.eventId === e.id).length,
  }));
  return NextResponse.json({ events });
}

// POST /api/events  creates an event
export async function POST(req: Request) {
  const b = await req.json().catch(() => null);
  if (!b?.title || !b?.startsAt) {
    return NextResponse.json({ error: "Title and date/time are required." }, { status: 400 });
  }
  // ZOMBIE: no host login. Anyone can create events, and nothing records who the host is.
  const event: Event = {
    id: newId(),
    title: String(b.title),
    startsAt: String(b.startsAt),
    location: String(b.location ?? ""),
    description: String(b.description ?? ""),
    capacity: Number(b.capacity) || 50,
    price: Math.max(0, Number(b.price) || 0),
    color: COLORS.some((c) => c.value === b.color) ? String(b.color) : DEFAULT_COLOR,
  };
  const db = await readDb();
  (db.events as Event[]).push(event);
  await writeDb(db);
  return NextResponse.json({ event }, { status: 201 });
}
