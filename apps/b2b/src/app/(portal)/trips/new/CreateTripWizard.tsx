'use client';

import * as React from 'react';
import Link from 'next/link';
import { AlertBanner, Icon, PrimaryCta, StatusBadge, type IconName } from '@loopway/ui';
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

      <div className={styles.body}>
        {current.key === 'basics' ? <BasicsStep /> : null}
        {current.key === 'route' ? <RouteStep /> : null}
        {current.key === 'cargo' ? <CargoStep /> : null}
        {current.key === 'truck' ? <TruckStep value={truck} onChange={setTruck} /> : null}
        {current.key === 'docs' ? <DocsStep /> : null}
        {current.key === 'pricing' ? <PricingStep value={pricing} onChange={setPricing} /> : null}
      </div>

      <div className={styles.actionBar}>
        <span className={styles.actionBarNote}>
          تُحفظ البيانات كمسودة تلقائياً. يمكنك العودة لاستكمالها في أي وقت.
        </span>
        <div className={styles.actionBarGroup}>
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
        </div>
      </div>
    </>
  );
}

function Section({ title, sub, children }: { title: string; sub?: string; children: React.ReactNode }) {
  return (
    <section className={styles.section}>
      <div className={styles.sectionHead}>
        <div>
          <div className={styles.sectionTitle}>{title}</div>
          {sub ? <div className={styles.sectionSub}>{sub}</div> : null}
        </div>
      </div>
      <div className={styles.sectionBody}>{children}</div>
    </section>
  );
}

function Field({ label, required, help, children }: { label: string; required?: boolean; help?: string; children: React.ReactNode }) {
  return (
    <div className={styles.field}>
      <label className={styles.fieldLabel}>
        {label} {required ? <span className={styles.required}>*</span> : null}
      </label>
      {children}
      {help ? <span className={styles.help}>{help}</span> : null}
    </div>
  );
}

function BasicsStep() {
  return (
    <Section title="البيانات الأساسية ومرجع الشحنة" sub="تُستخدم في البوليصة وكشوف الحساب">
      <div className={styles.formGrid}>
        <Field label="تاريخ الاستلام" required>
          <input className={styles.control} type="date" defaultValue="2026-07-24" />
        </Field>
        <Field label="وقت الاستلام المفضّل">
          <input className={styles.control} type="time" defaultValue="08:00" />
        </Field>
        <Field label="رقم أمر الشراء PO">
          <input className={styles.control} placeholder="PO-2026-0000" />
        </Field>
        <Field label="رقم الفاتورة">
          <input className={styles.control} placeholder="INV-2026-0000" />
        </Field>
        <Field label="رقم إذن التسليم">
          <input className={styles.control} placeholder="DN-2026-0000" />
        </Field>
        <Field label="مرجع داخلي للشركة" help="يظهر في التقارير وكشوف الحساب فقط.">
          <input className={styles.control} placeholder="اختياري" />
        </Field>
        <div style={{ gridColumn: '1 / -1' }}>
          <Field label="ملاحظات عامة">
            <textarea className={`${styles.control} ${styles.textarea}`} placeholder="أي تعليمات خاصة للسائق أو لمشرف التحميل…" />
          </Field>
        </div>
      </div>
    </Section>
  );
}

