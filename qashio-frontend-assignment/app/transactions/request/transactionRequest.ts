import { apiGet, apiSend } from '@/lib/api'
import type { Paginated } from '@/app/types'
import { Transaction, TransactionFormValues, CreateTransactionPayload, UpdateTransactionPayload } from '../types'

export function createTransaction(payload: CreateTransactionPayload) {
  return apiSend<Transaction>('/transactions', 'POST', payload)
}

export function updateTransaction(id: string, payload: UpdateTransactionPayload) {
  return apiSend<Transaction>(`/transactions/${id}`, 'PUT', payload)
}

export function deleteTransaction(id: string) {
  return apiSend(`/transactions/${id}`, 'DELETE')
}

export function getTransactions(queryString: string) {
  return apiGet<Paginated<Transaction>>(`/transactions?${queryString}`)
}
