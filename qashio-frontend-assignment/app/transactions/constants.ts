import type { FilterOption } from './types';

export const typeOptions: ReadonlyArray<FilterOption> = [
  { label: 'All', value: '' },
  { label: 'Income', value: 'income' },
  { label: 'Expense', value: 'expense' },
] as const
