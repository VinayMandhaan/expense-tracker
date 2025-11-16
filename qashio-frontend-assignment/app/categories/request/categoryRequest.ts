import { apiSend } from '@/lib/api'
import { Category } from '../types'

interface CreateBudgetPayload {
  amount: number
  categoryId: string
  startDate: string
  endDate: string
}

export function createCategory(payload: { name: string }) {
  return apiSend<Category>('/categories', 'POST', payload)
}

export function createCategoryBudget(payload: CreateBudgetPayload) {
  return apiSend('/budget', 'POST', payload)
}

export function deleteCategoryBudget(budgetId: string) {
  return apiSend(`/budget/${budgetId}`, 'DELETE')
}
