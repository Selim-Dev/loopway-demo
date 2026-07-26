import type { Metadata } from 'next';
import { ListRow, PageBody, PrimaryCta, Section, StatusBadge, Tag } from '@loopway/ui';
import { Header } from '@/components/Header';
import { SAVED_LOCATIONS } from '@/mocks/company';
import { AccountTabs } from '../AccountTabs';

export const metadata: Metadata = { title: 'المواقع المحفوظة — LoopWay' };

/** DERIVED, NOT DESIGNED — SRS M03-E08. */
export default function LocationsPage() {
  return (
    <>
      <Header title="المواقع المحفوظة" subtitle="مستودعات وموانئ تُستخدم مباشرة عند إنشاء رحلة جديدة" />
      <PageBody>
        <AccountTabs />

        <Section
          title="القائمة"
          flush
          action={
            <PrimaryCta size="sm" icon="plus">
              إضافة موقع
            </PrimaryCta>
          }
        >
          {SAVED_LOCATIONS.map((l) => (
            <ListRow
              key={l.id}
              icon={l.isPort ? 'truck' : 'home'}
              title={l.label}
              meta={`${l.country} · ${l.city} · ${l.address}`}
              metaSecondary={
                l.supervisorName ? (
                  <>
                    مشرف: {l.supervisorName} · <span className="lw-ltr">{l.supervisorPhone}</span>
                  </>
                ) : undefined
              }
              side={
                <>
                  {l.isPort ? <Tag>{l.portName}</Tag> : null}
                  {l.permitRequired ? (
                    <StatusBadge tone="warning">يتطلب تصريح</StatusBadge>
                  ) : (
                    <StatusBadge tone="neutral">لا يتطلب تصريح</StatusBadge>
                  )}
                  <PrimaryCta size="sm" variant="secondary">
                    تعديل
                  </PrimaryCta>
                </>
              }
            />
          ))}
        </Section>
      </PageBody>
    </>
  );
}
