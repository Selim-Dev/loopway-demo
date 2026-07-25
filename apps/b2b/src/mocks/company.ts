import type { Broker, CompanyAccount, SavedLocation, Wallet } from '@loopway/ui';

/** Company identity — values as shown in the designed header and wallet card. */
export const COMPANY: CompanyAccount = {
  companyName: 'شركة الرحلة اللوجستية',
  accountId: 'LW-CO-4821',
  initial: 'ر',
  commercialRegistration: '1010457821',
  vatNumber: '310457821900003',
  nationalAddress: 'الرياض — حي الملقا — 3821 طريق الملك سلمان',
  authorizedContact: 'سارة العتيبي — 0555 123 4821',
  planName: 'باقة الأعمال',
  maxConcurrent: 8,
};

export const WALLET: Wallet = {
  available: '24,600',
  onHold: '11,050',
  pending: '10,000',
};

export const SAVED_LOCATIONS: SavedLocation[] = [
  {
    id: 'LOC-001',
    label: 'مستودع الرياض الرئيسي',
    country: 'السعودية',
    city: 'الرياض',
    address: 'المنطقة الصناعية الثانية — مستودع 14',
    isPort: false,
    permitRequired: false,
    supervisorName: 'ماجد العنزي',
    supervisorPhone: '0555 210 4471',
  },
  {
    id: 'LOC-002',
    label: 'ميناء الملك عبدالعزيز',
    country: 'السعودية',
    city: 'الدمام',
    address: 'ميناء الملك عبدالعزيز — البوابة 3',
    isPort: true,
    portName: 'ميناء الملك عبدالعزيز',
    permitRequired: true,
    supervisorName: 'ناصر القحطاني',
    supervisorPhone: '0553 884 1120',
  },
  {
    id: 'LOC-003',
    label: 'مركز التوزيع — جدة',
    country: 'السعودية',
    city: 'جدة',
    address: 'حي الخمرة — طريق المدينة السريع',
    isPort: false,
    permitRequired: false,
    supervisorName: 'عمر السالم',
    supervisorPhone: '0556 771 3390',
  },
  {
    id: 'LOC-004',
    label: 'مستودع جبل علي',
    country: 'الإمارات',
    city: 'دبي',
    address: 'المنطقة الحرة جبل علي — القطاع 6',
    isPort: true,
    portName: 'ميناء جبل علي',
    permitRequired: true,
  },
];

export const BROKERS: Broker[] = [
  {
    id: 'BRK-001',
    name: 'مكتب البطحاء للتخليص الجمركي',
    country: 'السعودية',
    portOrBorder: 'منفذ البطحاء',
    whatsappNumber: '+966 55 480 2211',
    authorizationNumber: 'CB-4471-SA',
    expiryDate: '12 مارس 2027',
    notes: 'يعمل من 7 صباحاً حتى 9 مساءً — يفضّل إرسال البوليصة قبل الوصول بيوم.',
  },
  {
    id: 'BRK-002',
    name: 'الخفجي لخدمات الشحن',
    country: 'السعودية',
    portOrBorder: 'منفذ الخفجي',
    whatsappNumber: '+966 53 991 7734',
    authorizationNumber: 'CB-2280-SA',
    expiryDate: '30 سبتمبر 2026',
  },
  {
    id: 'BRK-003',
    name: 'جبل علي للتخليص',
    country: 'الإمارات',
    portOrBorder: 'ميناء جبل علي',
    whatsappNumber: '+971 50 220 9981',
    authorizationNumber: 'CB-1190-AE',
    expiryDate: '4 يناير 2027',
    notes: 'يتطلب نسخة من شهادة المنشأ مع كل شحنة.',
  },
];
