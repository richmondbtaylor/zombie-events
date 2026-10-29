export type Event = {
  id: string;
  title: string;
  startsAt: string; // "2026-11-12T18:30", no timezone
  location: string;
  description: string;
  capacity: number;
  price: number; // 0 means free
  color?: string; // header color for the public page
};

export type Rsvp = {
  id: string;
  eventId: string;
  name: string;
  email: string;
  checkedIn: boolean;
};

// Someone who wants a spot but the event is full.
export type WaitlistEntry = {
  id: string;
  eventId: string;
  name: string;
  email: string;
  joinedAt: string;
};

// The colors a host can pick for an event.
export const COLORS = [
  { name: "Purple", value: "#4b36d9" },
  { name: "Teal", value: "#0e7c86" },
  { name: "Orange", value: "#c2410c" },
  { name: "Pink", value: "#be185d" },
  { name: "Green", value: "#15803d" },
  { name: "Blue", value: "#1d4ed8" },
];
export const DEFAULT_COLOR = COLORS[0].value;

// ZOMBIE: timezones are ignored. startsAt has no timezone, so a guest in New York
// sees the same clock time as Miami. Store UTC plus an IANA zone (America/New_York)
// and show the time in the viewer's zone.
export function formatWhen(startsAt: string): string {
  return startsAt.replace("T", " at ");
}

export function priceLabel(price: number): string {
  return price > 0 ? `$${price}` : "Free";
}

const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

// "2026-11-12T18:30" -> { month: "NOV", day: "12", time: "6:30 PM" }
export function dateParts(startsAt: string) {
  const [date, time = "00:00"] = startsAt.split("T");
  const [, m, d] = date.split("-");
  const [hh, mm] = time.split(":").map(Number);
  const hour12 = hh % 12 === 0 ? 12 : hh % 12;
  return {
    month: MONTHS[Number(m) - 1] ?? "",
    day: String(Number(d)),
    time: `${hour12}:${String(mm).padStart(2, "0")} ${hh >= 12 ? "PM" : "AM"}`,
  };
}

// True once the start time has passed.
export function isPast(startsAt: string): boolean {
  return new Date(startsAt).getTime() < Date.now();
}