function RouteStep() {
  return (
    <>
      <Section title="موقع الاستلام" sub="اختر من المواقع المحفوظة أو أدخل موقعاً جديداً">
        <div className={styles.chipList} style={{ marginBottom: 16 }}>
          {SAVED_LOCATIONS.map((l) => (
            <span key={l.id} className={styles.tag}>
              <Icon name={l.isPort ? 'truck' : 'home'} size={14} />
              {l.label}
            </span>
          ))}
        </div>
        <div className={styles.formGrid}>
          <Field label="الدولة" required>
            <select className={styles.control} defaultValue="sa">
              <option value="sa">السعودية</option>
              <option value="ae">الإمارات</option>
              <option value="kw">الكويت</option>
            </select>
          </Field>
          <Field label="المدينة" required>
            <select className={styles.control} defaultValue="riyadh">
              <option value="riyadh">الرياض</option>
              <option value="jeddah">جدة</option>
              <option value="dammam">الدمام</option>
            </select>
          </Field>
          <div style={{ gridColumn: '1 / -1' }}>
            <Field label="العنوان التفصيلي" required>
              <input className={styles.control} placeholder="الحي، الشارع، رقم المستودع" />
            </Field>
          </div>
          <Field label="مشرف التحميل">
            <input className={styles.control} placeholder="الاسم" />
          </Field>
          <Field label="جوال المشرف">
            <input className={styles.control} inputMode="tel" placeholder="05X XXX XXXX" />
          </Field>
        </div>
      </Section>

      <Section title="موقع التسليم">
        <div className={styles.formGrid}>
          <Field label="الدولة" required>
            <select className={styles.control} defaultValue="ae">
              <option value="sa">السعودية</option>
              <option value="ae">الإمارات</option>
              <option value="kw">الكويت</option>
            </select>
          </Field>
          <Field label="المدينة" required>
            <select className={styles.control} defaultValue="dubai">
              <option value="dubai">دبي</option>
              <option value="abudhabi">أبوظبي</option>
            </select>
          </Field>
          <div style={{ gridColumn: '1 / -1' }}>
            <Field label="العنوان التفصيلي" required>
              <input className={styles.control} defaultValue="المنطقة الحرة جبل علي — القطاع 6" />
            </Field>
          </div>
        </div>
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
    <Section title="تفاصيل الحمولة" sub="كلما كان الوصف أدق، كانت العروض أدق">
      <div className={styles.formGrid}>
        <Field label="نوع الشحنة" required>
          <select className={styles.control} defaultValue="general">
            <option value="general">بضائع عامة</option>
            <option value="reefer">مواد غذائية مبردة</option>
            <option value="dangerous">مواد خطرة</option>
            <option value="oversized">حجم غير اعتيادي</option>
          </select>
        </Field>
        <Field label="الوزن الإجمالي" required>
          <input className={styles.control} inputMode="numeric" placeholder="بالطن" />
        </Field>
        <Field label="الأبعاد أو الحجم">
          <input className={styles.control} placeholder="الطول × العرض × الارتفاع" />
        </Field>
        <Field label="درجة الحرارة المطلوبة" help="تُترك فارغة لغير المبرّد.">
          <input className={styles.control} placeholder="مثال: 2° — 8°" />
        </Field>
        <div style={{ gridColumn: '1 / -1' }}>
          <Field label="وصف الحمولة" required>
            <textarea className={`${styles.control} ${styles.textarea}`} placeholder="صف محتوى الشحنة بوضوح ليتمكن السائقون من تقييمها." />
          </Field>
        </div>
      </div>

      <div style={{ marginTop: 18 }}>
        <div className={styles.fieldLabel} style={{ marginBottom: 10 }}>متطلبات مناولة خاصة</div>
        <div className={styles.chipList}>
          {['رافعة عند التحميل', 'رافعة عند التفريغ', 'تثبيت وربط إضافي', 'مواد قابلة للكسر', 'تحميل ليلي'].map((t) => (
            <span key={t} className={styles.tag}>{t}</span>
          ))}
        </div>
      </div>
    </Section>
  );
}

