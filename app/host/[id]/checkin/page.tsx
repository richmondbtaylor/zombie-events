"use client";
import { use, useEffect, useState } from "react";
import Link from "next/link";
import type { Event, Rsvp } from "@/lib/events";

// ZOMBIE: no host login and no QR scan. Anyone with the link can check anyone in.
export default function CheckIn({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [event, setEvent] = useState<Event | null>(null);
  const [guests, setGuests] = useState<Rsvp[]>([]);
  const [search, setSearch] = useState("");

  async function load() {
    const res = await fetch(`/api/events/${id}`);
    if (!res.ok) return;
    const d = await res.json();
    setEvent(d.event);
    setGuests(d.guests);
  }
  useEffect(() => { load(); }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  async function mark(guestId: string, checkedIn: boolean) {
    await fetch(`/api/guests/${guestId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ checkedIn }),
    });
    load();
  }

  const shown = guests.filter((g) => (g.name + g.email).toLowerCase().includes(search.toLowerCase()));

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Check-in{event ? `: ${event.title}` : ""}</h1>
          <p className="sub"><Link href={`/host/${id}`}>Back to dashboard</Link> · {guests.filter((g) => g.checkedIn).length} of {guests.length} checked in</p>
        </div>
      </div>
      <input placeholder="Search by name or email" value={search} onChange={(e) => setSearch(e.target.value)} style={{ marginBottom: 12, maxWidth: 360 }} />
      {shown.length === 0 && <div className="empty">No guests found.</div>}
      <div className="stack">
        {shown.map((g) => (
          <div key={g.id} className="card row">
            <div style={{ marginRight: "auto", minWidth: 0 }}>
              <strong>{g.name}</strong> <span className="muted">{g.email}</span>
            </div>
            {g.checkedIn
              ? <button className="ghost" onClick={() => mark(g.id, false)}>Undo check-in</button>
              : <button onClick={() => mark(g.id, true)}>Check in</button>}
          </div>
        ))}
      </div>
    </>
  );
}
