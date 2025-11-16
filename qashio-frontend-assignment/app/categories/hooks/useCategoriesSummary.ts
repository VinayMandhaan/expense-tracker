'use client';

import { useQuery } from '@tanstack/react-query';
import { apiGet } from '@/lib/api';
import { CategorySummary } from '../types';

export function useCategoriesSummary() {
  return useQuery({
    queryKey: ['categories', 'summary'],
    queryFn: () => apiGet<CategorySummary[]>('/categories/summary'),
  })
}
