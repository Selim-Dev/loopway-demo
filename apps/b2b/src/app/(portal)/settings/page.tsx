import type { Metadata } from 'next';
import Link from 'next/link';
import {
  AlertBanner,
  DetailList,
  DetailRow,
  ListRow,
  Muted,
  PageBody,
  PrimaryCta,
  ProgressBar,
  Section,
  Split,
  StatusBadge,
} from '@loopway/ui';
import { Header } from '@/components/Header';
import { COMPANY } from '@/mocks/company';
import { LIVE_TRIPS, OFFER_TRIPS } from '@/mocks/trips';

export const metadata: Metadata = { title: 'الإعدادات — LoopWay' };

const NOTIFICATION_PREFS = [
  { label: 'وصول عروض جديدة', body: 'تنبيه فوري عند وصول أي عرض على رحلة منشورة.' },
  { label: 'تغيّر حالة الرحلة', body: 'التحميل، عبور الحدود، التسليم، والإغلاق.' },
  { label: 'المدفوعات والفواتير', body: 'نجاح أو فشل عمليات الدفع وشحن الرصيد.' },
  { label: 'المستندات والتصاريح', body: 'وثيقة مطلوبة أو على وشك الانتهاء.' },
];

/** DERIVED, NOT DESIGNED — plan + preferences behind the rail's gear icon. */
export default function SettingsPage() {
  const used = LIVE_TRIPS.length + OFFER_TRIPS.length;
  const pct = Math.round((used / COMPANY.maxConcurrent) * 100);

  return (
    <>
      <Header title="الإعدادات" subtitle="الباقة والتنبيهات وإعدادات الحساب" />
      <PageBody>
        <Split>
          <Section
            title={COMPANY.planName}
            subtitle="إدارة عدة رحلات متزامنة حسب حد باقتك"
            action={<StatusBadge tone="success">نشطة</StatusBadge>}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 'var(--web-text-label)', fontWeight: 600, color: 'var(--lw-slate-500)' }}>
                الرحلات المتزامنة المستخدمة
              </span>
              <span style={{ fontSize: 'var(--web-text-meta)', fontWeight: 700, color: 'var(--lw-navy-900)' }}>
                <span className="lw-ltr">
                  {used} / {COMPANY.maxConcurrent}
                </span>
              </span>
            </div>
            <ProgressBar percent={pct} label="استهلاك حد الباقة" />

            {used >= COMPANY.maxConcurrent ? (
              <div style={{ marginTop: 16 }}>
                <AlertBanner tone="warning">
                  لقد وصلت إلى الحد الأقصى للرحلات الحالية المسموح به في باقتك
                </AlertBanner>
              </div>
            ) : null}

            <div style={{ marginTop: 16 }}>
              <DetailList>
                <DetailRow label="تاريخ التجديد">1 أغسطس 2026</DetailRow>
                <DetailRow label="طريقة الدفع">محفظة LoopWay</DetailRow>
              </DetailList>
            </div>

            <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
              <PrimaryCta size="sm">ترقية الباقة</PrimaryCta>
              <PrimaryCta size="sm" variant="secondary" href="/finance" linkAs={Link}>
                سجل المدفوعات
              </PrimaryCta>
            </div>
          </Section>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <Section title="التنبيهات" flush>
              {NOTIFICATION_PREFS.map((p) => (
                <ListRow
                  key={p.label}
                  icon="bell"
                  title={p.label}
                  meta={p.body}
                  side={<StatusBadge tone="success">مفعّلة</StatusBadge>}
                />
              ))}
            </Section>

            <Section title="المستخدمون">
              <Muted>
                يعمل حساب الشركة برقم جوال واحد للمفوّض في هذه النسخة. الصلاحيات المتعددة داخل الشركة خارج نطاق الإصدار
                الحالي وستُضاف لاحقاً.
              </Muted>
            </Section>
          </div>
        </Split>
      </PageBody>
    </>
  );
}
