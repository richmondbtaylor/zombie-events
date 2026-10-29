"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { dateParts, DEFAULT_COLOR, isPast, priceLabel, type Event } from "@/lib/events";

type EventRow = Event & { going: number; waitlist: number };

function EventCard({ e, past }: { e: EventRow; past?: boolean }) {
  const d = dateParts(e.startsAt);
  const full = e.going >= e.capacity;
  const percent = Math.min(100, Math.round((e.going / e.capacity) * 100));
  const fillClass = e.going > e.capacity ? "over" : percent >= 80 ? "near" : "";
  return (
    <div className={`card event-card${past ? " past" : ""}`}>
      <div className="band" style={{ background: e.color ?? DEFAULT_COLOR }} />
      <div className="body">
        <div className="row">
          <span className="date-badge"><span className="m">{d.month}</span><span className="d">{d.day}</span></span>
          <div>
            <strong>{e.title}</strong>
            <div className="muted small-text">{d.time} · {e.location}</div>
          </div>
        </div>
        <div>
          <div className="cap-label"><span>{e.going} / {e.capacity} going</span><span>{percent}%</span></div>
          <div className="bar-track"><div className={`bar-fill ${fillClass}`} style={{ width: `${percent}%` }} /></div>
        </div>
        <div className="row">
          <span className="pill">{priceLabel(e.price)}</span>
          {full && !past && <span className="pill warn">Full</span>}
          {e.waitlist > 0 && <span className="pill">{e.waitlist} on waitlist</span>}
        </div>
        <div className="row">
          <Link href={`/e/${e.id}`}>Public page</Link>
          <Link href={`/host/${e.id}`}>Host dashboard</Link>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [events, setEvents] = useState<EventRow[] | null>(null);

  useEffect(() => {
    fetch("/api/events").then((r) => r.json()).then((d) => setEvents(d.events));
  }, []);

  if (!events) return <p className="muted">Loading...</p>;

  const byDate = [...events].sort((a, b) => a.startsAt.localeCompare(b.startsAt));
  const upcoming = byDate.filter((e) => !isPast(e.startsAt));
  const past = byDate.filter((e) => isPast(e.startsAt)).reverse();
  const going = upcoming.reduce((sum, e) => sum + e.going, 0);
  const waiting = upcoming.reduce((sum, e) => sum + e.waitlist, 0);

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Events</h1>
          <p className="sub">Create an event, share the page, check guests in.</p>
        </div>
        <Link href="/new" className="btn">Create an event</Link>
      </div>

      <div className="stats">
        <div className="stat"><div className="label">Upcoming events</div><div className="value">{upcoming.length}</div></div>
        <div className="stat"><div className="label">People going</div><div className="value">{going}</div></div>
        <div className="stat"><div className="label">On waitlists</div><div className="value">{waiting}</div></div>
        <div className="stat"><div className="label">Past events</div><div className="value">{past.length}</div></div>
      </div>

      <h2>Upcoming</h2>
      {upcoming.length === 0 ? (
        <div className="empty">No upcoming events. <Link href="/new">Create your first one</Link>.</div>
      ) : (
        <div className="grid">{upcoming.map((e) => <EventCard key={e.id} e={e} />)}</div>
      )}

      <h2>Past events</h2>
      {past.length === 0 ? (
        <div className="empty">Nothing here yet. Events move here after they start.</div>
      ) : (
        <div className="grid">{past.map((e) => <EventCard key={e.id} e={e} past />)}</div>
      )}
    </>
  );
}
