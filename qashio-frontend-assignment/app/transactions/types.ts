import { Category, TransactionType } from "../types";

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