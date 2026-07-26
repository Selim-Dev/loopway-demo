'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  ActionBar,
  AlertBanner,
  ChipList,
  ChoiceCard,
  ChoiceRow,
  Field,
  FormGrid,
  FormSelect,
  Icon,
  ListRow,
  Muted,
  PageBody,
  PrimaryCta,
  Section,
  StatusBadge,
  Tag,
  TextArea,
  TextInput,
  type IconName,
} from '@loopway/ui';
import { Header } from '@/components/Header';
import { BROKERS, SAVED_LOCATIONS } from '@/mocks/company';
import styles from '../../derived.module.css';

/**
 * إنشاء رحلة جديدة — DERIVED, NOT DESIGNED (SRS M03-E04, mirroring M01-E03).
 *
 * Three business rules shape this flow and must survive any redesign:
 *   BR-001  the platform NEVER shows a reference or estimated price. Step 6
 *           asks the customer to name a Base Price or open a tender — it does
 *           not suggest one, and there is no "typical range" hint.
 *   BR-002  choosing a pricing type is mandatory, not a default.
 *   BR-003  a fixed price is the Base Price only; fees, commission and VAT are
 *           added at payment time, which is why they are stated, not hidden.
 */

const STEPS = [
  { key: 'basics', label: 'البيانات الأساسية' },
  { key: 'route', label: 'المواقع' },
  { key: 'cargo', label: 'الحمولة' },
  { key: 'truck', label: 'الشاحنة' },
  { key: 'docs', label: 'الوثائق والتصاريح' },
  { key: 'pricing', label: 'التسعير والنشر' },
] as const;

const TRUCK_TYPES: { key: string; title: string; body: string; recommended: boolean }[] = [
  { key: 'flatbed6', title: 'ستة محاور — سطحة', body: 'حمولات ثقيلة حتى 40 طن. مناسبة للمعدات والبضائع الجافة.', recommended: true },
  { key: 'lowbed', title: 'لوبد', body: 'معدات ثقيلة أو ارتفاعات غير اعتيادية. تحتاج تصريح حجم غالباً.', recommended: true },
  { key: 'reefer', title: 'مبردة', body: 'مواد غذائية أو دوائية بدرجة حرارة محددة.', recommended: false },
  { key: 'curtain', title: 'ستائر جانبية', body: 'بضائع مغلّفة تحتاج تحميلاً جانبياً سريعاً.', recommended: false },
];

