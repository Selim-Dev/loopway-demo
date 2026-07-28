'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Icon,
  KpiGrid,
  KpiTile,
  ListRow,
  PageBody,
  Section,
  StatusBadge,
  type BadgeTone,
  type IconName,
  type OperationalUpdate,
} from '@loopway/ui';
import { AdminHeader } from '@/components/AdminHeader';
import { ADMIN_SHIPMENTS, SHIPMENT_UPDATES } from '@/mocks/operations';
import { useAdminStore, useQueueCounts } from '@/store/AdminStore';

/**
 * الصفحة الرئيسية التشغيلية — SRS M04-E01.
 *
 * This page REPORTS. It does not decide.
 *
 * The previous version carried eight KPI tiles and an action list with
 * approve/reject affordances, which duplicated what each queue already does —
 * in the one place with none of the context needed to decide well. Every row
 * here now carries a destination and nothing else.
 */

const LIVE = ['متجه للاستلام', 'جاري التحميل', 'في الطريق', 'عند الحدود', 'جاري التسليم'];

const KIND_META: Record<OperationalUpdate['kind'], { icon: IconName; bg: string; color: string; tone: BadgeTone }> = {
  'رحلة': { icon: 'truck', bg: 'var(--color-success-bg)', color: 'var(--lw-green-700)', tone: 'success' },
  'طلب اعتماد': { icon: 'user', bg: 'var(--color-warning-bg)', color: 'var(--lw-amber-600)', tone: 'warning' },
  'غرامة': { icon: 'warning', bg: 'var(--color-danger-bg)', color: 'var(--lw-red-600)', tone: 'danger' },
};

/** Minutes since the pinned session clock, parsed from a fixture timestamp. */
const MONTHS = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
const NOW = Date.UTC(2026, 6, 24, 10, 0);

function ageOf(stamp: string): number {
  const m = stamp.match(/^(\d{1,2})\s+(\S+)\s+(\d{4})(?:\s+·\s+(\d{2}):(\d{2})\s*(ص|م))?/);
  if (!m) return 99_999;
  const month = MONTHS.indexOf(m[2]);
  if (month < 0) return 99_999;
  let hour = m[4] ? Number(m[4]) : 12;
  if (m[6] === 'م' && hour < 12) hour += 12;
  if (m[6] === 'ص' && hour === 12) hour = 0;
  const t = Date.UTC(Number(m[3]), month, Number(m[1]), hour, m[5] ? Number(m[5]) : 0);
  return Math.max(0, Math.round((NOW - t) / 60_000));
}

export function AdminHome() {
  const { state } = useAdminStore();
  const counts = useQueueCounts();

  const activeShipments = ADMIN_SHIPMENTS.filter((s) => LIVE.includes(s.status)).length;

  /**
   * The feed. Shipment status changes are a fixture — `AdminShipment` carries no
   * timestamp — but the approval-request and penalty halves are read from live
   * store state, so a decision taken in a queue appears here without a reload.
   */
  const updates = React.useMemo<OperationalUpdate[]>(() => {
    const fromDrivers: OperationalUpdate[] = state.drivers
      .filter((d) => d.status === 'Under Review')
      .map((d) => ({
        id: `UPD-${d.id}`,
        kind: 'طلب اعتماد' as const,
        reference: d.id,
        title: `طلب تسجيل جديد — ${d.name}`,
        status: 'قيد المراجعة',
        at: d.submittedAt,
        ageMinutes: ageOf(d.submittedAt),
        href: '/drivers',
      }));

    const fromPenalties: OperationalUpdate[] = state.penalties.map((p) => ({
      id: `UPD-${p.id}`,
      kind: 'غرامة' as const,
      reference: p.id,
      title: `${p.type} — ${p.shipmentId}`,
      status:
        p.status === 'Pending Review'
          ? 'بانتظار المراجعة'
          : p.status === 'Approved'
            ? 'معتمدة'
            : p.status === 'Adjusted'
              ? 'معدّلة'
              : p.status === 'Rejected'
                ? 'مرفوضة'
                : 'محتملة',
      at: p.raisedAt,
      ageMinutes: ageOf(p.raisedAt),
      href: '/penalties',
    }));

    return [...SHIPMENT_UPDATES, ...fromDrivers, ...fromPenalties]
      .sort((a, b) => a.ageMinutes - b.ageMinutes)
      .slice(0, 5);
  }, [state.drivers, state.penalties]);

  return (
    <>
      <AdminHeader title="الصفحة الرئيسية التشغيلية" subtitle="مؤشرات التشغيل وآخر ما تغيّر على المنصة" />

      <PageBody>
        <KpiGrid cols={3}>
          <KpiTile
            label="شحنات نشطة"
            value={activeShipments}
            icon="truck"
            background="var(--color-success-bg)"
            color="var(--lw-green-700)"
            href="/shipments"
            linkAs={Link}
          />
          <KpiTile
            label="طلبات اعتماد السائقين"
            value={counts.drivers}
            icon="user"
            background="var(--color-warning-bg)"
            color="var(--lw-amber-600)"
            href="/drivers"
            linkAs={Link}
          />
          <KpiTile
            label="غرامات بانتظار المراجعة"
            value={counts.penalties}
            icon="warning"
            background="var(--color-danger-bg)"
            color="var(--lw-red-600)"
            href="/penalties"
            linkAs={Link}
          />
        </KpiGrid>

        <Section title="آخر التحديثات التشغيلية" subtitle="أحدث خمسة تحديثات — للاطّلاع فقط" flush>
          {updates.map((u) => {
            const meta = KIND_META[u.kind];
            return (
              <ListRow
                key={u.id}
                href={u.href}
                linkAs={Link}
                icon={meta.icon}
                iconBackground={meta.bg}
                iconColor={meta.color}
                title={u.title}
                meta={
                  <>
                    {u.kind} · <span className="lw-ltr">{u.reference}</span> · {u.at}
                  </>
                }
                side={
                  <>
                    <StatusBadge tone={meta.tone}>{u.status}</StatusBadge>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 5,
                        fontSize: 'var(--web-text-micro)',
                        fontWeight: 700,
                        color: 'var(--lw-slate-500)',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      فتح التفاصيل
                      <Icon name="chevronLeft" size={14} />
                    </span>
                  </>
                }
              />
            );
          })}
        </Section>
      </PageBody>
    </>
  );
}
