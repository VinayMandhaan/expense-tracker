'use client';

import { useQuery } from '@tanstack/react-query';
import { apiGet } from '@/lib/api';
import { Category } from '../categories/types';

export function useCategories() {
  return useQuery({
    queryKey: ['categories', 'list'],
    queryFn: () => apiGet<Category[]>('/categories'),
  })
}
