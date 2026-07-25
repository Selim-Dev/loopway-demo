'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  AlertBanner,
  DetailList,
  DetailRow,
  EmptyState,
  ErrorState,
  FilterBar,
  FilterBarSpacer,
  LoadingState,
  NoResultsState,
  PaginationBar,
  PanelCta,
  PanelHint,
  PrimaryCta,
  RouteChips,
  SearchField,
  SelectField,
  SidePanel,
  StatusBadge,
  TabGroup,
  TripCalendar,
  TripRow,
  ViewStateLabel,
  formatElapsed,
  useSecondTick,
  type Trip,
  type TripBucket,
  type ViewState,
} from '@loopway/ui';
import { Header } from '@/components/Header';
import { CALENDAR_TRIPS, TODAY } from '@/mocks/calendar';
import { COMPANY } from '@/mocks/company';
import {
  HISTORY_STATUSES,
  HISTORY_TRIPS,
  LIVE_STATUSES,
  LIVE_TRIPS,
  OFFER_STATUSES,
  OFFER_TRIPS,
} from '@/mocks/trips';

type Page = 'list' | 'calendar';

const VIEW_OPTIONS = [
  { value: 'default', label: 'افتراضي' },
  { value: 'empty', label: 'لا توجد رحلات' },
  { value: 'loading', label: 'تحميل البيانات' },
  { value: 'error', label: 'تعذّر التحميل' },
  { value: 'limit', label: 'بلوغ حد الباقة' },
  { value: 'noresults', label: 'لا توجد نتائج مطابقة' },
];

const SCOPE_OPTIONS = [
  { value: 'all', label: 'النطاق: الكل' },
  { value: 'محلية', label: 'محلية' },
  { value: 'دولية', label: 'دولية' },
];

const DATE_OPTIONS = [
  { value: 'all', label: 'التاريخ: الكل' },
  { value: 'week', label: 'هذا الأسبوع' },
  { value: 'month', label: 'هذا الشهر' },
];

