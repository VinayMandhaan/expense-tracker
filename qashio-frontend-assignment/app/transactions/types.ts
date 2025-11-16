import { Category } from "../categories/types";
import { TransactionType } from "../types";

export type FilterOption = { label: string; value: string }
export interface TransactionFormValues {
    amount: number
    date: Date | null
    type: TransactionType
    categoryId: string
}

export interface TransactionFormProps {
    formId?: string
    defaultValues: TransactionFormValues
    categories: Category[]
    isCategoryLoading?: boolean
    onSubmit: (values: TransactionFormValues) => void
}

export interface Transaction {
    id: string
    amount: number
    date: string
    type: TransactionType
    category: Category | null
    createdAt: string
    updatedAt: string
}

export interface UseTransactionsOptions {
    page: number
    limit: number
    search?: string
    type?: string
    categoryId?: string
    sort?: string
}