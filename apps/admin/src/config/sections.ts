import type { SidebarGroup } from '@loopway/ui';

/**
 * The Admin portal's information architecture.
 *
 * NOT one entry per SRS §8 M04 section. The SRS describes sixteen; running the
 * portal showed the operating model is narrower, and several of those sections
 * described work that either belongs inside another screen or is not done here
 * at all:
 *
 *   E04 اعتماد الشاحنات   → merged into the driver request. A driver registers
 *                            WITH a truck; approving them apart invents a state
 *                            ("approved driver, pending truck") that no screen
 *                            can act on.
 *   E06 الوثائق والتصاريح  → documents live inside the request they belong to.
 *   E07 الدول والموانئ      → out of the operating model.
 *   E08 أنواع الشحنات       → out of the operating model.
 *   E13 الدعم              → out of the operating model.
 *   E14 التقارير           → out of the operating model.
 *
 * The `srs` field stays on what remains, so every screen is still traceable
 * back to the requirement it implements.
 */

export interface AdminSection {
  srs: string;
  href: string;
  label: string;
  /** One-line statement of what the section is for. */
  purpose: string;
  /** The @loopway/ui patterns this section is expected to reuse. */
  patterns: string[];
}

export const ADMIN_SECTIONS: AdminSection[] = [
  {
    srs: 'M04-E01',
    href: '/',
    label: 'الصفحة الرئيسية التشغيلية',
    purpose: 'مؤشرات التشغيل وآخر التحديثات على مستوى المنصة. تقرير، لا قرار.',
    patterns: ['KPI tiles', 'ListRow', 'Section'],
  },
  {
    srs: 'M04-E02',
    href: '/shipments',
    label: 'إدارة الرحلات',
    purpose: 'قائمة كل الرحلات مع فلاتر وتفاصيل تشغيلية كاملة لكل رحلة.',
    patterns: ['FilterBar', 'DataTable', 'SidePanel', 'Five view states'],
  },
  {
    srs: 'M04-E03',
    href: '/drivers',
    label: 'اعتماد السائقين',
    purpose: 'طلب تسجيل واحد يضم السائق وشاحنته ووثائقهما، يُقبل أو يُرفض كوحدة واحدة.',
    patterns: ['Approval queue', 'DocumentViewer', 'PhotoGrid', 'ConfirmDialog'],
  },
  {
    srs: 'M04-E12',
    href: '/penalties',
    label: 'مراجعة الغرامات',
    purpose: 'الغرامات المحتملة قبل أي أثر مالي — اعتماد أو رفض أو تعديل.',
    patterns: ['Approval queue', 'SidePanel', 'AlertBanner'],
  },
  {
    srs: 'M04-E05',
    href: '/customers',
    label: 'العملاء والشركات',
    purpose: 'حسابات الأفراد والشركات ووثائقها وشحناتها ومدفوعاتها.',
    patterns: ['ContentTabs', 'DataTable', 'SidePanel'],
  },
  {
    srs: 'M04-E10',
    href: '/finance',
    label: 'العمليات المالية',
    purpose: 'كل الحركات المالية على المنصة: المدفوعات والاستردادات والعمولة والرسوم والغرامات المعتمدة.',
    patterns: ['DataTable', 'AmountText', 'SidePanel'],
  },
  {
    srs: 'M04-E11',
    href: '/carrier-dues',
    label: 'إدارة مستحقات الشركات',
    purpose: 'مستحقات شركات النقل مفصّلة حسب الرحلات، من المراجعة حتى الصرف.',
    patterns: ['DataTable', 'AmountText', 'ConfirmDialog'],
  },
  {
    srs: 'M04-E09',
    href: '/settings/pricing',
    label: 'التسعير والرسوم',
    purpose: 'رسوم المنصة والعمولة وضريبة القيمة المضافة ورسوم الدفع.',
    patterns: ['Settings form', 'AlertBanner', 'ConfirmDialog'],
  },
  {
    srs: 'M04-E15',
    href: '/notifications',
    label: 'إدارة الإشعارات',
    purpose: 'إرسال الإشعارات، وإدارة القوالب، والاطلاع على سجل الإرسال.',
    patterns: ['ContentTabs', 'Settings CRUD', 'DataTable'],
  },
  {
    srs: 'M04-E16',
    href: '/audit',
    label: 'سجل القرارات والاعتمادات',
    purpose: 'سجل كل إجراء حساس: من فعله، ومتى، وما القيمة قبل وبعد.',
    patterns: ['DataTable', 'FilterBar', 'SidePanel'],
  },
];

/**
 * No `count` on any item — the sidebar carries destinations only. Queue depth
 * shows where the decision is taken: the home dashboard's KPI tiles and each
 * queue's own filter-bar tabs.
 */
export const ADMIN_GROUPS: SidebarGroup[] = [
  {
    items: [
      { label: 'الصفحة الرئيسية', icon: 'home', href: '/' },
      { label: 'إدارة الرحلات', icon: 'truck', href: '/shipments' },
    ],
  },
  {
    label: 'الاعتماد والمراجعة',
    items: [
      { label: 'اعتماد السائقين', icon: 'user', href: '/drivers' },
      { label: 'مراجعة الغرامات', icon: 'warning', href: '/penalties' },
    ],
  },
  {
    label: 'الحسابات والمال',
    items: [
      { label: 'العملاء والشركات', icon: 'user', href: '/customers' },
      { label: 'العمليات المالية', icon: 'card', href: '/finance' },
      { label: 'إدارة مستحقات الشركات', icon: 'arrowOut', href: '/carrier-dues' },
    ],
  },
  {
    label: 'الإعدادات',
    items: [
      { label: 'التسعير والرسوم', icon: 'card', href: '/settings/pricing' },
      { label: 'إدارة الإشعارات', icon: 'bell', href: '/notifications' },
    ],
  },
  {
    label: 'التشغيل',
    items: [{ label: 'سجل القرارات والاعتمادات', icon: 'clock', href: '/audit' }],
  },
];

export function findSection(href: string): AdminSection | undefined {
  return ADMIN_SECTIONS.find((s) => s.href === href);
}
