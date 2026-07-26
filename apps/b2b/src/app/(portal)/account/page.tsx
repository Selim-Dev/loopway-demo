import type { Metadata } from 'next';
import Link from 'next/link';
import {
  AvatarInitial,
  DetailList,
  DetailRow,
  Icon,
  InlineLink,
  ListRow,
  PageBody,
  PrimaryCta,
  Section,
  Split,
  StatusBadge,
} from '@loopway/ui';
import { Header } from '@/components/Header';
import { BROKERS, COMPANY, SAVED_LOCATIONS } from '@/mocks/company';
import { COMPANY_DOCUMENTS } from '@/mocks/workspace';
import { AccountTabs } from './AccountTabs';

export const metadata: Metadata = { title: 'الملف الشخصي — LoopWay' };

const CHEVRON = <Icon name="chevronLeft" size={16} style={{ color: 'var(--lw-slate-300)' }} />;

/** DERIVED, NOT DESIGNED — SRS M03-E01-F02 overview. */
export default function AccountPage() {
  return (
    <>
      <Header title="الملف الشخصي وإعدادات البروكر" subtitle="بيانات الشركة والوثائق والمواقع والمخلّصين الجمركيين" />
      <PageBody>
        <AccountTabs />

        <Split>
          <Section
            title="حساب الشركة"
            action={
              <InlineLink href="/account/company" linkAs={Link}>
                تعديل البيانات
              </InlineLink>
            }
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
              <AvatarInitial initial={COMPANY.initial} size={52} fontSize={20} />
              <div>
                <div style={{ fontSize: 17, fontWeight: 800, color: 'var(--lw-navy-900)' }}>{COMPANY.companyName}</div>
                <div style={{ fontSize: 'var(--web-text-micro)', fontWeight: 600, color: 'var(--lw-slate-500)', marginTop: 3 }}>
                  <span className="lw-ltr">{COMPANY.accountId}</span> · {COMPANY.planName}
                </div>
              </div>
            </div>

            <DetailList>
              <DetailRow label="المفوّض بالتواصل">{COMPANY.authorizedContact}</DetailRow>
              <DetailRow label="السجل التجاري">
                <span className="lw-ltr">{COMPANY.commercialRegistration}</span>
              </DetailRow>
              <DetailRow label="الرقم الضريبي">
                <span className="lw-ltr">{COMPANY.vatNumber}</span>
              </DetailRow>
              <DetailRow label="العنوان الوطني">{COMPANY.nationalAddress}</DetailRow>
              <DetailRow label="الحد الأقصى للرحلات المتزامنة">
                <span className="lw-ltr">{COMPANY.maxConcurrent}</span> رحلات
              </DetailRow>
            </DetailList>
          </Section>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <Section
              title="وثائق الشركة"
              flush
              action={
                <InlineLink href="/account/documents" linkAs={Link}>
                  عرض الأرشيف
                </InlineLink>
              }
            >
              {COMPANY_DOCUMENTS.map((d) => (
                <ListRow
                  key={d.id}
                  icon="document"
                  title={d.documentType}
                  meta={d.expiryDate ? `تنتهي في ${d.expiryDate}` : `رُفعت في ${d.uploadedAt}`}
                  side={<StatusBadge tone="success">معتمدة</StatusBadge>}
                />
              ))}
            </Section>

            <Section title="اختصارات" flush>
              <ListRow
                href="/account/brokers"
                linkAs={Link}
                icon="user"
                title="البروكرز المحفوظين"
                meta={`${BROKERS.length} مخلّصون جمركيون`}
                side={CHEVRON}
              />
              <ListRow
                href="/account/locations"
                linkAs={Link}
                icon="home"
                title="المواقع المحفوظة"
                meta={`${SAVED_LOCATIONS.length} مستودعات وموانئ`}
                side={CHEVRON}
              />
              <ListRow
                href="/settings"
                linkAs={Link}
                icon="gear"
                title="الإعدادات والباقة"
                meta={COMPANY.planName}
                side={CHEVRON}
              />
            </Section>

            <PrimaryCta size="sm" variant="secondary" href="/login" linkAs={Link}>
              تسجيل الخروج
            </PrimaryCta>
          </div>
        </Split>
      </PageBody>
    </>
  );
}
