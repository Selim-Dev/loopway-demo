import type { Metadata } from 'next';
import { AlertBanner, Icon, PrimaryCta, StatusBadge } from '@loopway/ui';
import { Header } from '@/components/Header';
import { COMPANY } from '@/mocks/company';
import { COMPANY_DOCUMENTS } from '@/mocks/workspace';
import styles from '../../derived.module.css';
import { AccountTabs } from '../AccountTabs';

export const metadata: Metadata = { title: 'بيانات الشركة — LoopWay' };

/** DERIVED, NOT DESIGNED — SRS M03-E01-F02. */
export default function CompanyPage() {
  return (
    <>
      <Header title="بيانات ووثائق الشركة" subtitle="تُستخدم في البوليصة والفواتير الضريبية" />
      <div className={styles.body}>
        <AccountTabs />

        <section className={styles.section}>
          <div className={styles.sectionHead}>
            <span className={styles.sectionTitle}>البيانات الأساسية</span>
            <PrimaryCta size="sm">حفظ التغييرات</PrimaryCta>
          </div>
          <div className={styles.sectionBody}>
            <div className={styles.formGrid}>
              <div className={styles.field}>
                <label className={styles.fieldLabel}>اسم الشركة <span className={styles.required}>*</span></label>
                <input className={styles.control} defaultValue={COMPANY.companyName} />
              </div>
              <div className={styles.field}>
                <label className={styles.fieldLabel}>رقم السجل التجاري <span className={styles.required}>*</span></label>
                <input className={styles.control} defaultValue={COMPANY.commercialRegistration} style={{ fontFamily: 'var(--font-latin)', direction: 'ltr', textAlign: 'right' }} />
              </div>
              <div className={styles.field}>
                <label className={styles.fieldLabel}>الرقم الضريبي <span className={styles.required}>*</span></label>
                <input className={styles.control} defaultValue={COMPANY.vatNumber} style={{ fontFamily: 'var(--font-latin)', direction: 'ltr', textAlign: 'right' }} />
              </div>
              <div className={styles.field}>
                <label className={styles.fieldLabel}>المفوّض بالتواصل <span className={styles.required}>*</span></label>
                <input className={styles.control} defaultValue={COMPANY.authorizedContact} />
              </div>
              <div style={{ gridColumn: '1 / -1' }} className={styles.field}>
                <label className={styles.fieldLabel}>العنوان الوطني <span className={styles.required}>*</span></label>
                <input className={styles.control} defaultValue={COMPANY.nationalAddress} />
              </div>
            </div>
          </div>
        </section>

        <AlertBanner tone="warning">
          السجل التجاري ينتهي في 14 سبتمبر 2026. جدّد الوثيقة قبل انتهائها لتفادي إيقاف إنشاء رحلات جديدة.
        </AlertBanner>

        <section className={styles.section}>
          <div className={styles.sectionHead}>
            <span className={styles.sectionTitle}>الوثائق الرسمية</span>
            <PrimaryCta size="sm" variant="secondary" icon="upload">
              رفع وثيقة
            </PrimaryCta>
          </div>
          <div className={styles.sectionBodyFlush}>
            {COMPANY_DOCUMENTS.map((d) => (
              <div key={d.id} className={styles.row}>
                <span className={styles.glyph}>
                  <Icon name="document" size={18} />
                </span>
                <div className={styles.rowMain}>
                  <div className={styles.rowTitle}>{d.documentType}</div>
                  <div className={styles.rowMeta}>
                    رُفعت في {d.uploadedAt} · {d.sizeLabel}
                    {d.expiryDate ? ` · تنتهي في ${d.expiryDate}` : ''}
                  </div>
                </div>
                <div className={styles.rowSide}>
                  <StatusBadge tone={d.expiryDate ? 'warning' : 'success'}>
                    {d.expiryDate ? 'تقترب من الانتهاء' : 'معتمدة'}
                  </StatusBadge>
                  <Icon name="download" size={17} style={{ color: 'var(--lw-slate-400)' }} />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
