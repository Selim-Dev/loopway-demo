'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  AlertBanner,
  AvatarInitial,
  DetailList,
  DetailRow,
  EmptyState,
  Icon,
  InlineLink,
  ListRow,
  PageBody,
  PrimaryCta,
  Section,
  Split,
  StatusBadge,
  Tag,
  Toggle,
  type BadgeTone,
  type IconName,
} from '@loopway/ui';
import { AdminHeader } from '@/components/AdminHeader';
import { ACTOR, useAdminStore, useQueueCounts } from '@/store/AdminStore';

/**
 * حساب المستخدم — the operator's own profile.
 *
 * Not an SRS section: it exists because `PageHeader` puts an account chip on
 * every screen and that chip has to land somewhere. It was pointing at
 * `/account`, which only exists in the B2B app, so it 404'd on the Admin
 * deployment.
 *
 * The permissions block is read-only on purpose. Roles are assigned in the
 * back office, and a screen that lets an operator widen their own permissions
 * is the one screen an audit log cannot save you from.
 */

const PERMISSIONS: { label: string; scope: string; allowed: boolean; icon: IconName }[] = [
  { label: 'اعتماد طلبات تسجيل السائقين', scope: 'M04-E03 — السائق وشاحنته ووثائقهما', allowed: true, icon: 'user' },
  { label: 'مراجعة الغرامات وتعديل مبالغها', scope: 'M04-E12', allowed: true, icon: 'warning' },
  { label: 'الاطّلاع على العمليات المالية', scope: 'M04-E10', allowed: true, icon: 'card' },
  { label: 'إدارة الإشعارات والقوالب', scope: 'M04-E15', allowed: true, icon: 'bell' },
  { label: 'صرف مستحقات شركات النقل', scope: 'M04-E11 — يتطلب صلاحية المسؤول المالي', allowed: false, icon: 'arrowOut' },
  { label: 'تعديل إعدادات التسعير والرسوم', scope: 'M04-E09 — يتطلب صلاحية مدير المنصة', allowed: false, icon: 'card' },
];

export function AccountScreen() {
  const { state } = useAdminStore();
  const counts = useQueueCounts();

  // Local only — these are preferences, and there is no backend to persist to.
  const [prefs, setPrefs] = React.useState({ decisions: true, expiries: true, digest: false });

  const mine = state.audit.filter((a) => a.actorId === ACTOR.id).slice(0, 6);
  const backlog = counts.drivers + counts.penalties;

  return (
    <>
      <AdminHeader title="حساب المستخدم" subtitle="بيانات المشغّل وصلاحياته وسجل إجراءاته" />

      <PageBody>
        <AlertBanner tone="info" icon="document">
          الصلاحيات تُمنح من الإدارة العليا ولا يمكن تعديلها من هذه الصفحة. كل إجراء تتخذه يُسجَّل في
          {' '}
          <InlineLink href="/audit" linkAs={Link}>
            سجل القرارات والاعتمادات
          </InlineLink>{' '}
          باسمك ووقته.
        </AlertBanner>

        <Split>
          <Section title="بيانات المشغّل">
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
              <AvatarInitial initial={ACTOR.initial} size={52} fontSize={20} />
              <div>
                <div style={{ fontSize: 17, fontWeight: 800, color: 'var(--lw-navy-900)' }}>{ACTOR.name}</div>
                <div style={{ fontSize: 'var(--web-text-micro)', fontWeight: 600, color: 'var(--lw-slate-500)', marginTop: 3 }}>
                  <span className="lw-ltr">{ACTOR.id}</span> · {ACTOR.role}
                </div>
              </div>
            </div>

            <DetailList>
              <DetailRow label="الدور">{ACTOR.role}</DetailRow>
              <DetailRow label="البريد الإلكتروني">
                <span className="lw-ltr">{ACTOR.email}</span>
              </DetailRow>
              <DetailRow label="الجوال">
                <span className="lw-ltr">{ACTOR.phone}</span>
              </DetailRow>
              <DetailRow label="تاريخ الانضمام">{ACTOR.joinedAt}</DetailRow>
              <DetailRow label="الطوابير المسندة إليك">
                <span className="lw-ltr">{backlog}</span> عنصراً بانتظار قرار
              </DetailRow>
              <DetailRow label="إجراءاتك في السجل">
                <span className="lw-ltr">{state.audit.filter((a) => a.actorId === ACTOR.id).length}</span> قيداً
              </DetailRow>
            </DetailList>
          </Section>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <Section title="الصلاحيات" subtitle="للقراءة فقط — تُمنح من الإدارة العليا" flush>
              {PERMISSIONS.map((p) => (
                <ListRow
                  key={p.label}
                  icon={p.icon}
                  iconBackground={p.allowed ? 'var(--color-success-bg)' : 'var(--lw-bg-subtle)'}
                  iconColor={p.allowed ? 'var(--lw-green-700)' : 'var(--lw-slate-400)'}
                  title={p.label}
                  meta={p.scope}
                  side={
                    <StatusBadge tone={(p.allowed ? 'success' : 'neutral') as BadgeTone}>
                      {p.allowed ? 'مسموح' : 'غير مسموح'}
                    </StatusBadge>
                  }
                />
              ))}
            </Section>

            <Section title="تفضيلات الإشعارات">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <Toggle
                  checked={prefs.decisions}
                  onChange={(v) => setPrefs((p) => ({ ...p, decisions: v }))}
                  label="تنبيهات القرارات المطلوبة"
                  help="عند وصول طلب اعتماد أو غرامة تحتاج قراراً."
                />
                <Toggle
                  checked={prefs.expiries}
                  onChange={(v) => setPrefs((p) => ({ ...p, expiries: v }))}
                  label="تنبيهات انتهاء الوثائق"
                  help="قبل 30 يوماً من انتهاء استمارة أو تأمين أو تصريح."
                />
                <Toggle
                  checked={prefs.digest}
                  onChange={(v) => setPrefs((p) => ({ ...p, digest: v }))}
                  label="ملخّص يومي بالبريد"
                  help="رسالة واحدة في نهاية اليوم بدل تنبيه لكل حدث."
                />
              </div>
            </Section>
          </div>
        </Split>

        <Section
          title="آخر إجراءاتك"
          subtitle="مسجّلة باسمك في سجل القرارات والاعتمادات"
          flush
          action={
            <InlineLink href="/audit" linkAs={Link}>
              عرض السجل كاملاً
            </InlineLink>
          }
        >
          {mine.length === 0 ? (
            <EmptyState glyph="clock" title="لم تتخذ أي إجراء بعد" body="ستظهر قراراتك هنا فور اتخاذها." />
          ) : (
            mine.map((a) => (
              <ListRow
                key={a.id}
                href="/audit"
                linkAs={Link}
                icon="document"
                title={`${a.action} — ${a.entityLabel}`}
                meta={`${a.entityType} · ${a.entityId} · ${a.timestamp}`}
                metaSecondary={a.reason}
                side={<Tag>{a.id}</Tag>}
              />
            ))
          )}
        </Section>

        <div style={{ display: 'flex', gap: 10 }}>
          <PrimaryCta size="sm" variant="secondary" icon="close">
            تسجيل الخروج
          </PrimaryCta>
          <PrimaryCta size="sm" variant="secondary" href="/audit" linkAs={Link}>
            <Icon name="document" size={16} /> مراجعة سجل إجراءاتي
          </PrimaryCta>
        </div>
      </PageBody>
    </>
  );
}
