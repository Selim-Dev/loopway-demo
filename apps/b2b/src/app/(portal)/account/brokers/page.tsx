import type { Metadata } from 'next';
import { AlertBanner, ListRow, PageBody, PrimaryCta, Section, StatusBadge, Tag } from '@loopway/ui';
import { Header } from '@/components/Header';
import { BROKERS } from '@/mocks/company';
import { AccountTabs } from '../AccountTabs';

export const metadata: Metadata = { title: 'البروكرز المحفوظين — LoopWay' };

/** DERIVED, NOT DESIGNED — SRS M03-E09. */
export default function BrokersPage() {
  return (
    <>
      <Header title="البروكرز المحفوظين" subtitle="المخلّصون الجمركيون الذين تتعامل معهم في الشحن الدولي" />
      <PageBody>
        <AccountTabs />

        <AlertBanner tone="info" icon="document">
          البروكر ليس مستخدماً داخل المنصة. تُرسل له بيانات الرحلة عبر رابط واتساب يُفتح من جهازك أنت.
        </AlertBanner>

        <Section
          title="القائمة"
          flush
          action={
            <PrimaryCta size="sm" icon="plus">
              إضافة بروكر
            </PrimaryCta>
          }
        >
          {BROKERS.map((b) => (
            <ListRow
              key={b.id}
              icon="user"
              title={b.name}
              meta={
                <>
                  {b.country} · {b.portOrBorder} · <span className="lw-ltr">{b.whatsappNumber}</span>
                </>
              }
              metaSecondary={b.notes}
              side={
                <>
                  <Tag>
                    ترخيص <span className="lw-ltr">{b.authorizationNumber}</span>
                  </Tag>
                  <StatusBadge tone="success">سارٍ حتى {b.expiryDate}</StatusBadge>
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
