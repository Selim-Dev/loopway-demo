import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Icon, PrimaryCta, RouteChips, StatusBadge } from '@loopway/ui';
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

      <div className={styles.actionBar}>
        <span className={styles.actionBarNote}>
          هذه أحدث نسخة من البوليصة، وتُعاد صياغتها تلقائياً عند أي تغيير في بيانات الرحلة أو حالتها.
        </span>
        <div className={styles.actionBarGroup}>
          <PrimaryCta size="sm" variant="secondary" href={`/trips/${trip.id}`} linkAs={Link}>
            العودة إلى الرحلة
          </PrimaryCta>
          <PrimaryCta size="sm" icon="download">
            تنزيل أحدث نسخة (PDF)
          </PrimaryCta>
        </div>
      </div>

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
              <div className={styles.kv}>
                <span className={styles.kvKey}>الشركة</span>
                <span className={styles.kvValue}>{COMPANY.companyName}</span>
              </div>
              <div className={styles.kv}>
                <span className={styles.kvKey}>السجل التجاري</span>
                <span className={styles.kvValue}><span className="lw-ltr">{COMPANY.commercialRegistration}</span></span>
              </div>
              <div className={styles.kv}>
                <span className={styles.kvKey}>الرقم الضريبي</span>
                <span className={styles.kvValue}><span className="lw-ltr">{COMPANY.vatNumber}</span></span>
              </div>
            </div>

            <div>
              <div className={styles.waybillSectionTitle}>الناقل</div>
              <div className={styles.kv}>
                <span className={styles.kvKey}>السائق</span>
                <span className={styles.kvValue}>{trip.driver ? trip.who : '—'}</span>
              </div>
              <div className={styles.kv}>
                <span className={styles.kvKey}>نوع الشاحنة</span>
                <span className={styles.kvValue}>ستة محاور — سطحة</span>
              </div>
              <div className={styles.kv}>
                <span className={styles.kvKey}>رقم اللوحة</span>
                <span className={styles.kvValue}><span className="lw-ltr">٤٢٨١ ر ن ب</span></span>
              </div>
            </div>
          </div>

          <div className={styles.waybillSectionTitle}>الحمولة</div>
          <div className={styles.kv}>
            <span className={styles.kvKey}>الوصف والوزن</span>
            <span className={styles.kvValue}>{trip.cargo}</span>
          </div>
          <div className={styles.kv}>
            <span className={styles.kvKey}>تاريخ الاستلام</span>
            <span className={styles.kvValue}>{trip.pickupDate}</span>
          </div>
          <div className={styles.kv}>
            <span className={styles.kvKey}>النطاق</span>
            <span className={styles.kvValue}>{trip.scope}</span>
          </div>
          <div className={styles.kv}>
            <span className={styles.kvKey}>المرحلة الحالية</span>
            <span className={styles.kvValue}>{trip.stage}</span>
          </div>

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
