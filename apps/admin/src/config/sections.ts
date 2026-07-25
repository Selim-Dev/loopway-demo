import type { SidebarGroup } from '@loopway/ui';

/**
 * The Admin portal's information architecture.
 *
 * One entry per functional section in SRS §8 → M04 (E01–E16), grouped so the
 * sixteen destinations stay scannable. The `srs` field is deliberate: it keeps
 * every screen traceable back to the requirement it implements, which is how
 * docs/design-system/10-admin-portal-guide.md is meant to be used.
 */

export interface AdminSection {
  srs: string;
  href: string;
  label: string;
  /** One-line statement of what the section is for. */
  purpose: string;
  /** The @loopway/ui patterns this section is expected to reuse. */
  patterns: string[];
  count?: number;
}

export const ADMIN_SECTIONS: AdminSection[] = [
  {
    srs: 'M04-E01',
    href: '/',
    label: 'الصفحة الرئيسية التشغيلية',
    purpose: 'مؤشرات التشغيل والإجراءات المطلوبة على مستوى المنصة كلها.',
    patterns: ['KPI tiles', 'Action Required list', 'AlertBanner'],
  },
  {
    srs: 'M04-E02',
    href: '/shipments',
    label: 'إدارة الشحنات',
    purpose: 'قائمة كل الشحنات مع فلاتر وتفاصيل تشغيلية كاملة لكل شحنة.',
    patterns: ['FilterBar', 'DataTable', 'SidePanel', 'Five view states'],
  },
  {
    srs: 'M04-E03',
    href: '/drivers',
    label: 'اعتماد السائقين',
    purpose: 'مراجعة طلبات تسجيل السائقين ووثائقهم واعتمادها أو رفضها.',
    patterns: ['Approval queue', 'DataTable', 'SidePanel', 'StatusBadge'],
    count: 12,
  },
  {
    srs: 'M04-E04',
    href: '/trucks',
    label: 'اعتماد الشاحنات',
    purpose: 'مراجعة بيانات الشاحنة والاستمارة والتأمين والصور واعتمادها.',
    patterns: ['Approval queue', 'DataTable', 'SidePanel'],
    count: 7,
  },
  {
    srs: 'M04-E05',
    href: '/customers',
    label: 'إدارة العملاء والشركات',
    purpose: 'حسابات الأفراد والشركات ووثائقها وشحناتها ومدفوعاتها.',
    patterns: ['TabGroup', 'DataTable', 'SidePanel'],
  },
  {
    srs: 'M04-E06',
    href: '/documents',
    label: 'مراجعة الوثائق والتصاريح',
    purpose: 'طابور مراجعة الوثائق والتصاريح لكل الكيانات.',
    patterns: ['Approval queue', 'DataTable', 'StatusBadge'],
    count: 23,
  },
  {
    srs: 'M04-E07',
    href: '/settings/geography',
    label: 'الدول والمدن والموانئ',
    purpose: 'الدول المدعومة ومدنها وموانئها وهل يتطلب الميناء تصريحاً.',
    patterns: ['Settings CRUD', 'DataTable'],
  },
  {
    srs: 'M04-E08',
    href: '/settings/catalog',
    label: 'أنواع الشحنات والشاحنات',
    purpose: 'أنواع الحمولات وأنواع الشاحنات ومصفوفة التوافق بينهما.',
    patterns: ['Settings CRUD', 'Compatibility matrix'],
  },
  {
    srs: 'M04-E09',
    href: '/settings/pricing',
    label: 'التسعير والرسوم والضرائب',
    purpose: 'رسوم المنصة والعمولة وضريبة القيمة المضافة ورسوم الدفع.',
    patterns: ['Settings form', 'AlertBanner'],
  },
  {
    srs: 'M04-E10',
    href: '/payments',
    label: 'الدفع والـ Ledger',
    purpose: 'معاملات الدفع وقيود الـ Ledger لكل الأطراف.',
    patterns: ['DataTable', 'AmountText', 'SidePanel'],
  },
  {
    srs: 'M04-E11',
    href: '/payouts',
    label: 'Payout Management',
    purpose: 'مستحقات السائقين من التسوية حتى التحويل الفعلي.',
    patterns: ['DataTable', 'AmountText', 'StatusBadge'],
    count: 9,
  },
  {
    srs: 'M04-E12',
    href: '/penalties',
    label: 'مراجعة الغرامات',
    purpose: 'الغرامات المحتملة قبل أي أثر مالي — اعتماد أو رفض أو تعديل.',
    patterns: ['Approval queue', 'SidePanel', 'AlertBanner'],
    count: 4,
  },
  {
    srs: 'M04-E13',
    href: '/support',
    label: 'الدعم والاستثناءات',
    purpose: 'بلاغات الدعم والنزاعات والتحقق البديل من التسليم.',
    patterns: ['DataTable', 'SidePanel', 'StatusBadge'],
    count: 6,
  },
  {
    srs: 'M04-E14',
    href: '/reports',
    label: 'التقارير',
    purpose: 'تقارير تشغيلية ومالية على مستوى المنصة.',
    patterns: ['Bar rows', 'Card grid'],
  },
  {
    srs: 'M04-E15',
    href: '/templates',
    label: 'الإشعارات والقوالب',
    purpose: 'قوالب إشعارات النظام لكل حدث.',
    patterns: ['Settings CRUD', 'DataTable'],
  },
  {
    srs: 'M04-E16',
    href: '/audit',
    label: 'Audit Log',
    purpose: 'سجل كل إجراء حساس: من فعله، ومتى، وما القيمة قبل وبعد.',
    patterns: ['DataTable', 'Timeline', 'FilterBar'],
  },
];

export const ADMIN_GROUPS: SidebarGroup[] = [
  {
    items: [
      { label: 'الصفحة الرئيسية', icon: 'home', href: '/' },
      { label: 'إدارة الشحنات', icon: 'truck', href: '/shipments' },
    ],
  },
  {
    label: 'الاعتماد والمراجعة',
    items: [
      { label: 'اعتماد السائقين', icon: 'user', href: '/drivers', count: 12 },
      { label: 'اعتماد الشاحنات', icon: 'truck', href: '/trucks', count: 7 },
      { label: 'الوثائق والتصاريح', icon: 'document', href: '/documents', count: 23 },
      { label: 'مراجعة الغرامات', icon: 'warning', href: '/penalties', count: 4 },
    ],
  },
  {
    label: 'الحسابات والمال',
    items: [
      { label: 'العملاء والشركات', icon: 'user', href: '/customers' },
      { label: 'الدفع والـ Ledger', icon: 'card', href: '/payments' },
      { label: 'Payout Management', icon: 'arrowOut', href: '/payouts', count: 9 },
    ],
  },
  {
    label: 'الإعدادات',
    items: [
      { label: 'الدول والموانئ', icon: 'home', href: '/settings/geography' },
      { label: 'الشحنات والشاحنات', icon: 'list', href: '/settings/catalog' },
      { label: 'التسعير والرسوم', icon: 'card', href: '/settings/pricing' },
      { label: 'الإشعارات والقوالب', icon: 'bell', href: '/templates' },
    ],
  },
  {
    label: 'التشغيل',
    items: [
      { label: 'الدعم والاستثناءات', icon: 'support', href: '/support', count: 6 },
      { label: 'التقارير', icon: 'list', href: '/reports' },
      { label: 'Audit Log', icon: 'clock', href: '/audit' },
    ],
  },
];

export function findSection(href: string): AdminSection | undefined {
  return ADMIN_SECTIONS.find((s) => s.href === href);
}
