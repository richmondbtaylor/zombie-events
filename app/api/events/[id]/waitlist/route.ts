import { NextResponse } from "next/server";
import { readDb, writeDb, newId } from "@/lib/db";
import type { Event, Rsvp, WaitlistEntry } from "@/lib/events";

// POST /api/events/:id/waitlist  body: { name, email }  only works when the event is full
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const b = await req.json().catch(() => null);
  if (!b?.name || !b?.email) return NextResponse.json({ error: "Name and email are required." }, { status: 400 });

  const db = await readDb();
  const event = (db.events as Event[]).find((e) => e.id === id);
  if (!event) return NextResponse.json({ error: "Event not found." }, { status: 404 });

  const going = (db.rsvps as Rsvp[]).filter((r) => r.eventId === id).length;
  if (going < event.capacity) {
    return NextResponse.json({ error: "There are still spots left. Please RSVP instead." }, { status: 409 });
  }
  const list = db.waitlist as WaitlistEntry[];
  if (list.some((w) => w.eventId === id && w.email.toLowerCase() === String(b.email).toLowerCase())) {
    return NextResponse.json({ error: "That email is already on the waitlist." }, { status: 409 });
  }

  const entry: WaitlistEntry = {
    id: newId() + Math.floor(Math.random() * 1000),
    eventId: id,
    name: String(b.name),
    email: String(b.email),
    joinedAt: new Date().toISOString(),
  };
  list.push(entry);
  await writeDb(db);
  return NextResponse.json(
    { entry, note: "You are on the waitlist. Emails are not built yet, so we cannot tell you if a spot opens, see ZOMBIE.md." },
    { status: 201 },
  );
}
