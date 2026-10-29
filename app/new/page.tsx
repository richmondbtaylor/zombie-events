"use client";
import { useRouter } from "next/navigation";
import EventForm, { BLANK_EVENT, type EventFields } from "@/components/EventForm";

export default function NewEvent() {
  const router = useRouter();

  async function create(fields: EventFields) {
    const res = await fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(fields),
    });
    const data = await res.json();
    if (res.ok) { router.push(`/host/${data.event.id}`); return null; }
    return data.error ?? "Could not create the event.";
  }

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Create an event</h1>
          <p className="sub">Fill this in and you get a public page to share.</p>
        </div>
      </div>
      <EventForm initial={BLANK_EVENT} submitLabel="Create event" onSubmit={create} />
    </>
  );
}
