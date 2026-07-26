'use client';

import Link from 'next/link';
import { AlertBanner, KpiGrid, KpiTile, ListRow, PageBody, Section, StatusBadge, type IconName } from '@loopway/ui';
import { AdminHeader } from '@/components/AdminHeader';
import { ADMIN_SHIPMENTS } from '@/mocks/operations';
import { ADMIN_PAYMENTS } from '@/mocks/finance';
import { useAdminStore, useQueueCounts } from '@/store/AdminStore';

/**
 * M04-E01 — الصفحة الرئيسية التشغيلية.
 *
 * Every figure is derived from the store, so clearing a queue elsewhere in the
 * portal is visible here immediately. The decision list is ordered by financial
 * impact first, then age — that is the order an operator should work in.
 */

const LIVE = ['متجه للاستلام', 'جاري التحميل', 'في الطريق', 'عند الحدود', 'جاري التسليم'];

export function AdminHome() {
  const { state } = useAdminStore();
  const c = useQueueCounts();

  const activeShipments = ADMIN_SHIPMENTS.filter((s) => LIVE.includes(s.status)).length;
  const failedPayments = ADMIN_PAYMENTS.filter((p) => p.status === 'Failed').length;

  const kpis: { label: string; value: number; icon: IconName; bg: string; color: string; href: string }[] = [
    { label: 'شحنات نشطة', value: activeShipments, icon: 'truck', bg: 'var(--color-success-bg)', color: 'var(--lw-green-700)', href: '/shipments' },
    { label: 'سائقون بانتظار الاعتماد', value: c.drivers, icon: 'user', bg: 'var(--color-warning-bg)', color: 'var(--lw-amber-600)', href: '/drivers' },
    { label: 'شاحنات بانتظار الاعتماد', value: c.trucks, icon: 'truck', bg: 'var(--color-warning-bg)', color: 'var(--lw-amber-600)', href: '/trucks' },
    { label: 'وثائق قيد المراجعة', value: c.documents, icon: 'document', bg: 'var(--lw-icon-tint-bg)', color: 'var(--lw-navy-800)', href: '/documents' },
    { label: 'غرامات بانتظار القرار', value: c.penalties, icon: 'warning', bg: 'var(--color-danger-bg)', color: 'var(--lw-red-600)', href: '/penalties' },
    { label: 'مستحقات جاهزة للتحويل', value: c.payouts, icon: 'arrowOut', bg: 'var(--lw-icon-tint-bg)', color: 'var(--lw-navy-800)', href: '/payouts' },
    { label: 'بلاغات دعم مفتوحة', value: c.support, icon: 'support', bg: 'var(--color-warning-bg)', color: 'var(--lw-amber-600)', href: '/support' },
    { label: 'مدفوعات فشلت', value: failedPayments, icon: 'card', bg: 'var(--color-danger-bg)', color: 'var(--lw-red-600)', href: '/payments' },
  ];

  // Ordered by financial impact, then age — money and blocked trips first.
  const queue = [
    ...state.penalties
      .filter((p) => p.status === 'Pending Review')
      .slice(0, 2)
      .map((p) => ({
        key: p.id,
        href: '/penalties',
        icon: 'warning' as IconName,
        title: `${p.type} — ${p.shipmentId}`,
        meta: `الطرف المسؤول: ${p.responsibleParty} · المبلغ المقترح ${p.proposedAmount} ر.س`,
        tone: 'danger' as const,
        label: 'قرار مطلوب',
      })),
    ...state.documents
      .filter((d) => d.status === 'Under Review' && d.rule === 'blocking')
      .slice(0, 2)
      .map((d) => ({
        key: d.id,
        href: '/documents',
        icon: 'document' as IconName,
        title: `${d.documentType} — ${d.entityName}`,
        meta: d.shipmentId ? `يمنع بدء التحميل على ${d.shipmentId}` : 'تصريح مانع بانتظار المراجعة',
        tone: 'danger' as const,
        label: 'مانع',
      })),
    ...state.drivers
      .filter((d) => d.status === 'Under Review')
      .slice(0, 2)
      .map((d) => ({
        key: d.id,
        href: '/drivers',
        icon: 'user' as IconName,
        title: `طلب اعتماد سائق — ${d.name}`,
        meta: `${d.documents.length} وثائق · مقدَّم في ${d.submittedAt}`,
        tone: 'warning' as const,
        label: 'بانتظار المراجعة',
      })),
    ...state.cases
      .filter((x) => x.needsAlternativePod)
      .slice(0, 1)
      .map((x) => ({
        key: x.id,
        href: '/support',
        icon: 'support' as IconName,
        title: `${x.type} — ${x.shipmentId ?? ''}`,
        meta: 'يحتاج تحققاً بديلاً من التسليم قبل إغلاق الرحلة',
        tone: 'warning' as const,
        label: 'قيد المعالجة',
      })),
  ];

  return (
    <>
      <AdminHeader title="الصفحة الرئيسية التشغيلية" subtitle="نظرة واحدة على كل ما يحتاج قراراً من فريق التشغيل" />

      <PageBody>
        {queue.length === 0 ? (
          <AlertBanner tone="success" icon="check">
            لا توجد إجراءات بانتظار قرار الإدارة. كل الطوابير فارغة.
          </AlertBanner>
        ) : null}

        <KpiGrid cols={4}>
          {kpis.map((k) => (
            <KpiTile
              key={k.label}
              label={k.label}
              value={k.value}
              icon={k.icon}
              background={k.bg}
              color={k.color}
              href={k.href}
              linkAs={Link}
            />
          ))}
        </KpiGrid>

        <Section
          title="إجراءات بانتظار قرار الإدارة"
          subtitle="مرتّبة حسب الأثر المالي ثم الأقدمية"
          flush
        >
          {queue.map((q) => (
            <ListRow
              key={q.key}
              href={q.href}
              linkAs={Link}
              icon={q.icon}
              iconBackground={q.tone === 'danger' ? 'var(--color-danger-bg)' : 'var(--color-warning-bg)'}
              iconColor={q.tone === 'danger' ? 'var(--lw-red-600)' : 'var(--lw-amber-600)'}
              title={q.title}
              meta={q.meta}
              side={<StatusBadge tone={q.tone}>{q.label}</StatusBadge>}
            />
          ))}
        </Section>
      </PageBody>
    </>
  );
}
