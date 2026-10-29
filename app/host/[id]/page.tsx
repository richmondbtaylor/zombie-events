"use client";
import { use, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { formatWhen, priceLabel, type Event, type Rsvp, type WaitlistEntry } from "@/lib/events";

type Data = {
  event: Event;
  guests: Rsvp[];
  waitlist: WaitlistEntry[];
  counts: { going: number; checkedIn: number; spotsLeft: number; waitlist: number };
};

// ZOMBIE: no host login. Anyone who knows (or guesses) the id can open this page.
export default function HostDashboard({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [data, setData] = useState<Data | null>(null);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");

  const load = useCallback(async () => {
    const r = await fetch(`/api/events/${id}`);
    if (r.ok) setData(await r.json());
    else setError("Event not found.");
  }, [id]);

  useEffect(() => {
    load();
    const saved = new URLSearchParams(window.location.search).get("saved");
    if (saved) setMessage(saved);
  }, [load]);

  async function call(url: string, method: string) {
    const res = await fetch(url, { method });
    setMessage((await res.json()).error ?? "Done.");
    load();
  }

  async function removeGuest(guestId: string) {
    const res = await fetch(`/api/guests/${guestId}`, { method: "DELETE" });
    setMessage((await res.json()).note ?? "Could not remove.");
    load();
  }

  async function exportCsv() {
    const res = await fetch(`/api/events/${id}/export`);
    setMessage((await res.json()).error ?? "Downloaded.");
  }

  if (error) return <p className="error">{error}</p>;
  if (!data) return <p className="muted">Loading...</p>;
  const { event, guests, waitlist, counts } = data;
  const q = search.trim().toLowerCase();
  const shown = guests.filter((g) => !q || g.name.toLowerCase().includes(q) || g.email.toLowerCase().includes(q));

  return (
    <>
      <div className="page-head">
        <div>
          <h1>{event.title}</h1>
          <p className="sub">{formatWhen(event.startsAt)} · {event.location} · {priceLabel(event.price)}</p>
        </div>
        <div className="row">
          <Link href={`/host/${id}/edit`} className="btn ghost">Edit event</Link>
          <Link href={`/e/${id}`} className="btn ghost">Public page</Link>
          <Link href={`/host/${id}/checkin`} className="btn">Open check-in</Link>
        </div>
      </div>
      {message && <p className="card notice" role="status">{message}</p>}

      <div className="stats">
        <div className="stat"><div className="label">Going</div><div className="value">{counts.going}</div></div>
        <div className="stat"><div className="label">Capacity</div><div className="value">{event.capacity}</div></div>
        <div className="stat"><div className="label">Checked in</div><div className="value">{counts.checkedIn}</div></div>
        <div className="stat"><div className="label">Spots left</div><div className="value">{counts.spotsLeft}</div></div>
        <div className="stat"><div className="label">Waitlist</div><div className="value">{counts.waitlist}</div></div>
      </div>

      <div className="page-head" style={{ marginTop: 28, marginBottom: 10 }}>
        <h2 style={{ margin: 0 }}>Guest list</h2>
        <button className="ghost" onClick={exportCsv}>Export CSV</button>
      </div>
      <input placeholder="Search guests by name or email" aria-label="Search guests" value={search}
        onChange={(e) => setSearch(e.target.value)} style={{ marginBottom: 12, maxWidth: 360 }} />
      {shown.length === 0 ? (
        <div className="empty">{guests.length === 0 ? "No guests yet. Share the public page to get RSVPs." : "No guests match your search."}</div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead><tr><th>Name</th><th>Email</th><th>Checked in</th><th></th></tr></thead>
            <tbody>
              {shown.map((g) => (
                <tr key={g.id}>
                  <td>{g.name}</td><td>{g.email}</td><td>{g.checkedIn ? "Yes" : "No"}</td>
                  <td><button className="danger small" onClick={() => removeGuest(g.id)}>Cancel RSVP</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <h2>Waitlist</h2>
      {waitlist.length === 0 ? (
        <div className="empty">Nobody is waiting. People can join when the event is full.</div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead><tr><th>#</th><th>Name</th><th>Email</th><th>Joined</th><th></th></tr></thead>
            <tbody>
              {waitlist.map((w, i) => (
                <tr key={w.id}>
                  <td>{i + 1}</td><td>{w.name}</td><td>{w.email}</td><td>{w.joinedAt.slice(0, 10)}</td>
                  <td><button className="danger small" onClick={() => call(`/api/waitlist/${w.id}`, "DELETE")}>Remove</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
