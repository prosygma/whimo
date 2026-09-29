import type { TraceabilityStatusEnum, TransactionStatusEnum } from '../api/types/transactionTypes.ts';

export type TransactionsStatusEnum = TransactionStatusEnum | 'is_automatic' | 'recorded';

/**
 * Chart.js cannot read Tailwind classes, so these hexes have to be duplicated
 * out of the `@theme` blocks in src/index.css. They used to be duplicated a
 * second time, verbatim, across two helper files that drifted independently —
 * this module is the single copy. Keep it in sync with index.css by hand.
 *
 * Reading the CSS custom properties at runtime via getComputedStyle would
 * remove the duplication, but only if called at render time; these maps are
 * consumed at module scope, before the stylesheet has necessarily applied.
 *
 * Insertion order matters: both consumers iterate these objects with `for..in`
 * to drive the order of chart segments and legend entries.
 */

/** A categorical data scale, independent of the brand palette (src/brand/theme.css). */
export const traceabilityChartColors: Record<TraceabilityStatusEnum, string> = {
  full: '#29C229',
  conditional: '#298FC2',
  partial: '#901F82',
  incomplete: '#002746',
};

export const transactionStatusChartColors: Record<TransactionsStatusEnum, string> = {
  accepted: '#29C229',
  pending: '#E19C3B',
  rejected: '#C22929',
  no_response: '#808080',
  is_automatic: '#1A1A1A',
  recorded: '#003964',
};
