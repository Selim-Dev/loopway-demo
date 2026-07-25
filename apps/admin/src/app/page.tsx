import type { Metadata } from 'next';
import Link from 'next/link';
import { AlertBanner, Card, Icon, PageHeader, StatusBadge, type IconName } from '@loopway/ui';
import { ADMIN_SECTIONS } from '@/config/sections';
import styles from './page.module.css';

export const metadata: Metadata = { title: 'الصفحة الرئيسية التشغيلية — LoopWay' };

/**
 * M04-E01 — الصفحة الرئيسية التشغيلية.
 *
 * Built for real (not a placeholder) so the shared @loopway/ui layer is proven
 * to work outside the B2B portal before the rest of the Admin screens land.
 */

const KPIS: { label: string; value: string; icon: IconName; bg: string; color: string; href: string }[] = [
  { label: 'شحنات نشطة', value: '148', icon: 'truck', bg: 'var(--color-success-bg)', color: 'var(--lw-green-700)', href: '/shipments' },
  { label: 'سائقون بانتظار الاعتماد', value: '12', icon: 'user', bg: 'var(--color-warning-bg)', color: 'var(--lw-amber-600)', href: '/drivers' },
  { label: 'شاحنات بانتظار الاعتماد', value: '7', icon: 'truck', bg: 'var(--color-warning-bg)', color: 'var(--lw-amber-600)', href: '/trucks' },
  { label: 'وثائق قيد المراجعة', value: '23', icon: 'document', bg: 'var(--lw-icon-tint-bg)', color: 'var(--lw-navy-800)', href: '/documents' },
  { label: 'غرامات بانتظار القرار', value: '4', icon: 'warning', bg: 'var(--color-danger-bg)', color: 'var(--lw-red-600)', href: '/penalties' },
  { label: 'مستحقات جاهزة للتحويل', value: '9', icon: 'arrowOut', bg: 'var(--lw-icon-tint-bg)', color: 'var(--lw-navy-800)', href: '/payouts' },
  { label: 'بلاغات دعم مفتوحة', value: '6', icon: 'support', bg: 'var(--color-warning-bg)', color: 'var(--lw-amber-600)', href: '/support' },
  { label: 'مدفوعات فشلت اليوم', value: '2', icon: 'card', bg: 'var(--color-danger-bg)', color: 'var(--lw-red-600)', href: '/payments' },
];

const QUEUE = [
  { title: 'طلب اعتماد سائق — عبدالرحمن الزهراني', meta: 'وثائق مكتملة · مقدَّم قبل 3 ساعات', href: '/drivers', tone: 'warning' as const, label: 'بانتظار المراجعة' },
  { title: 'غرامة إلغاء بعد التحرك — LW-2026-002910', meta: 'الطرف المسؤول: العميل · المبلغ المقترح 420 ر.س', href: '/penalties', tone: 'danger' as const, label: 'قرار مطلوب' },
  { title: 'تصريح ميناء منتهي — شركة الرحلة اللوجستية', meta: 'ميناء جبل علي · انتهى أمس', href: '/documents', tone: 'danger' as const, label: 'منتهية' },
  { title: 'استمارة شاحنة بحاجة تحديث — ٤٢٨١ ر ن ب', meta: 'الاستمارة تنتهي خلال 9 أيام', href: '/trucks', tone: 'warning' as const, label: 'تحتاج تحديث' },
  { title: 'نزاع على إثبات تسليم — LW-2026-002905', meta: 'العميل يطلب تحققاً بديلاً', href: '/support', tone: 'warning' as const, label: 'قيد المعالجة' },
];

export default function AdminHome() {
  const built = ADMIN_SECTIONS.length;

  return (
    <>
      <PageHeader
        title="الصفحة الرئيسية التشغيلية"
        subtitle="M04-E01 · نظرة واحدة على كل ما يحتاج قراراً من فريق التشغيل"
        accountName="فريق التشغيل"
        accountId="LW-ADM-0001"
        accountInitial="ت"
        notificationCount={5}
      />

      <AlertBanner tone="info" icon="document">
        لوحة الإدارة مُهيّأة بالكامل على مستوى التوجيه ({built} قسماً) وتعمل على نفس طبقة التصميم المشتركة مع لوحة الشركات.
        الشاشات التفصيلية تُبنى تباعاً.
      </AlertBanner>

      <div className={styles.kpis}>
        {KPIS.map((k) => (
          <Link key={k.label} href={k.href} className={styles.kpi}>
            <span className={styles.kpiIcon} style={{ background: k.bg, color: k.color }}>
              <Icon name={k.icon} size={20} />
            </span>
            <span>
              <span className={styles.kpiLabel}>{k.label}</span>
              <span className={styles.kpiValue}>{k.value}</span>
            </span>
          </Link>
        ))}
      </div>

      <Card tight className={styles.queue}>
        <div className={styles.queueHead}>
          <span className={styles.queueTitle}>إجراءات بانتظار قرار الإدارة</span>
          <span className={styles.queueSub}>مرتّبة حسب الأثر المالي ثم الأقدمية</span>
        </div>
        {QUEUE.map((q) => (
          <Link key={q.title} href={q.href} className={styles.row}>
            <span className={styles.rowGlyph}>
              <Icon name="warning" size={17} />
            </span>
            <span className={styles.rowMain}>
              <span className={styles.rowTitle}>{q.title}</span>
              <span className={styles.rowMeta}>{q.meta}</span>
            </span>
            <StatusBadge tone={q.tone}>{q.label}</StatusBadge>
          </Link>
        ))}
      </Card>
    </>
  );
}
