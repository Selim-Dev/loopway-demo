'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  AlertBanner,
  AmountText,
  AvatarInitial,
  Card,
  ContentTabs,
  DetailList,
  DetailRow,
  Icon,
  LiveWaybillButton,
  ListRow,
  Muted,
  PageBody,
  PrimaryCta,
  ProgressBar,
  RouteChips,
  ScopeTag,
  Section,
  Split,
  StageChip,
  StatusBadge,
  Timeline,
  formatElapsed,
  useSecondTick,
  type TimelineItem,
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

const TABS = [
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

      <PageBody>
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

        <ContentTabs tabs={TABS} active={tab} onChange={(k) => setTab(k as Tab)} />

        {tab === 'overview' ? <OverviewTab trip={trip} /> : null}
        {tab === 'timeline' ? <TimelineTab /> : null}
        {tab === 'offers' ? <OffersTab /> : null}
        {tab === 'documents' ? <DocumentsTab /> : null}
        {tab === 'payment' ? <PaymentTab /> : null}
      </PageBody>
    </>
  );
}

function OverviewTab({ trip }: { trip: Trip }) {
  return (
    <Split>
      <Section title="بيانات الرحلة">
        <DetailList>
          <DetailRow label="الحمولة">{trip.cargo}</DetailRow>
          <DetailRow label="نوع الشاحنة المطلوب">ستة محاور — سطحة</DetailRow>
          <DetailRow label="تاريخ الاستلام">{trip.pickupDate}</DetailRow>
          <DetailRow label="موقع الاستلام">{trip.from} — المنطقة الصناعية الثانية، مستودع 14</DetailRow>
          <DetailRow label="موقع التسليم">{trip.to} — ميناء الملك عبدالعزيز، البوابة 3</DetailRow>
          <DetailRow label="مشرف التحميل">
            ماجد العنزي · <span className="lw-ltr">0555 210 4471</span>
          </DetailRow>
          <DetailRow label="رقم مرجعي للشركة">
            <span className="lw-ltr">PO-2026-4471</span>
          </DetailRow>
        </DetailList>
      </Section>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <Section title={trip.driver ? 'السائق والشاحنة' : 'العروض'}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
            <AvatarInitial
              initial={trip.driver ? trip.who.trim().charAt(0) : '؟'}
              variant={trip.driver ? 'driver' : 'offers'}
              size={40}
              fontSize={15}
            />
            <div>
              <div style={{ fontSize: 'var(--web-text-meta)', fontWeight: 800, color: 'var(--lw-navy-900)' }}>
                {trip.who}
              </div>
              <div style={{ fontSize: 'var(--web-text-micro)', fontWeight: 600, color: 'var(--lw-slate-500)', marginTop: 3 }}>
                {trip.whoSub}
              </div>
            </div>
          </div>
          {trip.driver ? (
            <DetailList>
              <DetailRow label="رقم اللوحة">
                <span className="lw-ltr">٤٢٨١ ر ن ب</span>
              </DetailRow>
              <DetailRow label="نوع الشاحنة">ستة محاور — سطحة</DetailRow>
              <DetailRow label="التواصل">
                <span className="lw-ltr">0554 118 2260</span>
              </DetailRow>
            </DetailList>
          ) : null}
        </Section>

        <Section title="البروكر / المخلّص الجمركي">
          {trip.scope === 'دولية' ? (
            <>
              <div style={{ fontSize: 'var(--web-text-label)', fontWeight: 700, color: 'var(--lw-navy-900)' }}>
                مكتب البطحاء للتخليص الجمركي
              </div>
              <div style={{ fontSize: 'var(--web-text-micro)', fontWeight: 600, color: 'var(--lw-slate-500)', marginTop: 3 }}>
                منفذ البطحاء · <span className="lw-ltr">+966 55 480 2211</span>
              </div>
              <div style={{ marginTop: 14 }}>
                <PrimaryCta variant="secondary" size="sm" icon="document">
                  إرسال بيانات الرحلة عبر واتساب
                </PrimaryCta>
              </div>
              <div style={{ marginTop: 10 }}>
                <Muted>
                  يفتح واتساب من جهازك برسالة جاهزة تحتوي بيانات الرحلة والبوليصة. لا تُرسل المنصة أي رسالة نيابةً عنك.
                </Muted>
              </div>
            </>
          ) : (
            <Muted>هذه رحلة محلية ولا تتطلب مخلّصاً جمركياً.</Muted>
          )}
        </Section>
      </div>
    </Split>
  );
}

