import { apiGet, apiSend } from '@/lib/api'
import { Category, CategorySummary } from '../types'

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

export function getCategoriesSummary() {
  return apiGet<CategorySummary[]>('/categories/summary')
}

export function getCategorySummary(categoryId: string) {
  return apiGet<CategorySummary>(`/categories/${categoryId}/summary`)
}
