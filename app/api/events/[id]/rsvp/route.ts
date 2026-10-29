import { NextResponse } from "next/server";
import { readDb, writeDb, newId } from "@/lib/db";
import type { Event, Rsvp } from "@/lib/events";

// POST /api/events/:id/rsvp  body: { name, email }
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const b = await req.json().catch(() => null);
  if (!b?.name || !b?.email) {
    return NextResponse.json({ error: "Name and email are required." }, { status: 400 });
  }

  const db = await readDb();
  const event = (db.events as Event[]).find((e) => e.id === id);
  if (!event) return NextResponse.json({ error: "Event not found." }, { status: 404 });

  // ZOMBIE: capacity is shown but not enforced. RSVPs go past event.capacity.
  // To do: count the guests and return 409 "sold out" (or a waitlist) when full.

  // ZOMBIE: no duplicate check. The same email can RSVP many times.
  // To do: reject an email that already has an RSVP for this event.

  // ZOMBIE: paid events skip payment. Anyone gets in free. Stripe is not wired.
  // To do: for event.price > 0, create a Stripe Checkout Session and only save
  // the RSVP after the webhook confirms payment.

  const rsvp: Rsvp = {
    id: newId() + Math.floor(Math.random() * 1000),
    eventId: id,
    name: String(b.name),
    email: String(b.email),
    checkedIn: false,
  };
  (db.rsvps as Rsvp[]).push(rsvp);
  await writeDb(db);

  // ZOMBIE: no confirmation email, no calendar invite, no ticket QR code.
  // Not built yet, see ZOMBIE.md.
  return NextResponse.json(
    { rsvp, note: "You are on the list. Confirmation email and calendar invite are not built yet, see ZOMBIE.md." },
    { status: 201 },
  );
}