function TimelineTab() {
  const items: TimelineItem[] = TRIP_TIMELINE.map((e) => ({
    id: e.id,
    label: e.label,
    meta: `${e.timestamp}${e.location ? ` · ${e.location}` : ''}${e.actor ? ` · ${e.actor}` : ''}`,
    note: e.note,
    state: e.state,
  }));

  return (
    <Section title="سجل تتبّع الرحلة" subtitle="كل حدث يُسجَّل بوقته وموقعه داخل ملف الرحلة">
      <Timeline items={items} />
    </Section>
  );
}

function OffersTab() {
  return (
    <>
      <AlertBanner tone="info" icon="document">
        لا تعرض المنصة سعراً مرجعياً أو تقديرياً. كل مبلغ أدناه هو عرض السائق نفسه.
      </AlertBanner>

      <Section title="العروض المستلمة" subtitle={`${TRIP_OFFERS.length} عروض`} flush>
        {TRIP_OFFERS.map((o) => (
          <div key={o.id} className={styles.offer}>
            <AvatarInitial initial={o.driverInitial} size={40} fontSize={15} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className={styles.offerName}>{o.driverName}</div>
              <div className={styles.offerMeta}>
                <span className="lw-ltr">{o.rating}</span> ★ · <span className="lw-ltr">{o.trips}</span> رحلة ·{' '}
                {o.truckType}
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
      </Section>
    </>
  );
}

function DocumentsTab() {
  return (
    <Section
      title="مستندات الرحلة"
      flush
      action={
        <PrimaryCta size="sm" variant="secondary" icon="upload">
          رفع مستند
        </PrimaryCta>
      }
    >
      {TRIP_DOCUMENTS.map((d) => {
        const meta = DOC_TONE[d.status] ?? { tone: 'neutral' as const, label: d.status };
        return (
          <ListRow
            key={d.id}
            icon="document"
            title={d.documentType}
            meta={`${d.uploadedBy} · ${d.uploadedAt} · ${d.sizeLabel}`}
            side={
              <>
                <StatusBadge tone={meta.tone}>{meta.label}</StatusBadge>
                <Icon name="download" size={17} style={{ color: 'var(--lw-slate-400)' }} />
              </>
            }
          />
        );
      })}
    </Section>
  );
}

function PaymentTab() {
  return (
    <Split>
      <Section title="تفاصيل الدفع">
        <DetailList>
          <DetailRow label="عرض السائق المختار">
            <span className="lw-ltr">3,347.83</span> ر.س
          </DetailRow>
          <DetailRow label="ضريبة القيمة المضافة (15%)">
            <span className="lw-ltr">502.17</span> ر.س
          </DetailRow>
          <DetailRow label="الإجمالي المدفوع">
            <AmountText amount="3,850" direction="debit" />
          </DetailRow>
          <DetailRow label="طريقة الدفع">محفظة LoopWay</DetailRow>
          <DetailRow label="رقم العملية">
            <span className="lw-ltr">TXN-2026-01911</span>
          </DetailRow>
        </DetailList>
      </Section>

      <Section title="حالة المبلغ">
        <AlertBanner tone="success" icon="check">
          المبلغ محجوز بأمان ويُحرَّر للسائق فقط بعد تأكيد التسليم.
        </AlertBanner>
        <div style={{ marginTop: 14 }}>
          <Muted>
            في حال إلغاء الرحلة بعد تحرّك السائق، تُنشئ المنصة غرامة محتملة تُراجعها الإدارة قبل أي أثر مالي.
          </Muted>
        </div>
        <div style={{ marginTop: 16 }}>
          <PrimaryCta size="sm" variant="secondary" icon="download" href="/finance" linkAs={Link}>
            عرض العملية في السجل المالي
          </PrimaryCta>
        </div>
      </Section>
    </Split>
  );
}
