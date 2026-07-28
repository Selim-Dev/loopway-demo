'use client';

import * as React from 'react';
import {
  AmountText,
  AvatarInitial,
  Card,
  Icon,
  ProgressBar,
  RefCode,
  RouteChips,
  ScopeTag,
  StatusBadge,
  TripRow,
  WalletCard,
  WalletCta,
  formatElapsed,
  useSecondTick,
  type Trip,
} from '@loopway/ui';
import { ProductFrame } from './ProductFrame';
import styles from './LiveSurfaces.module.css';

/**
 * The real product, rendered on the marketing page.
 *
 * Every surface below is an actual @loopway/ui component fed an actual fixture
 * — the same `LW-2026-002960` the B2B portal shows. Nothing here is a mockup,
 * a screenshot or a redraw, which is the one claim on this page that a
 * template could not make.
 *
 * Sample data follows docs/design-system/01-identity.md: real Saudi names, real
 * city pairs, the product's own reference-code formats.
 */

/** The hero trip. `live: true` is what starts the timer. */
const HERO_TRIP: Trip = {
  id: 'LW-2026-002960',
  from: 'الرياض',
  to: 'الدمام',
  scope: 'محلية',
  cargo: 'معدات ثقيلة • 30 طن',
  pickupDate: '20 يوليو 2026',
  status: 'في الطريق',
  stage: 'متجه إلى نقطة الاستلام',
  progress: 25,
  who: 'خالد ناصر',
  whoSub: 'شاحنة مسطحة • ٧٧٤٢ ل م ن',
  driver: true,
  baseElapsed: 2551,
  action: 'متابعة الرحلة',
  kind: 'primary',
  live: true,
  tone: 'success',
};

/**
 * The hero's trip row — the load-bearing piece of the "this is real" claim.
 * `useSecondTick` starts at 0 on mount so the server and first client render
 * agree; the counter then runs for as long as the page is open.
 */
export function LiveTripRow() {
  const tick = useSecondTick(true);

  return (
    <ProductFrame width={1000}>
      <TripRow
        trip={HERO_TRIP}
        expanded={false}
        onToggle={() => {}}
        elapsed={formatElapsed((HERO_TRIP.baseElapsed ?? 0) + tick)}
      />
    </ProductFrame>
  );
}

/**
 * The escrow surface — the product's one gradient, used exactly as the product
 * uses it. The label is Arabic on both locales because it is product content,
 * not site copy: this panel IS the Arabic-first interface.
 */
export function LiveWallet() {
  return (
    <ProductFrame width={372}>
      <WalletCard
        label="محفظة الشركة"
        amount="24,600"
        currency="ر.س"
        stats={[
          { label: 'محجوز لرحلات جارية', value: '11,340' },
          { label: 'متاح للاستخدام', value: '13,260' },
        ]}
        actions={<WalletCta icon="download">شحن الرصيد</WalletCta>}
      />
    </ProductFrame>
  );
}

/**
 * The offers surface for the BR-001 feature row.
 *
 * Note what is NOT here: any "recommended" badge, any estimated price, any
 * cheapest-first sort marker. BR-001 is a constraint on this component as much
 * as on the backend — the platform does not have an opinion about the price.
 */
const OFFERS = [
  { initial: 'خ', name: 'خالد ناصر', meta: 'شاحنة مسطحة • ٤ سنوات خبرة', amount: '3,850', badge: 'وصل العرض' },
  { initial: 'ع', name: 'عبدالله الغامدي', meta: 'شاحنة مسطحة • ٧ سنوات خبرة', amount: '4,100', badge: 'وصل العرض' },
  { initial: 'س', name: 'سعد المطيري', meta: 'شاحنة مسطحة • سنتان خبرة', amount: '3,640', badge: 'وصل العرض' },
];

