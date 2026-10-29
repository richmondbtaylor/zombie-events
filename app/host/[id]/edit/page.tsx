"use client";
import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DEFAULT_COLOR, type Event } from "@/lib/events";
import EventForm, { type EventFields } from "@/components/EventForm";

export default function EditEvent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [event, setEvent] = useState<Event | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/events/${id}`).then(async (r) => {
      if (r.ok) setEvent((await r.json()).event);
      else setError("Event not found.");
    });
  }, [id]);

  async function save(fields: EventFields) {
    const res = await fetch(`/api/events/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(fields),
    });
    const data = await res.json();
    if (!res.ok) return data.error ?? "Could not save.";
    router.push(`/host/${id}?saved=${encodeURIComponent(data.note)}`);
    return null;
  }

  if (error) return <p className="error">{error}</p>;
  if (!event) return <p className="muted">Loading...</p>;

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Edit event</h1>
          <p className="sub"><Link href={`/host/${id}`}>Back to dashboard</Link></p>
        </div>
      </div>
      <EventForm
        submitLabel="Save changes"
        onSubmit={save}
        initial={{
          title: event.title, startsAt: event.startsAt, location: event.location, description: event.description,
          capacity: String(event.capacity), price: String(event.price), color: event.color ?? DEFAULT_COLOR,
        }}
      />
    </>
  );
}
