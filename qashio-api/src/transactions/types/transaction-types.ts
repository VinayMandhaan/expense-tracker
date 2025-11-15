export interface TransactionCreatedEvent {
    id: string
    amount: number
    categoryId?: string
    date: string
    type: 'income' | 'expense'
}
