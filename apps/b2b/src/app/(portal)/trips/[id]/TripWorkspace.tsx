'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  AlertBanner,
  AmountText,
  AvatarInitial,
  Card,
  Icon,
  LiveWaybillButton,
  PrimaryCta,
  ProgressBar,
  RouteChips,
  ScopeTag,
  StageChip,
  StatusBadge,
  formatElapsed,
  useSecondTick,
  type Trip,
} from '@loopway/ui';
import { Header } from '@/components/Header';
import { TRIP_DOCUMENTS, TRIP_OFFERS, TRIP_TIMELINE } from '@/mocks/workspace';
import styles from '../../derived.module.css';

/**
 * تفاصيل الرحلة — DERIVED, NOT DESIGNED (SRS M03-E03-F02, "Workspace").
 *
 * BR-001 compliance: nothing on this screen shows a platform-generated price.
 * The عروض tab lists driver bids only; the الدفع tab shows what was actually
 * charged. There is no estimate, no "market average", no suggested price.
 */

type Tab = 'overview' | 'timeline' | 'offers' | 'documents' | 'payment';

const TABS: { key: Tab; label: string }[] = [
  { key: 'overview', label: 'نظرة عامة' },
  { key: 'timeline', label: 'التتبّع' },
  { key: 'offers', label: 'العروض' },
  { key: 'documents', label: 'المستندات' },
  { key: 'payment', label: 'الدفع' },
];

const DOC_TONE: Record<string, { tone: 'success' | 'warning' | 'neutral' | 'danger'; label: string }> = {
  Approved: { tone: 'success', label: 'معتمدة' },
  Archived: { tone: 'neutral', label: 'مؤرشفة' },
  'Under Review': { tone: 'warning', label: 'قيد المراجعة' },
  'Required Now': { tone: 'danger', label: 'مطلوبة الآن' },
  'Required Later': { tone: 'warning', label: 'مطلوبة لاحقاً' },
  Uploaded: { tone: 'neutral', label: 'مرفوعة' },
  Rejected: { tone: 'danger', label: 'مرفوضة' },
  Expired: { tone: 'danger', label: 'منتهية' },
};

