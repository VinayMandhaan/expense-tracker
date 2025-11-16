import { apiSend } from '@/lib/api'

interface CreateBudgetPayload {
  amount: number
  categoryId: string
  startDate: string
  endDate: string
}

export function createCategoryBudget(payload: CreateBudgetPayload) {
  return apiSend('/budget', 'POST', payload)
}

export function deleteCategoryBudget(budgetId: string) {
  return apiSend(`/budget/${budgetId}`, 'DELETE')
}
