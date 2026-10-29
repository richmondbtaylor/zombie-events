"use client";
import { useState } from "react";
import { COLORS, DEFAULT_COLOR } from "@/lib/events";

export type EventFields = {
  title: string; startsAt: string; location: string; description: string;
  capacity: string; price: string; color: string;
};

export const BLANK_EVENT: EventFields = {
  title: "", startsAt: "", location: "", description: "", capacity: "50", price: "0", color: DEFAULT_COLOR,
};

// The form used by both "Create an event" and "Edit event".
export default function EventForm({ initial, submitLabel, onSubmit }: {
  initial: EventFields;
  submitLabel: string;
  onSubmit: (fields: EventFields) => Promise<string | null>; // returns an error message, or null when it worked
}) {
  const [form, setForm] = useState(initial);
  const [error, setError] = useState("");
  const set = (key: keyof EventFields, value: string) => setForm({ ...form, [key]: value });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const problem = await onSubmit(form);
    if (problem) setError(problem);
  }

  return (
    <form className="card stack form-narrow" onSubmit={submit}>
      <label>Title
        <input required value={form.title} onChange={(e) => set("title", e.target.value)} />
      </label>
      <label>Date and time
        <input type="datetime-local" required value={form.startsAt} onChange={(e) => set("startsAt", e.target.value)} />
      </label>
      <label>Location
        <input value={form.location} onChange={(e) => set("location", e.target.value)} />
      </label>
      <label>Description
        <textarea rows={3} value={form.description} onChange={(e) => set("description", e.target.value)} />
      </label>
      <label>Capacity
        <input type="number" min={1} value={form.capacity} onChange={(e) => set("capacity", e.target.value)} />
      </label>
      <label>Price in dollars (0 means free)
        <input type="number" min={0} value={form.price} onChange={(e) => set("price", e.target.value)} />
      </label>
      <div className="stack">
        <span style={{ fontSize: 13, color: "var(--muted)" }}>Page color</span>
        <div className="swatches">
          {COLORS.map((c) => (
            <button type="button" key={c.value} title={c.name} aria-label={c.name}
              className={`swatch${form.color === c.value ? " on" : ""}`}
              style={{ background: c.value }} onClick={() => set("color", c.value)} />
          ))}
        </div>
      </div>
      <div><button type="submit">{submitLabel}</button></div>
      {error && <p className="error">{error}</p>}
    </form>
  );
}