export function TripWorkspace({ trip }: { trip: Trip }) {
  const [tab, setTab] = React.useState<Tab>('overview');
  const tick = useSecondTick(trip.live);

  return (
    <>
      <Header title="تفاصيل الرحلة" subtitle={`${trip.id} · ${trip.from} ← ${trip.to}`} />

      <div className={styles.body}>
        <Card tight style={{ padding: '18px 20px', flex: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              <span
                style={{
                  fontSize: 22,
                  fontWeight: 800,
                  fontFamily: 'var(--font-latin)',
                  direction: 'ltr',
                  letterSpacing: '-.3px',
                  color: 'var(--lw-navy-900)',
                }}
              >
                {trip.id}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <RouteChips from={trip.from} to={trip.to} variant="plain" />
                <ScopeTag scope={trip.scope} />
              </div>
            </div>

            <div style={{ marginRight: 'auto', display: 'flex', alignItems: 'center', gap: 10 }}>
              <StageChip
                tone={trip.tone}
                label={trip.stage}
                showSpinner={trip.live || trip.tone === 'warning'}
                showCheck={trip.tone === 'done'}
                elapsed={trip.live ? formatElapsed((trip.baseElapsed ?? 0) + tick) : undefined}
              />
              <div style={{ width: 190 }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: 6,
                    fontSize: 'var(--web-text-micro)',
                    fontWeight: 700,
                    color: 'var(--lw-slate-500)',
                  }}
                >
                  <span>تقدم الرحلة</span>
                  <span className="lw-ltr">{trip.progress}%</span>
                </div>
                <ProgressBar percent={trip.progress} label="تقدم الرحلة" />
              </div>
              <div style={{ width: 190 }}>
                <LiveWaybillButton href={`/trips/${trip.id}/waybill`} linkAs={Link} />
              </div>
            </div>
          </div>
        </Card>

        <div className={styles.tabs} role="tablist">
          {TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              role="tab"
              aria-selected={tab === t.key}
              className={tab === t.key ? `${styles.tab} ${styles.tabActive}` : styles.tab}
              onClick={() => setTab(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'overview' ? <OverviewTab trip={trip} /> : null}
        {tab === 'timeline' ? <TimelineTab /> : null}
        {tab === 'offers' ? <OffersTab /> : null}
        {tab === 'documents' ? <DocumentsTab /> : null}
        {tab === 'payment' ? <PaymentTab /> : null}
      </div>
    </>
  );
}

function OverviewTab({ trip }: { trip: Trip }) {
  return (
    <div className={styles.split}>
      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <span className={styles.sectionTitle}>بيانات الرحلة</span>
        </div>
        <div className={styles.sectionBody}>
          <div className={styles.kv}>
            <span className={styles.kvKey}>الحمولة</span>
            <span className={styles.kvValue}>{trip.cargo}</span>
          </div>
          <div className={styles.kv}>
            <span className={styles.kvKey}>نوع الشاحنة المطلوب</span>
            <span className={styles.kvValue}>ستة محاور — سطحة</span>
          </div>
          <div className={styles.kv}>
            <span className={styles.kvKey}>تاريخ الاستلام</span>
            <span className={styles.kvValue}>{trip.pickupDate}</span>
          </div>
          <div className={styles.kv}>
            <span className={styles.kvKey}>موقع الاستلام</span>
            <span className={styles.kvValue}>{trip.from} — المنطقة الصناعية الثانية، مستودع 14</span>
          </div>
          <div className={styles.kv}>
            <span className={styles.kvKey}>موقع التسليم</span>
            <span className={styles.kvValue}>{trip.to} — ميناء الملك عبدالعزيز، البوابة 3</span>
          </div>
          <div className={styles.kv}>
            <span className={styles.kvKey}>مشرف التحميل</span>
            <span className={styles.kvValue}>ماجد العنزي · <span className="lw-ltr">0555 210 4471</span></span>
          </div>
          <div className={styles.kv}>
            <span className={styles.kvKey}>رقم مرجعي للشركة</span>
            <span className={styles.kvValue}><span className="lw-ltr">PO-2026-4471</span></span>
          </div>
        </div>
      </section>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <section className={styles.section}>
          <div className={styles.sectionHead}>
            <span className={styles.sectionTitle}>{trip.driver ? 'السائق والشاحنة' : 'العروض'}</span>
          </div>
          <div className={styles.sectionBody}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
              <AvatarInitial
                initial={trip.driver ? trip.who.trim().charAt(0) : '؟'}
                variant={trip.driver ? 'driver' : 'offers'}
                size={40}
                fontSize={15}
              />
              <div>
                <div style={{ fontSize: 'var(--web-text-meta)', fontWeight: 800, color: 'var(--lw-navy-900)' }}>{trip.who}</div>
                <div className={styles.rowMeta}>{trip.whoSub}</div>
              </div>
            </div>
            {trip.driver ? (
              <>
                <div className={styles.kv}>
                  <span className={styles.kvKey}>رقم اللوحة</span>
                  <span className={styles.kvValue}><span className="lw-ltr">٤٢٨١ ر ن ب</span></span>
                </div>
                <div className={styles.kv}>
                  <span className={styles.kvKey}>نوع الشاحنة</span>
                  <span className={styles.kvValue}>ستة محاور — سطحة</span>
                </div>
                <div className={styles.kv}>
                  <span className={styles.kvKey}>التواصل</span>
                  <span className={styles.kvValue}><span className="lw-ltr">0554 118 2260</span></span>
                </div>
              </>
            ) : null}
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHead}>
            <span className={styles.sectionTitle}>البروكر / المخلّص الجمركي</span>
          </div>
          <div className={styles.sectionBody}>
            {trip.scope === 'دولية' ? (
              <>
                <div className={styles.rowTitle}>مكتب البطحاء للتخليص الجمركي</div>
                <div className={styles.rowMeta}>منفذ البطحاء · <span className="lw-ltr">+966 55 480 2211</span></div>
                <div style={{ marginTop: 14 }}>
                  <PrimaryCta variant="secondary" size="sm" icon="document">
                    إرسال بيانات الرحلة عبر واتساب
                  </PrimaryCta>
                </div>
                <div className={styles.help} style={{ marginTop: 10 }}>
                  يفتح واتساب من جهازك برسالة جاهزة تحتوي بيانات الرحلة والبوليصة. لا تُرسل المنصة أي رسالة نيابةً عنك.
                </div>
              </>
            ) : (
              <div className={styles.muted}>هذه رحلة محلية ولا تتطلب مخلّصاً جمركياً.</div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

function TimelineTab() {
  return (
    <section className={styles.section}>
      <div className={styles.sectionHead}>
        <span className={styles.sectionTitle}>سجل تتبّع الرحلة</span>
        <span className={styles.sectionSub}>كل حدث يُسجَّل بوقته وموقعه داخل ملف الرحلة</span>
      </div>
      <div className={styles.sectionBody}>
        <div className={styles.timeline}>
          {TRIP_TIMELINE.map((e, i) => {
            const last = i === TRIP_TIMELINE.length - 1;
            return (
              <div key={e.id} className={styles.tlStep}>
                <div className={styles.tlRail}>
                  <span
                    className={[
                      styles.tlDot,
                      e.state === 'done' ? styles.tlDotDone : '',
                      e.state === 'active' ? styles.tlDotActive : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                  >
                    {e.state === 'done' ? <Icon name="check" size={13} strokeWidth={2.8} /> : null}
                    {e.state === 'active' ? <Icon name="clock" size={13} /> : null}
                  </span>
                  {!last ? (
                    <span className={e.state === 'done' ? `${styles.tlLine} ${styles.tlLineDone}` : styles.tlLine} />
                  ) : null}
                </div>
                <div className={styles.tlBody}>
                  <div className={e.state === 'upcoming' ? `${styles.tlLabel} ${styles.tlLabelUpcoming}` : styles.tlLabel}>
                    {e.label}
                  </div>
                  <div className={styles.tlMeta}>
                    {e.timestamp}
                    {e.location ? ` · ${e.location}` : ''}
                    {e.actor ? ` · ${e.actor}` : ''}
                  </div>
                  {e.note ? <div className={styles.tlNote}>{e.note}</div> : null}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function OffersTab() {
  return (
    <>
      <AlertBanner tone="info" icon="document">
        لا تعرض المنصة سعراً مرجعياً أو تقديرياً. كل مبلغ أدناه هو عرض السائق نفسه.
      </AlertBanner>

      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <span className={styles.sectionTitle}>العروض المستلمة</span>
          <span className={styles.sectionSub}>{TRIP_OFFERS.length} عروض</span>
        </div>
        <div className={styles.sectionBodyFlush}>
          {TRIP_OFFERS.map((o) => (
            <div key={o.id} className={styles.offer}>
              <AvatarInitial initial={o.driverInitial} size={40} fontSize={15} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className={styles.offerName}>{o.driverName}</div>
                <div className={styles.offerMeta}>
                  <span className="lw-ltr">{o.rating}</span> ★ · <span className="lw-ltr">{o.trips}</span> رحلة · {o.truckType}
                </div>
              </div>
              <div className={styles.offerMeta} style={{ width: 150, flex: 'none' }}>
                {o.eta}
              </div>
              <div className={styles.offerPrice}>
                {o.price} <span className={styles.offerPriceUnit}>ر.س</span>
              </div>
              <div style={{ width: 120, flex: 'none', display: 'flex', justifyContent: 'flex-end' }}>
                {o.status === 'Selected' ? (
                  <StatusBadge tone="success">تم الاختيار</StatusBadge>
                ) : (
                  <PrimaryCta size="sm" variant="secondary">
                    اختيار العرض
                  </PrimaryCta>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

function DocumentsTab() {
  return (
    <section className={styles.section}>
      <div className={styles.sectionHead}>
        <span className={styles.sectionTitle}>مستندات الرحلة</span>
        <PrimaryCta size="sm" variant="secondary" icon="upload">
          رفع مستند
        </PrimaryCta>
      </div>
      <div className={styles.sectionBodyFlush}>
        {TRIP_DOCUMENTS.map((d) => {
          const meta = DOC_TONE[d.status] ?? { tone: 'neutral' as const, label: d.status };
          return (
            <div key={d.id} className={`${styles.row} ${styles.rowHover}`}>
              <span className={styles.glyph}>
                <Icon name="document" size={18} />
              </span>
              <div className={styles.rowMain}>
                <div className={styles.rowTitle}>{d.documentType}</div>
                <div className={styles.rowMeta}>
                  {d.uploadedBy} · {d.uploadedAt} · {d.sizeLabel}
                </div>
              </div>
              <div className={styles.rowSide}>
                <StatusBadge tone={meta.tone}>{meta.label}</StatusBadge>
                <Icon name="download" size={17} style={{ color: 'var(--lw-slate-400)' }} />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function PaymentTab() {
  return (
    <div className={styles.split}>
      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <span className={styles.sectionTitle}>تفاصيل الدفع</span>
        </div>
        <div className={styles.sectionBody}>
          <div className={styles.kv}>
            <span className={styles.kvKey}>عرض السائق المختار</span>
            <span className={styles.kvValue}><span className="lw-ltr">3,347.83</span> ر.س</span>
          </div>
          <div className={styles.kv}>
            <span className={styles.kvKey}>ضريبة القيمة المضافة (15%)</span>
            <span className={styles.kvValue}><span className="lw-ltr">502.17</span> ر.س</span>
          </div>
          <div className={styles.kv}>
            <span className={styles.kvKey}>الإجمالي المدفوع</span>
            <span className={styles.kvValue}>
              <AmountText amount="3,850" direction="debit" />
            </span>
          </div>
          <div className={styles.kv}>
            <span className={styles.kvKey}>طريقة الدفع</span>
            <span className={styles.kvValue}>محفظة LoopWay</span>
          </div>
          <div className={styles.kv}>
            <span className={styles.kvKey}>رقم العملية</span>
            <span className={styles.kvValue}><span className="lw-ltr">TXN-2026-01911</span></span>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <span className={styles.sectionTitle}>حالة المبلغ</span>
        </div>
        <div className={styles.sectionBody}>
          <AlertBanner tone="success" icon="check">
            المبلغ محجوز بأمان ويُحرَّر للسائق فقط بعد تأكيد التسليم.
          </AlertBanner>
          <div className={styles.help} style={{ marginTop: 14 }}>
            في حال إلغاء الرحلة بعد تحرّك السائق، تُنشئ المنصة غرامة محتملة تُراجعها الإدارة قبل أي أثر مالي.
          </div>
          <div style={{ marginTop: 16 }}>
            <PrimaryCta size="sm" variant="secondary" icon="download" href="/finance" linkAs={Link}>
              عرض العملية في السجل المالي
            </PrimaryCta>
          </div>
        </div>
      </section>
    </div>
  );
}
