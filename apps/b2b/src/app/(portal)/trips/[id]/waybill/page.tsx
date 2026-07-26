import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ActionBar,
  DetailList,
  DetailRow,
  Icon,
  PrimaryCta,
  RouteChips,
  StatusBadge,
} from '@loopway/ui';
import { Header } from '@/components/Header';
import { COMPANY } from '@/mocks/company';
import { ALL_TRIPS, findTrip } from '@/mocks/trips';
import styles from '../../../derived.module.css';

/**
 * البوليصة الحية — DERIVED, NOT DESIGNED.
 *
 * SRS BR-013: the waybill is a *dynamic* document regenerated from the trip
 * record on every material event, and the latest version is downloadable at
 * any stage. So this renders live data rather than a stored PDF snapshot, and
 * carries a "last regenerated" stamp.
 */

export function generateStaticParams() {
  return ALL_TRIPS.map((t) => ({ id: t.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return { title: `البوليصة — ${id} — LoopWay` };
}

export default async function WaybillPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const trip = findTrip(id);
  if (!trip) notFound();

  return (
    <>
      <Header title="البوليصة الحية" subtitle={`${trip.id} · تتحدّث تلقائياً مع كل حدث في الرحلة`} />

      <ActionBar note="هذه أحدث نسخة من البوليصة، وتُعاد صياغتها تلقائياً عند أي تغيير في بيانات الرحلة أو حالتها.">
        <PrimaryCta size="sm" variant="secondary" href={`/trips/${trip.id}`} linkAs={Link}>
          العودة إلى الرحلة
        </PrimaryCta>
        <PrimaryCta size="sm" icon="download">
          تنزيل أحدث نسخة (PDF)
        </PrimaryCta>
      </ActionBar>

      <div className={`${styles.waybillWrap} lw-scroll`}>
        <article className={styles.waybill}>
          <header className={styles.waybillHead}>
            <div>
              <div className={styles.waybillTitle}>بوليصة شحن</div>
              <div className={styles.waybillSub}>
                رقم الرحلة <span className="lw-ltr">{trip.id}</span>
              </div>
            </div>
            <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
              <StatusBadge tone={trip.tone === 'done' ? 'success' : trip.tone === 'danger' ? 'danger' : 'warning'} pill>
                {trip.status}
              </StatusBadge>
              <span className={styles.waybillStamp}>
                LoopWay · <span className="lw-ltr">{COMPANY.accountId}</span>
              </span>
            </div>
          </header>

          <div className={styles.waybillSectionTitle}>المسار</div>
          <RouteChips from={trip.from} to={trip.to} variant="plain" />

          <div className={styles.waybillGrid}>
            <div>
              <div className={styles.waybillSectionTitle}>الشاحن</div>
              <DetailList>
                <DetailRow label="الشركة">{COMPANY.companyName}</DetailRow>
                <DetailRow label="السجل التجاري">
                  <span className="lw-ltr">{COMPANY.commercialRegistration}</span>
                </DetailRow>
                <DetailRow label="الرقم الضريبي">
                  <span className="lw-ltr">{COMPANY.vatNumber}</span>
                </DetailRow>
              </DetailList>
            </div>

            <div>
              <div className={styles.waybillSectionTitle}>الناقل</div>
              <DetailList>
                <DetailRow label="السائق">{trip.driver ? trip.who : '—'}</DetailRow>
                <DetailRow label="نوع الشاحنة">ستة محاور — سطحة</DetailRow>
                <DetailRow label="رقم اللوحة">
                  <span className="lw-ltr">٤٢٨١ ر ن ب</span>
                </DetailRow>
              </DetailList>
            </div>
          </div>

          <div className={styles.waybillSectionTitle}>الحمولة</div>
          <DetailList>
            <DetailRow label="الوصف والوزن">{trip.cargo}</DetailRow>
            <DetailRow label="تاريخ الاستلام">{trip.pickupDate}</DetailRow>
            <DetailRow label="النطاق">{trip.scope}</DetailRow>
            <DetailRow label="المرحلة الحالية">{trip.stage}</DetailRow>
          </DetailList>

          <footer className={styles.waybillFoot}>
            <span className={styles.waybillStamp}>
              وثيقة مولَّدة آلياً من بيانات الرحلة داخل منصة LoopWay.
              <br />
              آخر تحديث للبوليصة: 20 يوليو 2026 · 07:48 ص
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--lw-green-700)' }}>
              <Icon name="waybill" size={20} />
              <span style={{ fontSize: 'var(--web-text-label)', fontWeight: 800 }}>نسخة حية</span>
            </span>
          </footer>
        </article>
      </div>
    </>
  );
}
