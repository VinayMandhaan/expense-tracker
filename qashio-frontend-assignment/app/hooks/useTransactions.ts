'use client';

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Transaction, UseTransactionsOptions } from '../transactions/types';
import { getTransactions } from '../transactions/request/transactionRequest';

export function useTransactions(options: UseTransactionsOptions) {
  const params = useMemo(() => {
    const searchParams = new URLSearchParams({
      page: String(options.page),
      limit: String(options.limit),
    })
    if (options.search?.trim()) {
      searchParams.set('search', options.search.trim())
    }
    if (options.type) {
      searchParams.set('type', options.type)
    }
    if (options.categoryId) {
      searchParams.set('categoryId', options.categoryId)
    }
    if (options.sort) {
      searchParams.set('sort', options.sort)
    }
    return searchParams.toString()
  }, [options.categoryId, options.limit, options.page, options.search, options.sort, options.type])

  return useQuery({
    queryKey: ['transactions', options.page, options.limit, options.search ? options.search : '', options.type ? options.type : '', options.categoryId ? options.categoryId : '', options.sort ? options.sort : ''],
    queryFn: () => getTransactions(params),
    placeholderData: (previous) => previous,
  })
}