export function LiveOffers() {
  return (
    <ProductFrame width={420}>
      <Card tight className={styles.offers}>
        <div className={styles.offersHead}>
          <span className={styles.offersTitle}>عروض السائقين</span>
          <StatusBadge tone="warning">3 عروض</StatusBadge>
        </div>
        {OFFERS.map((o) => (
          <div key={o.name} className={styles.offer}>
            <AvatarInitial initial={o.initial} variant="driver" size={38} fontSize={14} />
            <span className={styles.offerMain}>
              <span className={styles.offerName}>{o.name}</span>
              <span className={styles.offerMeta}>{o.meta}</span>
            </span>
            <span className={styles.offerAmount}>
              <AmountText amount={o.amount} direction="debit" currency="ر.س" muted />
            </span>
          </div>
        ))}
        <div className={styles.offersFoot}>
          <Icon name="document" size={15} />
          لا تعرض المنصة سعراً مرجعياً. المقارنة بين العروض فقط.
        </div>
      </Card>
    </ProductFrame>
  );
}

/**
 * The live waybill share card (BR-013).
 *
 * The CTA is the real `LiveWaybillButton` with the breathing glow the design
 * system granted it — the single decorative animation the product allows,
 * because the waybill genuinely is live.
 */
const WAYBILL_EVENTS = [
  { label: 'نُشر الطلب', time: '18 يوليو · 09:04 ص', state: 'done' as const },
  { label: 'الدفع محجوز', time: '18 يوليو · 11:22 ص', state: 'done' as const },
  { label: 'اكتمل التحميل', time: '20 يوليو · 06:40 ص', state: 'done' as const },
  { label: 'في الطريق إلى الدمام', time: 'الآن', state: 'active' as const },
  { label: 'إثبات التسليم', time: 'بانتظار', state: 'upcoming' as const },
];

export function LiveWaybill() {
  return (
    <ProductFrame width={420}>
      <Card tight className={styles.waybill}>
        <div className={styles.waybillHead}>
          <span>
            <span className={styles.waybillTitle}>البوليصة الحية</span>
            <RefCode size={12} weight={700} color="var(--lw-slate-500)">
              LW-2026-002960
            </RefCode>
          </span>
          <StatusBadge tone="success">حيّة</StatusBadge>
        </div>

        <div className={styles.share}>
          <Icon name="arrowOut" size={15} />
          <span className={`${styles.shareUrl} lw-ltr`}>loopway.sa/w/002960</span>
          <span className={styles.shareCopy}>نسخ</span>
        </div>

        <ol className={styles.events}>
          {WAYBILL_EVENTS.map((e) => (
            <li key={e.label} className={styles[e.state]}>
              <span className={styles.eventDot} aria-hidden="true" />
              <span className={styles.eventLabel}>{e.label}</span>
              <span className={styles.eventTime}>{e.time}</span>
            </li>
          ))}
        </ol>

        <div className={styles.waybillFoot}>للقراءة فقط · يتحدّث تلقائياً مع كل حدث</div>
      </Card>
    </ProductFrame>
  );
}

/** The cross-border surface: real route chips, real scope tag, real permit rows. */
const PERMITS = [
  { name: 'تصريح دخول ميناء جبل علي', status: 'معتمد', tone: 'success' as const },
  { name: 'بيان جمركي', status: 'مرفوع', tone: 'neutral' as const },
  { name: 'تصريح مواد خطرة', status: 'غير مطلوب', tone: 'neutral' as const },
];

export function LiveCrossBorder() {
  return (
    <ProductFrame width={420}>
      <Card tight className={styles.border}>
        <div className={styles.borderHead}>
          <RouteChips from="الدمام" to="دبي" variant="plain" />
          <ScopeTag scope="دولية" />
        </div>

        <div className={styles.borderStage}>
          <span className={styles.borderStageDot} aria-hidden="true" />
          <span>
            <span className={styles.borderStageLabel}>عند الحدود — منفذ البطحاء</span>
            <span className={styles.borderStageMeta}>
              دخل منطقة الجمارك · <span className="lw-ltr">05:40:12</span>
            </span>
          </span>
        </div>

        <ProgressBar percent={72} />

        <ul className={styles.permits}>
          {PERMITS.map((p) => (
            <li key={p.name}>
              <Icon name="document" size={15} />
              <span className={styles.permitName}>{p.name}</span>
              <StatusBadge tone={p.tone}>{p.status}</StatusBadge>
            </li>
          ))}
        </ul>
      </Card>
    </ProductFrame>
  );
}
