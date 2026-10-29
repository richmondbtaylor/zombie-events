import { NextResponse } from "next/server";
import { readDb, writeDb } from "@/lib/db";
import type { WaitlistEntry } from "@/lib/events";

// DELETE /api/waitlist/:id  takes one person off the waitlist
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = await readDb();
  const list = db.waitlist as WaitlistEntry[];
  const index = list.findIndex((w) => w.id === id);
  if (index < 0) return NextResponse.json({ error: "Not on the waitlist." }, { status: 404 });
  list.splice(index, 1);
  await writeDb(db);
  return NextResponse.json({ note: "Removed from the waitlist." });
}
