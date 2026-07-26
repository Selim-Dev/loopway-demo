import type { Metadata } from 'next';
import {
  AlertBanner,
  Field,
  FormGrid,
  Icon,
  ListRow,
  PageBody,
  PrimaryCta,
  Section,
  StatusBadge,
  TextInput,
} from '@loopway/ui';
import { Header } from '@/components/Header';
import { COMPANY } from '@/mocks/company';
import { COMPANY_DOCUMENTS } from '@/mocks/workspace';
import { AccountTabs } from '../AccountTabs';

export const metadata: Metadata = { title: 'بيانات الشركة — LoopWay' };

/** DERIVED, NOT DESIGNED — SRS M03-E01-F02. */
export default function CompanyPage() {
  return (
    <>
      <Header title="بيانات ووثائق الشركة" subtitle="تُستخدم في البوليصة والفواتير الضريبية" />
      <PageBody>
        <AccountTabs />

        <Section title="البيانات الأساسية" action={<PrimaryCta size="sm">حفظ التغييرات</PrimaryCta>}>
          <FormGrid>
            <Field label="اسم الشركة" required htmlFor="co-name">
              <TextInput id="co-name" defaultValue={COMPANY.companyName} />
            </Field>
            <Field label="رقم السجل التجاري" required htmlFor="co-cr">
              <TextInput id="co-cr" ltr defaultValue={COMPANY.commercialRegistration} />
            </Field>
            <Field label="الرقم الضريبي" required htmlFor="co-vat">
              <TextInput id="co-vat" ltr defaultValue={COMPANY.vatNumber} />
            </Field>
            <Field label="المفوّض بالتواصل" required htmlFor="co-contact">
              <TextInput id="co-contact" defaultValue={COMPANY.authorizedContact} />
            </Field>
            <Field label="العنوان الوطني" required wide htmlFor="co-address">
              <TextInput id="co-address" defaultValue={COMPANY.nationalAddress} />
            </Field>
          </FormGrid>
        </Section>

        <AlertBanner tone="warning">
          السجل التجاري ينتهي في 14 سبتمبر 2026. جدّد الوثيقة قبل انتهائها لتفادي إيقاف إنشاء رحلات جديدة.
        </AlertBanner>

        <Section
          title="الوثائق الرسمية"
          flush
          action={
            <PrimaryCta size="sm" variant="secondary" icon="upload">
              رفع وثيقة
            </PrimaryCta>
          }
        >
          {COMPANY_DOCUMENTS.map((d) => (
            <ListRow
              key={d.id}
              icon="document"
              title={d.documentType}
              meta={`رُفعت في ${d.uploadedAt} · ${d.sizeLabel}${d.expiryDate ? ` · تنتهي في ${d.expiryDate}` : ''}`}
              side={
                <>
                  <StatusBadge tone={d.expiryDate ? 'warning' : 'success'}>
                    {d.expiryDate ? 'تقترب من الانتهاء' : 'معتمدة'}
                  </StatusBadge>
                  <Icon name="download" size={17} style={{ color: 'var(--lw-slate-400)' }} />
                </>
              }
            />
          ))}
        </Section>
      </PageBody>
    </>
  );
}
