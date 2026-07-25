import type { AppNotification, SupportCase } from '@loopway/ui';

/** The header badge shows 2 in the design. */
export const UNREAD_COUNT = 2;

export const NOTIFICATIONS: AppNotification[] = [
  {
    id: 'NTF-1041',
    kind: 'offer',
    title: 'وصلت 5 عروض على رحلتك',
    body: 'الرحلة LW-2026-002948 من الرياض إلى جدة استقبلت خمسة عروض. راجعها واختر السائق المناسب.',
    time: 'قبل 12 دقيقة',
    read: false,
    tripId: 'LW-2026-002948',
  },
  {
    id: 'NTF-1040',
    kind: 'document',
    title: 'تصريح ميناء مطلوب',
    body: 'الرحلة LW-2026-002951 تحتاج تصريح دخول ميناء جبل علي قبل موعد التحميل.',
    time: 'قبل ساعة',
    read: false,
    tripId: 'LW-2026-002951',
  },
  {
    id: 'NTF-1038',
    kind: 'status',
    title: 'السائق عبر الحدود',
    body: 'الرحلة LW-2026-002962 سجّلت حدث عبور الحدود في منفذ الخفجي.',
    time: 'أمس · 06:20 م',
    read: true,
    tripId: 'LW-2026-002962',
  },
  {
    id: 'NTF-1035',
    kind: 'payment',
    title: 'تم خصم مبلغ الرحلة',
    body: 'تم خصم 3,850 ر.س من محفظتك مقابل الرحلة LW-2026-002960.',
    time: 'أمس · 08:02 ص',
    read: true,
    tripId: 'LW-2026-002960',
  },
  {
    id: 'NTF-1031',
    kind: 'support',
    title: 'تم تحديث حالة بلاغك',
    body: 'البلاغ SC-0219 الخاص بالرحلة LW-2026-002910 أصبح قيد المعالجة.',
    time: '18 يوليو 2026',
    read: true,
    tripId: 'LW-2026-002910',
  },
];

export const SUPPORT_CASES: SupportCase[] = [
  {
    id: 'SC-0219',
    type: 'نزاع على إلغاء رحلة',
    tripId: 'LW-2026-002910',
    priority: 'عالية',
    status: 'قيد المعالجة',
    openedAt: '16 يوليو 2026',
    description: 'أُلغيت الرحلة بعد تحرك السائق ونطلب مراجعة الغرامة المقترحة.',
  },
  {
    id: 'SC-0214',
    type: 'تأخر في التحميل',
    tripId: 'LW-2026-002955',
    priority: 'متوسطة',
    status: 'مفتوحة',
    openedAt: '17 يوليو 2026',
    description: 'انتظر السائق أكثر من الحد المسموح في موقع التحميل بسبب ازدحام البوابة.',
  },
  {
    id: 'SC-0208',
    type: 'استفسار عن فاتورة',
    priority: 'منخفضة',
    status: 'مغلقة',
    openedAt: '9 يوليو 2026',
    description: 'طلب توضيح احتساب ضريبة القيمة المضافة على العملية TXN-2026-01840.',
  },
];
