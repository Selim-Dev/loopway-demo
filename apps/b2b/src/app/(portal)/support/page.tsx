import type { Metadata } from 'next';
import {
  Field,
  FormGrid,
  FormSelect,
  ListRow,
  PageBody,
  PrimaryCta,
  Section,
  Split,
  StatusBadge,
  TextArea,
  type BadgeTone,
} from '@loopway/ui';
import { Header } from '@/components/Header';
import { SUPPORT_CASES } from '@/mocks/notifications';

export const metadata: Metadata = { title: 'الدعم — LoopWay' };

const CASE_TONE: Record<string, BadgeTone> = {
  'مفتوحة': 'warning',
  'قيد المعالجة': 'warning',
  'مغلقة': 'neutral',
};

const PRIORITY_TONE: Record<string, BadgeTone> = {
  'عالية': 'danger',
  'متوسطة': 'warning',
  'منخفضة': 'neutral',
};

/** DERIVED, NOT DESIGNED — SRS M03-E10-F02. */
export default function SupportPage() {
  return (
    <>
      <Header title="الدعم والبلاغات" subtitle="افتح بلاغاً أو تابع حالة بلاغاتك السابقة" />
      <PageBody>
        <Split>
          <Section title="بلاغاتي" subtitle={`${SUPPORT_CASES.length} بلاغات`} flush>
            {SUPPORT_CASES.map((c) => (
              <ListRow
                key={c.id}
                icon="support"
                title={
                  <>
                    {c.type} · <span className="lw-ltr">{c.id}</span>
                  </>
                }
                meta={
                  <>
                    {c.tripId ? (
                      <>
                        <span className="lw-ltr">{c.tripId}</span> ·{' '}
                      </>
                    ) : null}
                    فُتح في {c.openedAt}
                  </>
                }
                metaSecondary={c.description}
                side={
                  <>
                    <StatusBadge tone={PRIORITY_TONE[c.priority] ?? 'neutral'}>{c.priority}</StatusBadge>
                    <StatusBadge tone={CASE_TONE[c.status] ?? 'neutral'}>{c.status}</StatusBadge>
                  </>
                }
              />
            ))}
          </Section>

          <Section title="فتح بلاغ جديد">
            <FormGrid columns={1}>
              <Field label="نوع البلاغ" required htmlFor="case-type">
                <FormSelect id="case-type" defaultValue="delay">
                  <option value="delay">تأخير في التحميل أو التسليم</option>
                  <option value="damage">تلف أو نقص في الحمولة</option>
                  <option value="penalty">اعتراض على غرامة</option>
                  <option value="payment">مشكلة في الدفع أو الفاتورة</option>
                  <option value="other">أخرى</option>
                </FormSelect>
              </Field>

              <Field label="الرحلة المرتبطة" htmlFor="case-trip">
                <FormSelect id="case-trip" defaultValue="">
                  <option value="">لا ترتبط برحلة معيّنة</option>
                  <option value="LW-2026-002960">LW-2026-002960</option>
                  <option value="LW-2026-002951">LW-2026-002951</option>
                  <option value="LW-2026-002955">LW-2026-002955</option>
                </FormSelect>
              </Field>

              <Field label="وصف المشكلة" required htmlFor="case-body">
                <TextArea
                  id="case-body"
                  placeholder="اشرح ما حدث بالتفصيل، مع الأوقات والمواقع إن أمكن."
                />
              </Field>

              <Field label="مرفقات" help="الصيغ المدعومة: صور وPDF حتى 10 م.ب لكل ملف.">
                <PrimaryCta size="sm" variant="secondary" icon="upload">
                  إرفاق صور أو مستندات
                </PrimaryCta>
              </Field>
            </FormGrid>

            <div style={{ marginTop: 18 }}>
              <PrimaryCta size="sm">إرسال البلاغ</PrimaryCta>
            </div>
          </Section>
        </Split>
      </PageBody>
    </>
  );
}
