import { NextResponse } from "next/server";

// ZOMBIE: guest list CSV export is not built. To do: read the guests for this event,
// build CSV text (name, email, checked in) and return it with the header
// "Content-Disposition: attachment".
export async function GET() {
  return NextResponse.json({ error: "Not built yet. CSV export is on the list in ZOMBIE.md." }, { status: 501 });
}
