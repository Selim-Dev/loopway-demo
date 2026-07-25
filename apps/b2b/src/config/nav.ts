import type { RailItem } from '@loopway/ui';

/**
 * The B2B rail — four destinations, exactly as the design ships them.
 *
 * The SRS (M03) lists eleven functional sections; the design deliberately
 * collapses them into four. The mapping is documented in
 * docs/design-system/09-ia-and-routes.md — read it before adding a fifth item.
 */
export const RAIL_ITEMS: RailItem[] = [
  { title: 'الرئيسية', icon: 'home', href: '/' },
  { title: 'رحلاتي', icon: 'truck', href: '/trips' },
  { title: 'سجل العمليات المالية', icon: 'card', href: '/finance' },
  { title: 'الملف الشخصي وإعدادات البروكر', icon: 'user', href: '/account' },
];
