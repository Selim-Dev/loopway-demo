import type { Metadata } from 'next';
import Link from 'next/link';
import { LoopwayMark } from '@loopway/ui';
import styles from '../auth.module.css';

export const metadata: Metadata = { title: 'رمز التحقق — LoopWay' };

/** DERIVED, NOT DESIGNED — SRS M03-E01-F01 (Mobile Verification). */
export default function VerifyPage() {
  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.brand}>
          <LoopwayMark width={46} />
          <span className={styles.brandText}>لوحة الشركات</span>
        </div>

        <h1 className={styles.title}>أدخل رمز التحقق</h1>
        <p className={styles.subtitle}>
          أرسلنا رمزاً من أربعة أرقام إلى <span className="lw-ltr">0555 123 4821</span>. الرمز صالح لمدة خمس دقائق.
        </p>

        <div className={styles.otpRow}>
          {[0, 1, 2, 3].map((i) => (
            <input
              key={i}
              className={styles.otpBox}
              inputMode="numeric"
              maxLength={1}
              aria-label={`الرقم ${i + 1} من رمز التحقق`}
            />
          ))}
        </div>

        <Link href="/" className={styles.cta}>
          تأكيد الدخول
        </Link>

        <div className={styles.foot}>
          لم يصلك الرمز؟{' '}
          <Link href="/verify" className={styles.footLink}>
            إعادة الإرسال
          </Link>
        </div>
      </div>
    </div>
  );
}
