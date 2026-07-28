import { LINKS } from './links';
import type { Dictionary } from './types';

/**
 * English — a translation of `ar.ts`, not a separate pitch. Same claims, same
 * order, same restraint. The voice rules still apply: no exclamation marks, no
 * emoji, sentence case, nothing claimed the product does not do.
 */
export const en: Dictionary = {
  meta: {
    title: 'LoopWay — land freight for Saudi Arabia and the Gulf',
    description:
      'A land-freight marketplace connecting shippers and companies with vetted drivers. Post a shipment, receive bids from drivers, and funds stay held until delivery is confirmed.',
  },

  nav: {
    links: [
      { label: 'How it works', href: '#how' },
      { label: 'The platform', href: '#features' },
      { label: 'Apps and portals', href: '#platforms' },
      { label: 'Rules we hold to', href: '#rules' },
    ],
    cta: 'Company sign in',
    switchTo: 'العربية',
    switchToShort: 'AR',
    skipToContent: 'Skip to content',
  },

  hero: {
    eyebrow: 'Land freight · domestic and cross-border',
    titleLines: ['Your shipment moves', 'in a straight line', 'from request to delivery'],
    lead: 'You post the shipment, vetted drivers compete for it, and you pick the offer that suits you. The amount is held in your wallet and released only once delivery is confirmed.',
    ctaPrimary: 'Open the company portal',
    ctaSecondary: 'See how it works',
    liveCaption: 'This is not a screenshot. The components above are the product itself, and the timer is running now.',
    productLanguageNote: 'The panels stay in Arabic because the product is Arabic-first — this is the real interface, not a translation of it.',
    tripLabel: 'Live shipment',
    walletLabel: 'Funds held until delivery',
  },

  proof: {
    items: [
      { value: 'Four surfaces', label: 'Customer and driver apps, company and admin portals' },
      { value: 'Cross-border', label: 'Ports, crossings, permits and a customs layer' },
      { value: 'Proof of delivery', label: 'Required to close a trip. No exceptions' },
      { value: 'Full audit trail', label: 'Every sensitive action logged with actor and time' },
    ],
  },

  how: {
    eyebrow: 'End to end',
    title: 'Ten stages, from posting to closure',
    lead: 'Every stage has a known state, a recorded time and a file holding its documents. There is no gap where someone has to ask where the shipment is.',
    stages: [
      { short: 'Sign up', title: 'Register and sign in', body: 'Mobile number and verification, then complete the account.' },
      { short: 'Post', title: 'Create the shipment', body: 'Locations, cargo, truck type and the documents required.' },
      { short: 'Publish', title: 'Publish the request', body: 'It reaches drivers matched on location, truck and permits.' },
      { short: 'Offers', title: 'Driver offers', body: 'Every qualified driver submits one bid for your shipment.' },
      { short: 'Select', title: 'Choose an offer', body: 'You compare the bids and pick one; that holds the driver and starts the payment window.' },
      { short: 'Pay', title: 'Payment', body: 'From the wallet or directly. The amount is held, not transferred.' },
      { short: 'Prepare', title: 'Prepare for pickup', body: 'Driver details, required permits, and a broker where one is needed.' },
      { short: 'Execute', title: 'Execution and tracking', body: 'The driver records loading, road, border and unloading as they happen.' },
      { short: 'Deliver', title: 'Proof of delivery', body: 'A one-time code, a photo or a signature, per the shipment policy.' },
      { short: 'Close', title: 'Closure and settlement', body: 'Penalties reviewed, funds released, then archive and rating.' },
    ],
  },

  features: {
    eyebrow: 'What sets it apart',
    title: 'Four decisions the platform is built on',
    lead: 'Each one is visible in use, not buried in the terms.',
    rows: [
      {
        rule: 'BR-001',
        eyebrow: 'Pricing',
        title: 'The price comes from drivers, not from us',
        body: 'The platform shows no reference, estimate or suggestion. You post the shipment, qualified drivers compete for it with their own bids, and you compare those bids as they arrived. Fees, commission and VAT are itemised at payment.',
        points: ['One bid per driver', 'Compare offers with no platform-weighted ranking', 'Full fee breakdown before you pay'],
      },
      {
        rule: 'BR-011',
        eyebrow: 'Money',
        title: 'Funds are held until it arrives',
        body: 'On payment the amount is held in the wallet and does not reach the driver. Proof of delivery is what unlocks release — no manual approval, no admin override.',
        points: ['Held at payment, released after delivery', 'Company balance and its ledger in one place', 'Clear refund when the window expires'],
      },
      {
        rule: 'BR-013',
        eyebrow: 'Sharing',
        title: 'One live link instead of twenty messages',
        body: 'The waybill is a document that keeps pace with the shipment. Share it with a broker or a consignee as a single read-only link and they see the latest state, timeline and permitted documents — without opening an account.',
        points: ['Regenerates on every material event', 'Read-only, under a defined sharing policy', 'Revoke or reissue it at any time'],
      },
      {
        rule: 'M01-E03',
        eyebrow: 'Scope',
        title: 'Domestic and cross-border on one path',
        body: 'A cross-border trip is not a different product. Ports, crossings, permits and the border-and-customs layer appear inside the same shipment when the route calls for them, and stay out of the way when it does not.',
        points: ['Riyadh → Dammam, and Dammam → Dubai', 'Port permits inside the shipment file', 'A border and customs stage on the timeline'],
      },
    ],
  },

  platforms: {
    eyebrow: 'Surfaces',
    title: 'Four interfaces, one product',
    lead: 'Both web portals are ready to try now. The two apps are being built on the same design layer.',
    cards: [
      { name: 'Company portal', role: 'Manage company shipments, calendar, payments, archive and saved locations.', href: LINKS.b2b, status: 'Ready', primary: true },
      { name: 'Admin portal', role: 'Approve drivers and trucks, review documents and penalties, payments and reports.', href: LINKS.admin, status: 'Demo' },
      { name: 'Customer app', role: 'Create a shipment, compare offers, pay, track and close.', href: null, status: 'Soon' },
      { name: 'Driver app', role: 'Receive requests, bid, run the trip and upload proofs.', href: null, status: 'Soon' },
    ],
    open: 'Open the portal',
  },

  rules: {
    eyebrow: 'Commitments',
    title: 'Rules written into the product, not into a terms page',
    lead: 'These are not marketing promises. Each is a constraint built into the system and observable on any screen.',
    cards: [
      { code: 'BR-001', title: 'No reference price', body: 'The system shows no estimate and no suggestion. The price comes from driver bids alone.' },
      { code: 'BR-011', title: 'Delivery closes the trip', body: 'No shipment closes without proof of delivery. There is no button that bypasses it.' },
      { code: 'BR-012', title: 'Penalties are reviewed first', body: 'A penalty stays potential until an admin approves it. Nothing is charged automatically.' },
      { code: 'BR-015', title: 'Every action is logged', body: 'Each sensitive decision is written to the audit log with actor, time, and the value before and after.' },
    ],
  },

  cta: {
    title: 'Try the portal before you ask about pricing',
    body: 'The company portal is open now with a complete set of demo data. No sign-up, no card.',
    primary: 'Open the company portal',
    secondary: 'View the admin portal',
  },

  footer: {
    tagline: 'A land-freight platform for Saudi Arabia and the Gulf.',
    columns: [
      {
        title: 'Product',
        links: [
          { label: 'How it works', href: '#how' },
          { label: 'The platform', href: '#features' },
          { label: 'Rules we hold to', href: '#rules' },
        ],
      },
      {
        title: 'Portals',
        links: [
          { label: 'Company portal', href: LINKS.b2b },
          { label: 'Admin portal', href: LINKS.admin },
        ],
      },
    ],
    legal: 'LoopWay · Vlora',
    note: 'Demo interfaces for presentation. The data shown is not real.',
  },
};
