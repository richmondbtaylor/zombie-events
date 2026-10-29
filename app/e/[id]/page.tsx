"use client";
import { use, useEffect, useState } from "react";
import { dateParts, DEFAULT_COLOR, priceLabel, type Event, type Rsvp } from "@/lib/events";

type Data = { event: Event; guests: Rsvp[]; counts: { going: number; spotsLeft: number; waitlist: number } };

// The public event page: details, RSVP form, waitlist (when full) and a "who's going" list.
export default function PublicEvent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [data, setData] = useState<Data | null>(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [waitMessage, setWaitMessage] = useState("");
  const [form, setForm] = useState({ name: "", email: "" });
  const [waitForm, setWaitForm] = useState({ name: "", email: "" });

  async function load() {
    const res = await fetch(`/api/events/${id}`);
    if (res.ok) setData(await res.json());
    else setError("Event not found.");
  }
  useEffect(() => { load(); }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  async function rsvp(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");
    const res = await fetch(`/api/events/${id}/rsvp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const d = await res.json();
    setMessage(res.ok ? d.note : d.error);
    if (res.ok) { setForm({ name: "", email: "" }); load(); }
  }

  async function joinWaitlist(e: React.FormEvent) {
    e.preventDefault();
    setWaitMessage("");
    const res = await fetch(`/api/events/${id}/waitlist`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(waitForm),
    });
    const d = await res.json();
    setWaitMessage(res.ok ? d.note : d.error);
    if (res.ok) { setWaitForm({ name: "", email: "" }); load(); }
  }

  if (error) return <p className="error">{error}</p>;
  if (!data) return <p className="muted">Loading...</p>;
  const { event, guests, counts } = data;
  const d = dateParts(event.startsAt);
  const full = counts.going >= event.capacity;

  return (
    <>
      <div className="hero" style={{ background: event.color ?? DEFAULT_COLOR }}>
        <h1>{event.title}</h1>
        <div className="hero-line">{d.month} {d.day} at {d.time}</div>
        <div className="hero-line">{event.location}</div>
        <div className="row">
          <span className="pill">{priceLabel(event.price)}</span>
          {/* ZOMBIE: capacity is only displayed. See the RSVP route, nothing stops RSVPs past it. */}
          <span className="pill">{counts.going} / {event.capacity} going</span>
          <span className={`pill ${full ? "warn" : ""}`}>{full ? "Full" : `${counts.spotsLeft} spots left`}</span>
        </div>
      </div>

      <div className="card stack" style={{ marginTop: 16 }}>
        <p style={{ margin: 0 }}>{event.description}</p>
        <div className="row">
          <button className="ghost" onClick={() => setMessage("Calendar invite is not built yet, see ZOMBIE.md.")}>
            Add to calendar
          </button>
        </div>
      </div>

      <h2>RSVP</h2>
      <form className="card stack" onSubmit={rsvp}>
        {event.price > 0 && <p className="muted" style={{ margin: 0 }}>This event costs {priceLabel(event.price)}. Payment is not built yet, see ZOMBIE.md.</p>}
        <label>Name
          <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </label>
        <label>Email
          <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </label>
        <div><button type="submit">RSVP</button></div>
        {message && <p role="status">{message}</p>}
      </form>

      {full && (
        <>
          <h2>This event is full</h2>
          <form className="card stack" onSubmit={joinWaitlist}>
            <p className="muted" style={{ margin: 0 }}>
              Join the waitlist and we will keep your place in line. {counts.waitlist} {counts.waitlist === 1 ? "person is" : "people are"} waiting.
            </p>
            <label>Name
              <input required value={waitForm.name} onChange={(e) => setWaitForm({ ...waitForm, name: e.target.value })} />
            </label>
            <label>Email
              <input type="email" required value={waitForm.email} onChange={(e) => setWaitForm({ ...waitForm, email: e.target.value })} />
            </label>
            <div><button type="submit" className="ghost">Join waitlist</button></div>
            {waitMessage && <p role="status">{waitMessage}</p>}
          </form>
        </>
      )}

      <h2>Who&apos;s going</h2>
      <div className="card">
        {guests.length === 0 && <span className="muted">Nobody yet. Be the first.</span>}
        <ul style={{ margin: 0, paddingLeft: 18 }}>
          {guests.map((g) => (
            // ZOMBIE: privacy bug. Every guest's email is shown to the whole public. Show first names only.
            <li key={g.id}>{g.name} <span className="muted">({g.email})</span></li>
          ))}
        </ul>
      </div>
      <p className="muted" style={{ fontSize: 13 }}>
        {/* ZOMBIE: no refund policy, no terms. Paid events need both before real money moves. */}
        Refund policy and terms: not written yet.
      </p>
    </>
  );
}
