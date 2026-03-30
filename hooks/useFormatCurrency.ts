'use client';

import { useLocale } from 'next-intl';
import { formatCurrency, formatCurrencyCompact } from '@/lib/currency';
import type { CurrencyCode } from '@/types';

/**
 * Returns formatCurrency/formatCurrencyCompact bound to the current app locale.
 * When locale is 'en', numbers are formatted in English style (e.g. R$ 1,234.56).
 */
export function useFormatCurrency() {
  const locale = useLocale();

  return {
    formatCurrency: (
      value: number,
      currencyCode?: CurrencyCode | string | null,
      opts?: Intl.NumberFormatOptions
    ) => formatCurrency(value, currencyCode, opts, locale),

    formatCurrencyCompact: (
      value: number,
      currencyCode?: CurrencyCode | string | null,
      opts?: Intl.NumberFormatOptions
    ) => formatCurrencyCompact(value, currencyCode, opts, locale),
  };
}
