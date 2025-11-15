export interface BudgetPeriodModel {
    id: string
    amount: number
    startDate: string
    endDate: string
    spent: number
    remaining: number
}

export interface CategorySnapshot {
    id: string
    name: string
}