export function TripsScreen({ initialPage }: { initialPage: Page }) {
  const [tab, setTab] = React.useState<TripBucket>('current');
  const [view, setView] = React.useState<ViewState>('default');
  const [search, setSearch] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('all');
  const [scopeFilter, setScopeFilter] = React.useState('all');
  const [dateFilter, setDateFilter] = React.useState('all');
  const [expandedId, setExpandedId] = React.useState<string | null>(null);

  const [calMonth, setCalMonth] = React.useState(TODAY.month);
  const [calYear, setCalYear] = React.useState(TODAY.year);
  const [hoveredCalTrip, setHoveredCalTrip] = React.useState<string | null>(null);
  const [calSelectedTrip, setCalSelectedTrip] = React.useState<string | null>(null);

  const base = tab === 'current' ? LIVE_TRIPS : tab === 'offers' ? OFFER_TRIPS : HISTORY_TRIPS;
  const anyLive = base.some((t) => t.live);
  const tick = useSecondTick(initialPage === 'list' && anyLive);

  const statusOptions = React.useMemo(() => {
    const list = tab === 'history' ? HISTORY_STATUSES : tab === 'offers' ? OFFER_STATUSES : LIVE_STATUSES;
    return [{ value: 'all', label: 'الحالة: الكل' }, ...list.map((s) => ({ value: s, label: s }))];
  }, [tab]);

  const filtered = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    return base.filter((r) => {
      if (statusFilter !== 'all' && r.status !== statusFilter) return false;
      if (scopeFilter !== 'all' && r.scope !== scopeFilter) return false;
      if (q) {
        const hay = `${r.id} ${r.from} ${r.to} ${r.cargo}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [base, search, statusFilter, scopeFilter]);

  // Plan cap. @designOriginated — see docs/design-system/09-ia-and-routes.md.
  const activeCount = view === 'limit' ? COMPANY.maxConcurrent : LIVE_TRIPS.length + OFFER_TRIPS.length;
  const limitReached = tab !== 'history' && (view === 'limit' || activeCount >= COMPANY.maxConcurrent);

  const mode: 'list' | ViewState =
    view === 'loading' || view === 'error' || view === 'empty' || view === 'noresults'
      ? view
      : filtered.length === 0
        ? 'noresults'
        : 'list';

  const resetFilters = () => {
    setSearch('');
    setStatusFilter('all');
    setScopeFilter('all');
    setDateFilter('all');
    setView('default');
  };

  const switchTab = (key: string) => {
    setTab(key as TripBucket);
    setStatusFilter('all');
    setExpandedId(null);
  };

  const selectedCalTrip = calSelectedTrip ? CALENDAR_TRIPS.find((t) => t.id === calSelectedTrip) : undefined;

  const headerTabs = [
    { label: 'القائمة', icon: 'list' as const, href: '/trips', active: initialPage === 'list' },
    { label: 'التقويم', icon: 'calendar' as const, href: '/trips/calendar', active: initialPage === 'calendar' },
  ];

  return (
    <>
      <Header title="رحلاتي" tabs={headerTabs} />

      {initialPage === 'list' ? (
        <>
          <FilterBar>
            <TabGroup
              tabs={[
                { key: 'current', label: 'الرحلات المباشرة', count: LIVE_TRIPS.length },
                { key: 'offers', label: 'بانتظار العروض', count: OFFER_TRIPS.length },
                { key: 'history', label: 'سجل الرحلات' },
              ]}
              active={tab}
              onChange={switchTab}
            />

            <SearchField
              value={search}
              onChange={setSearch}
              placeholder="ابحث برقم الرحلة أو الموقع…"
              aria-label="ابحث برقم الرحلة أو الموقع"
            />

            <SelectField value={statusFilter} onChange={setStatusFilter} options={statusOptions} aria-label="تصفية حسب الحالة" />
            <SelectField value={scopeFilter} onChange={setScopeFilter} options={SCOPE_OPTIONS} aria-label="تصفية حسب النطاق" />
            <SelectField value={dateFilter} onChange={setDateFilter} options={DATE_OPTIONS} aria-label="تصفية حسب التاريخ" />

            <FilterBarSpacer>
              <PrimaryCta
                icon="plus"
                href={limitReached ? undefined : '/trips/new'}
                disabled={limitReached}
                title={limitReached ? 'وصلت إلى الحد الأقصى للرحلات الحالية في باقتك' : 'إنشاء رحلة جديدة'}
                linkAs={Link}
              >
                إنشاء رحلة جديدة
              </PrimaryCta>
            </FilterBarSpacer>
          </FilterBar>

          {limitReached ? (
            <AlertBanner tone="warning">لقد وصلت إلى الحد الأقصى للرحلات الحالية المسموح به في باقتك</AlertBanner>
          ) : null}

          {mode === 'list' ? (
            <div className="pageBody">
              <div className="scrollList lw-scroll">
                {filtered.map((trip) => (
                  <TripRow
                    key={trip.id}
                    trip={trip}
                    expanded={expandedId === trip.id}
                    onToggle={() => setExpandedId(expandedId === trip.id ? null : trip.id)}
                    elapsed={trip.live ? formatElapsed((trip.baseElapsed ?? 0) + tick) : undefined}
                    waybillHref={`/trips/${trip.id}/waybill`}
                    linkAs={Link}
                  />
                ))}
              </div>

              <PaginationBar
                count={filtered.length}
                total={filtered.length}
                left={
                  <>
                    <ViewStateLabel>حالة العرض:</ViewStateLabel>
                    <SelectField
                      value={view}
                      onChange={(v) => setView(v as ViewState)}
                      options={VIEW_OPTIONS}
                      variant="quiet"
                      aria-label="حالة العرض"
                    />
                  </>
                }
              />
            </div>
          ) : null}

          {mode === 'loading' ? <LoadingState rows={4} label="جارٍ تحميل الرحلات…" /> : null}

          {mode === 'error' ? (
            <ErrorState
              title="تعذّر تحميل الرحلات"
              body="حدث خطأ أثناء جلب بيانات الرحلات. تحقّق من اتصالك ثم أعد المحاولة."
              onRetry={() => setView('default')}
            />
          ) : null}

          {mode === 'empty' ? (
            <EmptyState
              title={tab === 'offers' ? 'لا توجد رحلات بانتظار العروض' : 'لا توجد رحلات مباشرة'}
              body={
                tab === 'offers'
                  ? 'الرحلات الجديدة التي تنتظر عروض السائقين ستظهر هنا.'
                  : 'ابدأ بإنشاء رحلة جديدة وستظهر هنا فور انطلاقها مع متابعة حية.'
              }
              action={{ label: 'إنشاء رحلة جديدة', icon: 'plus', href: '/trips/new' }}
              linkAs={Link}
            />
          ) : null}

          {mode === 'noresults' ? <NoResultsState onClearFilters={resetFilters} /> : null}
        </>
      ) : (
        <div style={{ flex: 1, minHeight: 0, display: 'flex', gap: 14 }}>
          {selectedCalTrip ? (
            <SidePanel
              title="بيانات الرحلة"
              onClose={() => setCalSelectedTrip(null)}
              footer={
                <PanelCta href={`/trips/${selectedCalTrip.id}`} linkAs={Link}>
                  فتح صفحة الرحلة الكاملة
                </PanelCta>
              }
            >
              <CalendarTripPanel trip={selectedCalTrip} />
            </SidePanel>
          ) : null}

          <TripCalendar
            trips={CALENDAR_TRIPS}
            month={calMonth}
            year={calYear}
            today={TODAY}
            highlightedId={hoveredCalTrip ?? calSelectedTrip}
            onHover={setHoveredCalTrip}
            onSelect={setCalSelectedTrip}
            onPrev={() => {
              const m = calMonth - 1;
              if (m < 0) {
                setCalMonth(11);
                setCalYear(calYear - 1);
              } else {
                setCalMonth(m);
              }
            }}
            onNext={() => {
              const m = calMonth + 1;
              if (m > 11) {
                setCalMonth(0);
                setCalYear(calYear + 1);
              } else {
                setCalMonth(m);
              }
            }}
            onToday={() => {
              setCalMonth(TODAY.month);
              setCalYear(TODAY.year);
            }}
          />
        </div>
      )}
    </>
  );
}

/** Detail body for the calendar side panel. */
function CalendarTripPanel({ trip }: { trip: (typeof CALENDAR_TRIPS)[number] }) {
  const active = trip.status === 'active';
  const days = trip.end - trip.start + 1;
  const durationLabel = days === 1 ? '1 يوم' : days === 2 ? 'يومان' : days <= 10 ? `${days} أيام` : `${days} يوماً`;

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginBottom: 16 }}>
        <span
          style={{
            fontSize: 21,
            fontWeight: 800,
            fontFamily: 'var(--font-latin)',
            direction: 'ltr',
            letterSpacing: '-.3px',
            color: active ? 'var(--lw-green-700)' : 'var(--lw-amber-600)',
          }}
        >
          {trip.id}
        </span>
        <StatusBadge tone={active ? 'success' : 'warning'} pill>
          {active ? 'نشطة' : 'مجدولة'}
        </StatusBadge>
      </div>

      <div style={{ marginBottom: 20 }}>
        <RouteChips from={trip.from} to={trip.to} variant="plain" />
      </div>

      <DetailList>
        <DetailRow label="تاريخ الانطلاق">{trip.start} يوليو 2026</DetailRow>
        <DetailRow label="تاريخ الوصول المتوقّع">{trip.end} يوليو 2026</DetailRow>
        <DetailRow label="مدة الرحلة">{durationLabel}</DetailRow>
        <DetailRow label="الحمولة">{trip.cargo}</DetailRow>
        <DetailRow label="السائق">{trip.driver}</DetailRow>
      </DetailList>

      <PanelHint>تفاصيل إضافية (المسار على الخريطة، المستندات، وسجل التتبّع) ستُضاف هنا لاحقاً.</PanelHint>
    </>
  );
}

export type { Trip };
