# 🧟 ZOMBIE.md: what's broken

This app is a zombie on purpose. Pick items off this list. Every box you tick gets it closer to a product we can all use and stop paying for Luma and Eventbrite.

Search the code for `ZOMBIE:` to find every planted problem.

## 1. Make it work

- [ ] **Capacity is not enforced.** The page shows "3 / 3 going" and still accepts more RSVPs (`app/api/events/[id]/rsvp/route.ts`). The Join waitlist form exists, but normal RSVPs still go past capacity. Block them when full and send people to the waitlist.
- [ ] **Paid events skip payment.** The price shows, but RSVP just saves the guest. Take payment first.
- [ ] **The waitlist never moves up.** When a guest cancels, nobody on the waitlist gets the spot and nobody is told (`app/api/guests/[id]/route.ts`). Give the spot to the oldest waitlist entry and email them.
- [ ] **Editing an event's date tells nobody.** Guests and the waitlist keep the old date (`app/api/events/[id]/route.ts`). Email everyone when the date changes.
- [ ] **CSV export of the guest list is not built.** The host button shows "Not built yet" (`app/api/events/[id]/export/route.ts`).
- [ ] **No confirmation email and no calendar invite.** The "Add to calendar" button says "not built yet".
- [ ] **Timezones are ignored** (`lib/events.ts`). Every viewer sees the same clock time. Store UTC plus a zone.
- [ ] **No duplicate check.** One email can RSVP many times.
- [ ] **No ticket QR code.** Make each guest a ticket with a QR, and let the check-in page scan it.

## 2. Make it secure

- [ ] There is no host login. Anyone can open any dashboard or check-in page by id. Add accounts (Supabase Auth, Clerk, Auth.js...) and check the event belongs to the signed-in host.
- [ ] Guest emails are shown on the public event page (`app/e/[id]/page.tsx`). Show first names only, and return emails only to the host.
- [ ] Every API route trusts whatever it's sent. Validate input on the server.
- [ ] Ids are guessable (`lib/db.ts`). Use random ids and check that the record belongs to the signed-in user.
- [ ] Data lives in `data/db.json` on disk. Move it to a real database.
- [ ] Anyone can check anyone in (`app/api/guests/[id]/route.ts`).
- [ ] Anyone can edit or cancel anything. The edit page, Cancel RSVP and waitlist Remove buttons need the host login too.

## 3. Make it compliant

- [ ] **Refund policy and terms:** paid events need a clear refund policy and terms before you take money. Consumer protection rules (FTC, Florida Deceptive and Unfair Trade Practices Act) apply to ticket sales.
- [ ] **Privacy (CCPA / CPRA, Florida Digital Bill of Rights, GDPR if you have EU guests):** you collect names and emails. Say why, keep them safe, and let guests ask to see or delete their data.
- [ ] **CAN-SPAM:** confirmation and reminder emails need a real sender address and an unsubscribe link for anything marketing.
- [ ] **PCI DSS:** never touch card numbers yourself. Let Stripe Checkout collect them.
- [ ] **ADA:** the venue and the pages should be accessible. Add an accessibility contact line.
- [ ] No privacy policy or terms page.
- [ ] No way for a user to export or delete their data.

## 4. Connect Stripe

- [ ] `app/api/checkout/route.ts` returns a 501. Create a Stripe Checkout Session (test mode is fine).
- [ ] Add a webhook route that marks the account (and each paid ticket) as paid.
- [ ] Lock the paid features behind the plan.

## 5. Ship it

- [ ] Deploy it (Vercel, Netlify, Railway...). The JSON file database will not survive this, so do section 2 first.
- [ ] Put the live link in your README.

## What "done" looks like

Someone who has never seen it can sign up, pay, use the main feature end to end, and come back tomorrow to find their data still there.
