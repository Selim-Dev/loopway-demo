'use client';

import * as React from 'react';
import Link from 'next/link';
import { AlertBanner, Icon, ProgressBar, ScopeTag, type IconName } from '@loopway/ui';
import { Header } from '@/components/Header';
import { COMPANY, WALLET } from '@/mocks/company';
import { LIVE_TRIPS, OFFER_TRIPS } from '@/mocks/trips';
import styles from './HomeScreen.module.css';

/**
 * الرئيسية — DERIVED, NOT DESIGNED.
 * Implements SRS M03-E02: مؤشرات التشغيل الرئيسية + لوحة Action Required.
 */

interface Kpi {
  label: string;
  value: string;
  suffix?: string;
  icon: IconName;
  bg: string;
  color: string;
  href: string;
}

const KPIS: Kpi[] = [
  {
    label: 'رحلات مباشرة',
    value: String(LIVE_TRIPS.length),
    icon: 'truck',
    bg: 'var(--color-success-bg)',
    color: 'var(--lw-green-700)',
    href: '/trips',
  },
  {
    label: 'بانتظار العروض',
    value: String(OFFER_TRIPS.length),
    icon: 'clock',
    bg: 'var(--color-warning-bg)',
    color: 'var(--lw-amber-600)',
    href: '/trips',
  },
  {
    label: 'الرصيد المتاح',
    value: WALLET.available,
    suffix: 'ر.س',
    icon: 'card',
    bg: 'var(--lw-icon-tint-bg)',
    color: 'var(--lw-navy-800)',
    href: '/finance',
  },
  {
    label: 'مستندات بانتظار الرفع',
    value: '3',
    icon: 'document',
    bg: 'var(--lw-icon-tint-bg)',
    color: 'var(--lw-navy-800)',
    href: '/account/documents',
  },
];

interface ActionItem {
  title: string;
  meta: string;
  cta: string;
  href: string;
  icon: IconName;
  bg: string;
  color: string;
}

/**
 * The Action Required list. Ordering is deliberate: money first (a payment
 * timeout releases the driver — SRS BR-007), then anything that blocks
 * loading, then anything that blocks closure.
 */
const ACTIONS: ActionItem[] = [
  {
    title: 'اختر عرضاً للرحلة LW-2026-002948',
    meta: 'وصلت 5 عروض · الرياض ← جدة · تنتهي المهلة خلال 6 ساعات',
    cta: 'عرض العروض',
    href: '/trips/LW-2026-002948',
    icon: 'clock',
    bg: 'var(--color-warning-bg)',
    color: 'var(--lw-amber-600)',
  },
  {
    title: 'تصريح ميناء مطلوب — LW-2026-002951',
    meta: 'ميناء جبل علي · مطلوب قبل موعد التحميل',
    cta: 'رفع التصريح',
    href: '/trips/LW-2026-002951',
    icon: 'upload',
    bg: 'var(--color-warning-bg)',
    color: 'var(--lw-amber-600)',
  },
  {
    title: 'فشلت عملية دفع — TXN-2026-01881',
    meta: 'مدى •••• 7723 · 1,450 ر.س · رُفضت من البنك',
    cta: 'إعادة المحاولة',
    href: '/finance',
    icon: 'warning',
    bg: 'var(--color-danger-bg)',
    color: 'var(--lw-red-600)',
  },
  {
    title: 'وثيقة السجل التجاري تقترب من الانتهاء',
    meta: 'تنتهي في 14 سبتمبر 2026 · يُنصح بالتجديد مبكراً',
    cta: 'تحديث الوثيقة',
    href: '/account/company',
    icon: 'document',
    bg: 'var(--lw-icon-tint-bg)',
    color: 'var(--lw-navy-800)',
  },
];