function TruckStep({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const selected = TRUCK_TYPES.find((t) => t.key === value);

  return (
    <>
      <Section title="نوع الشاحنة المناسبة" sub="الأنواع الموصى بها مبنية على نوع الحمولة ووزنها">
        <div className={`${styles.choiceRow} ${styles.choiceRow2}`}>
          {TRUCK_TYPES.map((t) => (
            <button
              key={t.key}
              type="button"
              className={value === t.key ? `${styles.choice} ${styles.choiceActive}` : styles.choice}
              onClick={() => onChange(t.key)}
            >
              <span className={styles.glyph} style={{ background: 'transparent' }}>
                <Icon name="truck" size={22} />
              </span>
              <span style={{ flex: 1, minWidth: 0 }}>
                <span className={styles.choiceTitle}>
                  {t.title}
                  {t.recommended ? (
                    <span style={{ marginRight: 8 }}>
                      <StatusBadge tone="success">موصى بها</StatusBadge>
                    </span>
                  ) : null}
                </span>
                <span className={styles.choiceBody}>{t.body}</span>
              </span>
            </button>
          ))}
        </div>
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
        <div className={styles.help} style={{ marginBottom: 4 }}>
          الوثائق المطلوبة الآن تمنع النشر حتى ترفعها. المطلوبة لاحقاً لا تمنع النشر لكنها تمنع بدء التحميل.
        </div>
      </Section>

      <section className={styles.section}>
        <div className={styles.sectionBodyFlush}>
          {rows.map((r) => (
            <div key={r.name} className={styles.row}>
              <span className={styles.glyph}>
                <Icon name={r.icon} size={18} />
              </span>
              <div className={styles.rowMain}>
                <div className={styles.rowTitle}>{r.name}</div>
                <div className={styles.rowMeta}>{r.when}</div>
              </div>
              <div className={styles.rowSide}>
                <StatusBadge tone={r.tone}>{r.label}</StatusBadge>
                <PrimaryCta size="sm" variant="secondary" icon="upload">
                  رفع
                </PrimaryCta>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Section title="البروكر / المخلّص الجمركي" sub="اختياري — يُستخدم للشحن الدولي فقط">
        <div className={styles.chipList}>
          {BROKERS.map((b) => (
            <span key={b.id} className={styles.tag}>
              <Icon name="user" size={14} />
              {b.name} · {b.portOrBorder}
            </span>
          ))}
        </div>
      </Section>
    </>
  );
}

function PricingStep({ value, onChange }: { value: 'fixed' | 'tender' | null; onChange: (v: 'fixed' | 'tender') => void }) {
  return (
    <>
      <Section title="نوع السعر" sub="اختيار نوع السعر إلزامي قبل النشر">
        <div className={`${styles.choiceRow} ${styles.choiceRow2}`}>
          <button
            type="button"
            className={value === 'fixed' ? `${styles.choice} ${styles.choiceActive}` : styles.choice}
            onClick={() => onChange('fixed')}
          >
            <span className={styles.glyph} style={{ background: 'transparent' }}>
              <Icon name="card" size={22} />
            </span>
            <span>
              <span className={styles.choiceTitle}>سعر ثابت</span>
              <span className={styles.choiceBody}>
                تحدّد أنت السعر الأساسي، ويقبله السائق أو يرفضه. لا يقدّم السائق سعراً بديلاً.
              </span>
            </span>
          </button>

          <button
            type="button"
            className={value === 'tender' ? `${styles.choice} ${styles.choiceActive}` : styles.choice}
            onClick={() => onChange('tender')}
          >
            <span className={styles.glyph} style={{ background: 'transparent' }}>
              <Icon name="clock" size={22} />
            </span>
            <span>
              <span className={styles.choiceTitle}>مناقصة مفتوحة</span>
              <span className={styles.choiceBody}>
                يقدّم كل سائق مؤهل عرض سعر واحداً، وتختار أنت العرض المناسب.
              </span>
            </span>
          </button>
        </div>
      </Section>

      {value === 'fixed' ? (
        <Section title="السعر الأساسي">
          <div className={styles.formGrid}>
            <Field
              label="السعر الأساسي (ر.س)"
              required
              help="هذا هو السعر الأساسي فقط. تُضاف الرسوم والعمولة وضريبة القيمة المضافة عند الدفع."
            >
              <input className={styles.control} inputMode="numeric" placeholder="0" style={{ fontFamily: 'var(--font-latin)', direction: 'ltr', textAlign: 'right' }} />
            </Field>
          </div>
          <div style={{ marginTop: 14 }}>
            <AlertBanner tone="info" icon="document">
              لا تعرض المنصة سعراً مرجعياً أو تقديرياً. السعر الذي تحدّده هو ما يراه السائقون.
            </AlertBanner>
          </div>
        </Section>
      ) : null}

      {value === 'tender' ? (
        <Section title="إعدادات المناقصة">
          <div className={styles.formGrid}>
            <Field label="مدة استقبال العروض" required>
              <select className={styles.control} defaultValue="12">
                <option value="6">6 ساعات</option>
                <option value="12">12 ساعة</option>
                <option value="24">24 ساعة</option>
              </select>
            </Field>
          </div>
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
