import { NextResponse } from "next/server";
import { readDb, writeDb } from "@/lib/db";
import type { Rsvp } from "@/lib/events";

// PATCH /api/guests/:id  body: { checkedIn: true | false }
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { checkedIn } = await req.json().catch(() => ({ checkedIn: undefined }));
  if (typeof checkedIn !== "boolean") return NextResponse.json({ error: "checkedIn must be true or false." }, { status: 400 });

  // ZOMBIE: anyone can check anyone in. Check-in needs a host login (and ideally a QR scan).
  const db = await readDb();
  const guest = (db.rsvps as Rsvp[]).find((r) => r.id === id);
  if (!guest) return NextResponse.json({ error: "Guest not found." }, { status: 404 });
  guest.checkedIn = checkedIn;
  await writeDb(db);
  return NextResponse.json({ guest });
}

// DELETE /api/guests/:id  cancels one RSVP (the host removes the guest)
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = await readDb();
  const all = db.rsvps as Rsvp[];
  const index = all.findIndex((r) => r.id === id);
  if (index < 0) return NextResponse.json({ error: "Guest not found." }, { status: 404 });
  all.splice(index, 1);
  await writeDb(db);

  // ZOMBIE: the waitlist never moves up. A spot just opened, but the first person on the
  // waitlist is not given it and is not told. To do: take the oldest waitlist entry for
  // this event, turn it into an RSVP, and send them an email.
  return NextResponse.json({ note: "RSVP removed. The waitlist did not move up, see ZOMBIE.md." });
}
