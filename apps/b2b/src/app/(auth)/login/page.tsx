import type { Metadata } from 'next';
import Link from 'next/link';
import { Icon, LoopwayMark } from '@loopway/ui';
import styles from '../auth.module.css';

export const metadata: Metadata = { title: 'دخول الشركة — LoopWay' };

/** DERIVED, NOT DESIGNED — SRS M03-E01-F01 (دخول الشركة والتحقق). */
export default function LoginPage() {
  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.brand}>
          <LoopwayMark width={46} />
          <span className={styles.brandText}>لوحة الشركات</span>
        </div>

        <h1 className={styles.title}>دخول حساب الشركة</h1>
        <p className={styles.subtitle}>
          أدخل رقم جوال المفوّض المسجّل لدينا وسنرسل لك رمز تحقق لمرة واحدة.
        </p>

        <label className={styles.label} htmlFor="mobile">
          رقم الجوال
        </label>
        <input id="mobile" className={styles.input} inputMode="tel" placeholder="05X XXX XXXX" defaultValue="" />

        <Link href="/verify" className={styles.cta}>
          إرسال رمز التحقق
          <Icon name="chevronLeft" size={18} strokeWidth={2} />
        </Link>

        <div className={styles.foot}>
          ليس لديك حساب شركة؟{' '}
          <Link href="/verify" className={styles.footLink}>
            سجّل شركتك
          </Link>
        </div>

        <div className={styles.note}>
          حساب الشركة يعمل برقم جوال واحد للمفوّض في هذه النسخة. الصلاحيات المتعددة داخل الشركة ستُضاف لاحقاً.
        </div>
      </div>
    </div>
  );
}
