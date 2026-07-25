import { AlertBanner, Card, Icon, PageHeader } from '@loopway/ui';
import { findSection } from '@/config/sections';
import styles from './SectionPage.module.css';

/**
 * Placeholder for a not-yet-built Admin section.
 *
 * It is deliberately informative rather than a blank "قريباً": it states which
 * SRS requirement the section implements and which @loopway/ui patterns it is
 * expected to reuse, so whoever builds it does not re-derive the design.
 * Replace the whole component when the real screen lands.
 */
export function SectionPage({ href }: { href: string }) {
  const section = findSection(href);
  if (!section) return null;

  return (
    <>
      <PageHeader
        title={section.label}
        subtitle={`${section.srs} · ${section.purpose}`}
        accountName="فريق التشغيل"
        accountId="LW-ADM-0001"
        accountInitial="ت"
        notificationCount={0}
      />

      <AlertBanner tone="info" icon="document">
        هذا القسم مُهيّأ في التوجيه ولم تُبنَ شاشاته بعد. الواجهة النهائية ستُبنى على نفس طبقة التصميم المشتركة.
      </AlertBanner>

      <Card className={styles.card}>
        <div className={styles.head}>
          <span className={styles.glyph}>
            <Icon name="document" size={22} />
          </span>
          <div>
            <div className={styles.title}>ما الذي يغطيه هذا القسم</div>
            <div className={styles.body}>{section.purpose}</div>
          </div>
        </div>

        <div className={styles.block}>
          <div className={styles.blockTitle}>المرجع في وثيقة المتطلبات</div>
          <div className={styles.body}>
            <span className="lw-ltr">{section.srs}</span> — راجع القسم المقابل في
            <span className="lw-ltr"> LoopWay_Vlora_SRS_UI_Ready_AR.md</span>.
          </div>
        </div>

        <div className={styles.block}>
          <div className={styles.blockTitle}>الأنماط الجاهزة لإعادة الاستخدام</div>
          <div className={styles.tags}>
            {section.patterns.map((p) => (
              <span key={p} className={styles.tag}>
                {p}
              </span>
            ))}
          </div>
          <div className={styles.body} style={{ marginTop: 10 }}>
            جميعها موجودة في <span className="lw-ltr">@loopway/ui</span> وموثّقة في
            <span className="lw-ltr"> docs/design-system/06-components.md</span> و
            <span className="lw-ltr">07-patterns.md</span>. لا تُنشئ أنماطاً جديدة قبل مراجعة
            <span className="lw-ltr"> 10-admin-portal-guide.md</span>.
          </div>
        </div>
      </Card>
    </>
  );
}
