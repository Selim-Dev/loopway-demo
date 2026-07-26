'use client';

import * as React from 'react';
import {
  ActionBar,
  AlertBanner,
  CellPrimary,
  ConfirmDialog,
  DataTable,
  DetailList,
  DetailRow,
  EmptyState,
  ErrorState,
  Field,
  FormGrid,
  LoadingState,
  NoResultsState,
  PageBody,
  PrimaryCta,
  Section,
  SelectField,
  Split,
  TableCard,
  TextInput,
  ViewStateLabel,
  type PricingSettings,
} from '@loopway/ui';
import { AdminHeader } from '@/components/AdminHeader';
import { resolveMode, viewOptions, type AdminViewState } from '@/components/viewState';
import { useAdminStore } from '@/store/AdminStore';

/**
 * التسعير والرسوم والضرائب — SRS M04-E09.
 *
 * BR-003: a fixed price is the customer's Base Price only; the platform adds
 * fees, commission and VAT at payment. These are the numbers that do that
 * adding — which is why the screen shows a live worked example rather than
 * asking an operator to trust the arithmetic, and why saving needs a confirm.
 */

const EXAMPLE_BASE = 3000;

export function PricingScreen() {
  const { state, dispatch } = useAdminStore();
  const [draft, setDraft] = React.useState<PricingSettings>(state.pricing);
  const [confirming, setConfirming] = React.useState(false);
  const [view, setView] = React.useState<AdminViewState>('default');
  const mode = resolveMode(view, state.pricing.countryOverrides.length);

  const set = <K extends keyof PricingSettings>(key: K, value: PricingSettings[K]) =>
    setDraft((d) => ({ ...d, [key]: value }));

  const dirty = React.useMemo(
    () => (['platformFee', 'commissionPercent', 'vatPercent', 'paymentFeePercent', 'minimumTripValue', 'maximumTripValue'] as const)
      .some((k) => draft[k] !== state.pricing[k]),
    [draft, state.pricing],
  );

  // The worked example. Every figure the customer eventually sees is derived
  // here, in the same order the payment engine applies them.
  const n = (s: string) => Number(String(s).replace(/,/g, '')) || 0;
  const fee = n(draft.platformFee);
  const commission = (EXAMPLE_BASE * n(draft.commissionPercent)) / 100;
  const paymentFee = ((EXAMPLE_BASE + fee + commission) * n(draft.paymentFeePercent)) / 100;
  const beforeVat = EXAMPLE_BASE + fee + commission + paymentFee;
  const vat = (beforeVat * n(draft.vatPercent)) / 100;
  const total = beforeVat + vat;
  const fmt = (x: number) => x.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <>
      <AdminHeader title="التسعير والرسوم والضرائب" subtitle="رسوم المنصة والعمولة وضريبة القيمة المضافة ورسوم الدفع" />

      <PageBody>
        {mode === 'loading' ? <LoadingState rows={4} label="جارٍ تحميل إعدادات التسعير…" /> : null}
        {mode === 'error' ? (
          <ErrorState
            title="تعذّر تحميل إعدادات التسعير"
            body="حدث خطأ أثناء جلب الرسوم والنسب. تحقّق من اتصالك ثم أعد المحاولة."
            onRetry={() => setView('default')}
          />
        ) : null}
        {mode === 'empty' ? (
          <EmptyState glyph="card" title="لا توجد إعدادات تسعير" body="اضبط رسوم المنصة والعمولة والضريبة لتفعيل الدفع." />
        ) : null}
        {mode === 'noresults' ? <NoResultsState onClearFilters={() => setView('default')} /> : null}

        {mode === 'list' ? (
        <>
        <AlertBanner tone="warning">
          هذه الإعدادات تؤثر مباشرة على كل عملية دفع جديدة. الرحلات المدفوعة مسبقاً تحتفظ بأسعارها.
        </AlertBanner>

        <Split>
          <Section title="الرسوم والنسب">
            <FormGrid>
              <Field label="رسوم المنصة الثابتة" required help="تُضاف لكل رحلة بغض النظر عن قيمتها." htmlFor="fee">
                <TextInput
                  id="fee"
                  ltr
                  unit="ر.س"
                  inputMode="numeric"
                  value={draft.platformFee}
                  onChange={(e) => set('platformFee', e.target.value.replace(/[^0-9.]/g, ''))}
                />
              </Field>
              <Field label="نسبة العمولة" required help="تُحتسب على السعر الأساسي قبل الضريبة." htmlFor="comm">
                <TextInput
                  id="comm"
                  ltr
                  unit="%"
                  inputMode="numeric"
                  value={draft.commissionPercent}
                  onChange={(e) => set('commissionPercent', e.target.value.replace(/[^0-9.]/g, ''))}
                />
              </Field>
              <Field label="ضريبة القيمة المضافة" required htmlFor="vat">
                <TextInput
                  id="vat"
                  ltr
                  unit="%"
                  inputMode="numeric"
                  value={draft.vatPercent}
                  onChange={(e) => set('vatPercent', e.target.value.replace(/[^0-9.]/g, ''))}
                />
              </Field>
              <Field label="رسوم بوابة الدفع" required help="نسبة تحمّلها المنصة عن كل عملية بطاقة." htmlFor="pfee">
                <TextInput
                  id="pfee"
                  ltr
                  unit="%"
                  inputMode="numeric"
                  value={draft.paymentFeePercent}
                  onChange={(e) => set('paymentFeePercent', e.target.value.replace(/[^0-9.]/g, ''))}
                />
              </Field>
              <Field label="الحد الأدنى لقيمة الرحلة" required htmlFor="min">
                <TextInput
                  id="min"
                  ltr
                  unit="ر.س"
                  inputMode="numeric"
                  value={draft.minimumTripValue}
                  onChange={(e) => set('minimumTripValue', e.target.value.replace(/[^0-9.,]/g, ''))}
                />
              </Field>
              <Field label="الحد الأعلى لقيمة الرحلة" required htmlFor="max">
                <TextInput
                  id="max"
                  ltr
                  unit="ر.س"
                  inputMode="numeric"
                  value={draft.maximumTripValue}
                  onChange={(e) => set('maximumTripValue', e.target.value.replace(/[^0-9.,]/g, ''))}
                />
              </Field>
            </FormGrid>
          </Section>

          <Section title="مثال محسوب" subtitle={`على سعر أساسي ${EXAMPLE_BASE.toLocaleString('en-US')} ر.س`}>
            <DetailList>
              <DetailRow label="السعر الأساسي (عرض السائق)">
                <span className="lw-ltr">{fmt(EXAMPLE_BASE)}</span> ر.س
              </DetailRow>
              <DetailRow label="رسوم المنصة">
                <span className="lw-ltr">{fmt(fee)}</span> ر.س
              </DetailRow>
              <DetailRow label={`العمولة (${draft.commissionPercent}%)`}>
                <span className="lw-ltr">{fmt(commission)}</span> ر.س
              </DetailRow>
              <DetailRow label={`رسوم الدفع (${draft.paymentFeePercent}%)`}>
                <span className="lw-ltr">{fmt(paymentFee)}</span> ر.س
              </DetailRow>
              <DetailRow label={`ضريبة القيمة المضافة (${draft.vatPercent}%)`}>
                <span className="lw-ltr">{fmt(vat)}</span> ر.س
              </DetailRow>
              <DetailRow label="الإجمالي الذي يدفعه العميل">
                <strong>
                  <span className="lw-ltr">{fmt(total)}</span> ر.س
                </strong>
              </DetailRow>
            </DetailList>

            <div style={{ marginTop: 16 }}>
              <AlertBanner tone="info" icon="document">
                لا تعرض المنصة هذا الحساب للعميل كسعر مرجعي. يظهر فقط عند الدفع بعد اختيار السائق.
              </AlertBanner>
            </div>
          </Section>
        </Split>

        <Section title="استثناءات حسب الدولة" subtitle="تتجاوز النسب العامة أعلاه" flush>
          <TableCard>
            <DataTable
              head={
                <>
                  <th>الدولة</th>
                  <th>نسبة العمولة</th>
                  <th>ضريبة القيمة المضافة</th>
                  <th />
                </>
              }
            >
              {draft.countryOverrides.map((o) => (
                <tr key={o.countryId}>
                  <td>
                    <CellPrimary>{o.countryName}</CellPrimary>
                  </td>
                  <td>
                    <CellPrimary ltr>{o.commissionPercent}%</CellPrimary>
                  </td>
                  <td>
                    <CellPrimary ltr>{o.vatPercent}%</CellPrimary>
                  </td>
                  <td style={{ width: 100 }}>
                    <PrimaryCta size="sm" variant="secondary">
                      تعديل
                    </PrimaryCta>
                  </td>
                </tr>
              ))}
            </DataTable>
          </TableCard>
        </Section>
        </>
        ) : null}
      </PageBody>

      <ActionBar note={dirty ? 'لديك تغييرات غير محفوظة على إعدادات تمسّ كل عملية دفع جديدة.' : 'لا توجد تغييرات.'}>
        <ViewStateLabel>حالة العرض:</ViewStateLabel>
        <SelectField
          value={view}
          onChange={(v) => setView(v as AdminViewState)}
          options={viewOptions('لا توجد إعدادات تسعير')}
          variant="quiet"
          aria-label="حالة العرض"
        />
        <PrimaryCta size="sm" variant="secondary" disabled={!dirty} onClick={() => setDraft(state.pricing)}>
          تجاهل التغييرات
        </PrimaryCta>
        <PrimaryCta size="sm" icon="check" disabled={!dirty} onClick={() => setConfirming(true)}>
          حفظ الإعدادات
        </PrimaryCta>
      </ActionBar>

      <ConfirmDialog
        open={confirming}
        onClose={() => setConfirming(false)}
        onConfirm={() => {
          dispatch({ type: 'pricing/update', next: draft });
          setConfirming(false);
        }}
        tone="warning"
        title="حفظ إعدادات التسعير"
        body="ستسري النسب الجديدة على كل عملية دفع تبدأ بعد الحفظ. الرحلات المدفوعة لا تتأثر."
        confirmLabel="تأكيد الحفظ"
        summary={
          <>
            الإجمالي على مثال <span className="lw-ltr">{fmt(EXAMPLE_BASE)}</span> ر.س يصبح{' '}
            <span className="lw-ltr">{fmt(total)}</span> ر.س
          </>
        }
      />
    </>
  );
}