export function CreateTripWizard() {
  const [step, setStep] = React.useState(0);
  const [truck, setTruck] = React.useState('flatbed6');
  const [pricing, setPricing] = React.useState<'fixed' | 'tender' | null>(null);
  const current = STEPS[step];

  const canAdvance = current.key !== 'pricing' || pricing !== null;

  return (
    <>
      <Header title="إنشاء رحلة جديدة" subtitle="املأ بيانات الرحلة ثم انشرها للسائقين المؤهلين" />

      <div className={styles.stepper}>
        {STEPS.map((s, i) => (
          <React.Fragment key={s.key}>
            {i > 0 ? <span className={i <= step ? `${styles.stepBar} ${styles.stepBarDone}` : styles.stepBar} /> : null}
            <button
              type="button"
              className={styles.step}
              style={{ border: 'none', background: 'none', cursor: 'pointer', padding: '0 4px' }}
              onClick={() => setStep(i)}
            >
              <span
                className={[
                  styles.stepDot,
                  i === step ? styles.stepDotActive : '',
                  i < step ? styles.stepDotDone : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                {i < step ? <Icon name="check" size={13} strokeWidth={2.8} /> : i + 1}
              </span>
              <span className={i === step ? `${styles.stepLabel} ${styles.stepLabelActive}` : styles.stepLabel}>
                {s.label}
              </span>
            </button>
          </React.Fragment>
        ))}
      </div>

      <PageBody>
        {current.key === 'basics' ? <BasicsStep /> : null}
        {current.key === 'route' ? <RouteStep /> : null}
        {current.key === 'cargo' ? <CargoStep /> : null}
        {current.key === 'truck' ? <TruckStep value={truck} onChange={setTruck} /> : null}
        {current.key === 'docs' ? <DocsStep /> : null}
        {current.key === 'pricing' ? <PricingStep value={pricing} onChange={setPricing} /> : null}
      </PageBody>

      <ActionBar note="تُحفظ البيانات كمسودة تلقائياً. يمكنك العودة لاستكمالها في أي وقت.">
        <>
          <PrimaryCta size="sm" variant="secondary" href="/trips" linkAs={Link}>
            إلغاء
          </PrimaryCta>
          {step > 0 ? (
            <PrimaryCta size="sm" variant="secondary" onClick={() => setStep(step - 1)}>
              السابق
            </PrimaryCta>
          ) : null}
          {step < STEPS.length - 1 ? (
            <PrimaryCta size="sm" onClick={() => setStep(step + 1)}>
              التالي
            </PrimaryCta>
          ) : (
            <PrimaryCta
              size="sm"
              icon="check"
              disabled={!canAdvance}
              title={canAdvance ? 'نشر الرحلة' : 'اختر نوع السعر أولاً'}
            >
              نشر الرحلة
            </PrimaryCta>
          )}
        </>
      </ActionBar>
    </>
  );
}

function BasicsStep() {
  return (
    <Section title="البيانات الأساسية ومرجع الشحنة" subtitle="تُستخدم في البوليصة وكشوف الحساب">
      <FormGrid>
        <Field label="تاريخ الاستلام" required>
          <TextInput type="date" defaultValue="2026-07-24" />
        </Field>
        <Field label="وقت الاستلام المفضّل">
          <TextInput type="time" defaultValue="08:00" />
        </Field>
        <Field label="رقم أمر الشراء PO">
          <TextInput placeholder="PO-2026-0000" />
        </Field>
        <Field label="رقم الفاتورة">
          <TextInput placeholder="INV-2026-0000" />
        </Field>
        <Field label="رقم إذن التسليم">
          <TextInput placeholder="DN-2026-0000" />
        </Field>
        <Field label="مرجع داخلي للشركة" help="يظهر في التقارير وكشوف الحساب فقط.">
          <TextInput placeholder="اختياري" />
        </Field>
        <div style={{ gridColumn: '1 / -1' }}>
          <Field label="ملاحظات عامة">
            <TextArea placeholder="أي تعليمات خاصة للسائق أو لمشرف التحميل…" />
          </Field>
        </div>
      </FormGrid>
    </Section>
  );
}

function RouteStep() {
  return (
    <>
      <Section title="موقع الاستلام" subtitle="اختر من المواقع المحفوظة أو أدخل موقعاً جديداً">
        <div style={{ marginBottom: 16 }}>
          <ChipList>
            {SAVED_LOCATIONS.map((l) => (
              <Tag key={l.id} icon={l.isPort ? 'truck' : 'home'}>
                {l.label}
              </Tag>
            ))}
          </ChipList>
        </div>
        <FormGrid>
          <Field label="الدولة" required>
            <FormSelect defaultValue="sa">
              <option value="sa">السعودية</option>
              <option value="ae">الإمارات</option>
              <option value="kw">الكويت</option>
            </FormSelect>
          </Field>
          <Field label="المدينة" required>
            <FormSelect defaultValue="riyadh">
              <option value="riyadh">الرياض</option>
              <option value="jeddah">جدة</option>
              <option value="dammam">الدمام</option>
            </FormSelect>
          </Field>
          <div style={{ gridColumn: '1 / -1' }}>
            <Field label="العنوان التفصيلي" required>
              <TextInput placeholder="الحي، الشارع، رقم المستودع" />
            </Field>
          </div>
          <Field label="مشرف التحميل">
            <TextInput placeholder="الاسم" />
          </Field>
          <Field label="جوال المشرف">
            <TextInput inputMode="tel" placeholder="05X XXX XXXX" />
          </Field>
        </FormGrid>
      </Section>

      <Section title="موقع التسليم">
        <FormGrid>
          <Field label="الدولة" required>
            <FormSelect defaultValue="ae">
              <option value="sa">السعودية</option>
              <option value="ae">الإمارات</option>
              <option value="kw">الكويت</option>
            </FormSelect>
          </Field>
          <Field label="المدينة" required>
            <FormSelect defaultValue="dubai">
              <option value="dubai">دبي</option>
              <option value="abudhabi">أبوظبي</option>
            </FormSelect>
          </Field>
          <div style={{ gridColumn: '1 / -1' }}>
            <Field label="العنوان التفصيلي" required>
              <TextInput defaultValue="المنطقة الحرة جبل علي — القطاع 6" />
            </Field>
          </div>
        </FormGrid>
        <div style={{ marginTop: 14 }}>
          <AlertBanner tone="warning">
            موقع التسليم ميناء ويتطلب تصريح دخول. سيظهر التصريح في خطوة الوثائق كمطلوب لاحقاً قبل التحميل.
          </AlertBanner>
        </div>
      </Section>
    </>
  );
}

function CargoStep() {
  return (
    <Section title="تفاصيل الحمولة" subtitle="كلما كان الوصف أدق، كانت العروض أدق">
      <FormGrid>
        <Field label="نوع الشحنة" required>
          <FormSelect defaultValue="general">
            <option value="general">بضائع عامة</option>
            <option value="reefer">مواد غذائية مبردة</option>
            <option value="dangerous">مواد خطرة</option>
            <option value="oversized">حجم غير اعتيادي</option>
          </FormSelect>
        </Field>
        <Field label="الوزن الإجمالي" required>
          <TextInput inputMode="numeric" placeholder="بالطن" />
        </Field>
        <Field label="الأبعاد أو الحجم">
          <TextInput placeholder="الطول × العرض × الارتفاع" />
        </Field>
        <Field label="درجة الحرارة المطلوبة" help="تُترك فارغة لغير المبرّد.">
          <TextInput placeholder="مثال: 2° — 8°" />
        </Field>
        <div style={{ gridColumn: '1 / -1' }}>
          <Field label="وصف الحمولة" required>
            <TextArea placeholder="صف محتوى الشحنة بوضوح ليتمكن السائقون من تقييمها." />
          </Field>
        </div>
      </FormGrid>

      <div style={{ marginTop: 18 }}>
        <div
          style={{
            fontSize: 'var(--web-text-label)',
            fontWeight: 600,
            color: 'var(--lw-slate-600)',
            marginBottom: 10,
          }}
        >
          متطلبات مناولة خاصة
        </div>
        <ChipList>
          {['رافعة عند التحميل', 'رافعة عند التفريغ', 'تثبيت وربط إضافي', 'مواد قابلة للكسر', 'تحميل ليلي'].map((t) => (
            <Tag key={t}>{t}</Tag>
          ))}
        </ChipList>
      </div>
    </Section>
  );
}

function TruckStep({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const selected = TRUCK_TYPES.find((t) => t.key === value);

  return (
    <>
      <Section title="نوع الشاحنة المناسبة" subtitle="الأنواع الموصى بها مبنية على نوع الحمولة ووزنها">
        <ChoiceRow>
          {TRUCK_TYPES.map((t) => (
            <ChoiceCard
              key={t.key}
              icon="truck"
              title={t.title}
              body={t.body}
              selected={value === t.key}
              onSelect={() => onChange(t.key)}
              badge={t.recommended ? <StatusBadge tone="success">موصى بها</StatusBadge> : undefined}
            />
          ))}
        </ChoiceRow>
      </Section>

      {selected && !selected.recommended ? (
        <AlertBanner tone="warning">
          هذه الشاحنة لا تدعم الحمولة المختارة. اختر شاحنة موصى بها للمتابعة.
        </AlertBanner>
      ) : null}
    </>
  );
}

function DocsStep() {
  const rows: { name: string; when: string; tone: 'danger' | 'warning' | 'neutral'; label: string; icon: IconName }[] = [
    { name: 'فاتورة الشحنة', when: 'مطلوبة الآن قبل النشر', tone: 'danger', label: 'مطلوبة الآن', icon: 'document' },
    { name: 'شهادة المنشأ', when: 'مطلوبة الآن للشحن الدولي', tone: 'danger', label: 'مطلوبة الآن', icon: 'document' },
    { name: 'تصريح دخول ميناء جبل علي', when: 'مطلوبة لاحقاً قبل التحميل', tone: 'warning', label: 'مطلوبة لاحقاً', icon: 'upload' },
    { name: 'بيان التعبئة', when: 'مرفق اختياري', tone: 'neutral', label: 'اختيارية', icon: 'document' },
  ];

  return (
    <>
      <Section title="الوثائق والتصاريح">
        <Muted>
          الوثائق المطلوبة الآن تمنع النشر حتى ترفعها. المطلوبة لاحقاً لا تمنع النشر لكنها تمنع بدء التحميل.
        </Muted>
      </Section>

      <Section flush>
        {rows.map((r) => (
          <ListRow
            key={r.name}
            icon={r.icon}
            title={r.name}
            meta={r.when}
            side={
              <>
                <StatusBadge tone={r.tone}>{r.label}</StatusBadge>
                <PrimaryCta size="sm" variant="secondary" icon="upload">
                  رفع
                </PrimaryCta>
              </>
            }
          />
        ))}
      </Section>

      <Section title="البروكر / المخلّص الجمركي" subtitle="اختياري — يُستخدم للشحن الدولي فقط">
        <ChipList>
          {BROKERS.map((b) => (
            <Tag key={b.id}>
              <Icon name="user" size={14} />
              {b.name} · {b.portOrBorder}
            </Tag>
          ))}
        </ChipList>
      </Section>
    </>
  );
}

function PricingStep({ value, onChange }: { value: 'fixed' | 'tender' | null; onChange: (v: 'fixed' | 'tender') => void }) {
  return (
    <>
      <Section title="نوع السعر" subtitle="اختيار نوع السعر إلزامي قبل النشر">
        <ChoiceRow>
          <ChoiceCard
            icon="card"
            title="سعر ثابت"
            body="تحدّد أنت السعر الأساسي، ويقبله السائق أو يرفضه. لا يقدّم السائق سعراً بديلاً."
            selected={value === 'fixed'}
            onSelect={() => onChange('fixed')}
          />
          <ChoiceCard
            icon="clock"
            title="مناقصة مفتوحة"
            body="يقدّم كل سائق مؤهل عرض سعر واحداً، وتختار أنت العرض المناسب."
            selected={value === 'tender'}
            onSelect={() => onChange('tender')}
          />
        </ChoiceRow>
      </Section>

      {value === 'fixed' ? (
        <Section title="السعر الأساسي">
          <FormGrid>
            <Field
              label="السعر الأساسي (ر.س)"
              required
              help="هذا هو السعر الأساسي فقط. تُضاف الرسوم والعمولة وضريبة القيمة المضافة عند الدفع."
            >
              <TextInput inputMode="numeric" placeholder="0" style={{ fontFamily: 'var(--font-latin)', direction: 'ltr', textAlign: 'right' }} />
            </Field>
          </FormGrid>
          <div style={{ marginTop: 14 }}>
            <AlertBanner tone="info" icon="document">
              لا تعرض المنصة سعراً مرجعياً أو تقديرياً. السعر الذي تحدّده هو ما يراه السائقون.
            </AlertBanner>
          </div>
        </Section>
      ) : null}

      {value === 'tender' ? (
        <Section title="إعدادات المناقصة">
          <FormGrid>
            <Field label="مدة استقبال العروض" required>
              <FormSelect defaultValue="12">
                <option value="6">6 ساعات</option>
                <option value="12">12 ساعة</option>
                <option value="24">24 ساعة</option>
              </FormSelect>
            </Field>
          </FormGrid>
          <div style={{ marginTop: 14 }}>
            <AlertBanner tone="info" icon="document">
              لا تعرض المنصة سعراً مرجعياً. كل مبلغ سيصلك هو عرض السائق نفسه.
            </AlertBanner>
          </div>
        </Section>
      ) : null}

      {value === null ? (
        <AlertBanner tone="warning">اختر نوع السعر لتتمكّن من نشر الرحلة.</AlertBanner>
      ) : null}
    </>
  );
}
