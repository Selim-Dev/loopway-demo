/**
 * @loopway/ui — the shared LoopWay design layer for the web portals.
 *
 * Both apps/b2b and apps/admin build on this package so the two portals cannot
 * drift. Before adding anything here, read:
 *   docs/design-system/05-web-scale.md  (the desktop scale)
 *   docs/design-system/06-components.md (the component contract)
 */

export * from './tokens';
export * from './types';
export * from './hooks';

export { Icon, RouteArrow, LoopwayMark } from './icons/Icon';
export type { IconName, IconProps } from './icons/Icon';

export { AppShell } from './components/AppShell';
export type { AppShellProps } from './components/AppShell';

export { IconRail } from './components/IconRail';
export type { IconRailProps, RailItem } from './components/IconRail';

export { PageHeader } from './components/PageHeader';
export type { PageHeaderProps, PageTab } from './components/PageHeader';

export { NavSidebar, SidebarShell } from './components/NavSidebar';
export type { NavSidebarProps, SidebarGroup, SidebarItem } from './components/NavSidebar';

export {
  FilterBar,
  FilterBarSpacer,
  TabGroup,
  SearchField,
  SelectField,
  PrimaryCta,
} from './components/Controls';
export type {
  ControlSize,
  TabItem,
  TabGroupProps,
  SearchFieldProps,
  SelectFieldProps,
  SelectOption,
  PrimaryCtaProps,
} from './components/Controls';

export {
  Spinner,
  StateCard,
  EmptyState,
  NoResultsState,
  ErrorState,
  LoadingState,
  AlertBanner,
} from './components/States';
export type { StateCardProps, AlertTone } from './components/States';

export {
  RefCode,
  StatusBadge,
  ScopeTag,
  StageChip,
  ProgressBar,
  AvatarInitial,
  AmountText,
  RouteChips,
} from './components/Display';
export type { BadgeTone, StageChipProps } from './components/Display';

export { TripRow } from './components/TripRow';
export type { TripRowProps } from './components/TripRow';

export { LiveWaybillButton } from './components/LiveWaybillButton';
export type { LiveWaybillButtonProps } from './components/LiveWaybillButton';

export {
  Card,
  SidePanel,
  PanelCta,
  SectionLabel,
  PanelHint,
  DetailList,
  DetailRow,
  PaginationBar,
  ViewStateLabel,
  TableCard,
  DataTable,
  CellStack,
  CellPrimary,
  CellSecondary,
  CellEmpty,
  RowIcon,
  IconButtonSm,
  WalletCard,
  WalletCta,
  StatusTimeline,
} from './components/Surfaces';
export type { WalletStat, TimelineStep } from './components/Surfaces';

export { TripCalendar, buildCalendar, MONTH_NAMES_AR, WEEKDAYS_AR } from './components/TripCalendar';
export type { TripCalendarProps, Today } from './components/TripCalendar';
