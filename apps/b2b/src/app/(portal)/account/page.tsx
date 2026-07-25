import type { Metadata } from 'next';
import Link from 'next/link';
import { AvatarInitial, Icon, PrimaryCta, StatusBadge } from '@loopway/ui';
import { Header } from '@/components/Header';
import { BROKERS, COMPANY, SAVED_LOCATIONS } from '@/mocks/company';
import { COMPANY_DOCUMENTS } from '@/mocks/workspace';
import styles from '../derived.module.css';
import { AccountTabs } from './AccountTabs';

export const metadata: Metadata = { title: 'الملف الشخصي — LoopWay' };

/** DERIVED, NOT DESIGNED — SRS M03-E01-F02 overview. */
export default function AccountPage() {
  return (
    <>
      <Header title="الملف الشخصي وإعدادات البروكر" subtitle="بيانات الشركة والوثائق والمواقع والمخلّصين الجمركيين" />
      <div className={styles.body}>
        <AccountTabs />

        <div className={styles.split}>
          <section className={styles.section}>
            <div className={styles.sectionHead}>
              <span className={styles.sectionTitle}>حساب الشركة</span>
              <Link href="/account/company" className={styles.link}>
                تعديل البيانات
              </Link>
            </div>
            <div className={styles.sectionBody}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
                <AvatarInitial initial={COMPANY.initial} size={52} fontSize={20} />
                <div>
                  <div style={{ fontSize: 17, fontWeight: 800, color: 'var(--lw-navy-900)' }}>{COMPANY.companyName}</div>
                  <div className={styles.rowMeta}>
                    <span className="lw-ltr">{COMPANY.accountId}</span> · {COMPANY.planName}
                  </div>
                </div>
              </div>

              <div className={styles.kv}>
                <span className={styles.kvKey}>المفوّض بالتواصل</span>
                <span className={styles.kvValue}>{COMPANY.authorizedContact}</span>
              </div>
              <div className={styles.kv}>
                <span className={styles.kvKey}>السجل التجاري</span>
                <span className={styles.kvValue}><span className="lw-ltr">{COMPANY.commercialRegistration}</span></span>
              </div>
              <div className={styles.kv}>
                <span className={styles.kvKey}>الرقم الضريبي</span>
                <span className={styles.kvValue}><span className="lw-ltr">{COMPANY.vatNumber}</span></span>
              </div>
              <div className={styles.kv}>
                <span className={styles.kvKey}>العنوان الوطني</span>
                <span className={styles.kvValue}>{COMPANY.nationalAddress}</span>
              </div>
              <div className={styles.kv}>
                <span className={styles.kvKey}>الحد الأقصى للرحلات المتزامنة</span>
                <span className={styles.kvValue}><span className="lw-ltr">{COMPANY.maxConcurrent}</span> رحلات</span>
              </div>
            </div>
          </section>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <section className={styles.section}>
              <div className={styles.sectionHead}>
                <span className={styles.sectionTitle}>وثائق الشركة</span>
                <Link href="/account/documents" className={styles.link}>
                  عرض الأرشيف
                </Link>
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
                        {d.expiryDate ? `تنتهي في ${d.expiryDate}` : `رُفعت في ${d.uploadedAt}`}
                      </div>
                    </div>
                    <StatusBadge tone="success">معتمدة</StatusBadge>
                  </div>
                ))}
              </div>
            </section>

            <section className={styles.section}>
              <div className={styles.sectionHead}>
                <span className={styles.sectionTitle}>اختصارات</span>
              </div>
              <div className={styles.sectionBodyFlush}>
                <Link href="/account/brokers" className={`${styles.row} ${styles.rowHover}`}>
                  <span className={styles.glyph}>
                    <Icon name="user" size={18} />
                  </span>
                  <div className={styles.rowMain}>
                    <div className={styles.rowTitle}>البروكرز المحفوظين</div>
                    <div className={styles.rowMeta}>{BROKERS.length} مخلّصون جمركيون</div>
                  </div>
                  <Icon name="chevronLeft" size={16} style={{ color: 'var(--lw-slate-300)' }} />
                </Link>
                <Link href="/account/locations" className={`${styles.row} ${styles.rowHover}`}>
                  <span className={styles.glyph}>
                    <Icon name="home" size={18} />
                  </span>
                  <div className={styles.rowMain}>
                    <div className={styles.rowTitle}>المواقع المحفوظة</div>
                    <div className={styles.rowMeta}>{SAVED_LOCATIONS.length} مستودعات وموانئ</div>
                  </div>
                  <Icon name="chevronLeft" size={16} style={{ color: 'var(--lw-slate-300)' }} />
                </Link>
                <Link href="/settings" className={`${styles.row} ${styles.rowHover}`}>
                  <span className={styles.glyph}>
                    <Icon name="gear" size={18} />
                  </span>
                  <div className={styles.rowMain}>
                    <div className={styles.rowTitle}>الإعدادات والباقة</div>
                    <div className={styles.rowMeta}>{COMPANY.planName}</div>
                  </div>
                  <Icon name="chevronLeft" size={16} style={{ color: 'var(--lw-slate-300)' }} />
                </Link>
              </div>
            </section>

            <PrimaryCta size="sm" variant="secondary" href="/login" linkAs={Link}>
              تسجيل الخروج
            </PrimaryCta>
          </div>
        </div>
      </div>
    </>
  );
}
