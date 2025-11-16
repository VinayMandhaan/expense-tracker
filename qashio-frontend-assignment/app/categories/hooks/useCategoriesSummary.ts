'use client';

import { useQuery } from '@tanstack/react-query';
import { getCategoriesSummary } from '../request/categoryRequest';

export function useCategoriesSummary() {
  return useQuery({
    queryKey: ['categories', 'summary'],
    queryFn: () => getCategoriesSummary(),
  })
}
