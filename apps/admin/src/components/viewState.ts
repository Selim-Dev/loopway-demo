/**
 * The five view states every list surface must implement, and the shared
 * `حالة العرض` control that makes each one reachable without a backend.
 * See docs/design-system/07-patterns.md → "The five view states".
 */

export type AdminViewState = 'default' | 'empty' | 'loading' | 'error' | 'noresults';

export function viewOptions(emptyLabel: string) {
  return [
    { value: 'default', label: 'افتراضي' },
    { value: 'empty', label: emptyLabel },
    { value: 'loading', label: 'تحميل البيانات' },
    { value: 'error', label: 'تعذّر التحميل' },
    { value: 'noresults', label: 'لا نتائج مطابقة' },
  ];
}

/**
 * Resolves the state to render: an explicitly forced state wins, otherwise an
 * empty result set falls through to `noresults`.
 */
export function resolveMode(view: AdminViewState, resultCount: number): 'list' | AdminViewState {
  if (view !== 'default') return view;
  return resultCount === 0 ? 'noresults' : 'list';
}