const QUICK_ACTIONS: { label: string; sub: string; href: string; icon: IconName }[] = [
  { label: 'إنشاء رحلة جديدة', sub: 'ابدأ طلب شحن', href: '/trips/new', icon: 'plus' },
  { label: 'شحن الرصيد', sub: 'محفظة الشركة', href: '/finance', icon: 'arrowIn' },
  { label: 'المواقع المحفوظة', sub: 'مستودعات وموانئ', href: '/account/locations', icon: 'home' },
  { label: 'البروكرز المحفوظين', sub: 'مخلصون جمركيون', href: '/account/brokers', icon: 'user' },
];

export function HomeScreen() {
  const activeCount = LIVE_TRIPS.length + OFFER_TRIPS.length;
  const limitReached = activeCount >= COMPANY.maxConcurrent;

  return (
    <>
      <Header
        title="الرئيسية"
        subtitle={`${COMPANY.planName} · ${activeCount} من ${COMPANY.maxConcurrent} رحلات متزامنة`}
      />

      <div className={`${styles.body} lw-scroll`}>
        {limitReached ? (
          <AlertBanner tone="warning">لقد وصلت إلى الحد الأقصى للرحلات الحالية المسموح به في باقتك</AlertBanner>
        ) : null}

        <div className={styles.kpis}>
          {KPIS.map((k) => (
            <Link key={k.label} href={k.href} className={styles.kpi}>
              <span className={styles.kpiIcon} style={{ background: k.bg, color: k.color }}>
                <Icon name={k.icon} size={22} />
              </span>
              <span>
                <span className={styles.kpiLabel}>{k.label}</span>
                <div className={styles.kpiValue}>
                  {k.value}
                  {k.suffix ? <span className={styles.kpiSuffix}> {k.suffix}</span> : null}
                </div>
              </span>
            </Link>
          ))}
        </div>

        <div className={styles.split}>
          <section className={styles.panel}>
            <div className={styles.panelHead}>
              <span className={styles.panelTitle}>إجراءات مطلوبة</span>
              <Link href="/notifications" className={styles.panelLink}>
                كل التنبيهات
              </Link>
            </div>
            {ACTIONS.map((a) => (
              <Link key={a.title} href={a.href} className={styles.actionRow}>
                <span className={styles.actionGlyph} style={{ background: a.bg, color: a.color }}>
                  <Icon name={a.icon} size={17} />
                </span>
                <span className={styles.actionText}>
                  <span className={styles.actionTitle}>{a.title}</span>
                  <span className={styles.actionMeta}>{a.meta}</span>
                </span>
                <span className={styles.actionCta}>{a.cta}</span>
              </Link>
            ))}
          </section>

          <section className={styles.panel}>
            <div className={styles.panelHead}>
              <span className={styles.panelTitle}>رحلات مباشرة الآن</span>
              <Link href="/trips" className={styles.panelLink}>
                عرض الكل
              </Link>
            </div>
            {LIVE_TRIPS.map((t) => (
              <Link key={t.id} href={`/trips/${t.id}`} className={styles.miniRow}>
                <span className={styles.miniId}>{t.id}</span>
                <span className={styles.miniRoute}>
                  {t.from} ← {t.to}
                </span>
                <ScopeTag scope={t.scope} />
                <span className={styles.miniProgress}>
                  <ProgressBar percent={t.progress} label={`تقدم الرحلة ${t.id}`} />
                </span>
                <span className={styles.miniPct}>{t.progress}%</span>
              </Link>
            ))}
          </section>
        </div>

        <div className={styles.quick}>
          {QUICK_ACTIONS.map((q) => (
            <Link key={q.href} href={q.href} className={styles.quickTile}>
              <span className={styles.kpiIcon} style={{ background: 'var(--lw-icon-tint-bg)', color: 'var(--lw-navy-800)' }}>
                <Icon name={q.icon} size={20} />
              </span>
              <span>
                <span className={styles.quickLabel}>{q.label}</span>
                <div className={styles.quickSub}>{q.sub}</div>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
