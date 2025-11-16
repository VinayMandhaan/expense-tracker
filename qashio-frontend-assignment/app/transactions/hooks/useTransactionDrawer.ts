import * as React from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiSend } from '@/lib/api'
import { extractErrorMessage } from '@/lib/utils'
import { useCategories } from '../../hooks/useCategories'
import { Transaction, TransactionFormValues } from '../types'

interface UseTransactionDrawerOptions {
    selectedData?: Transaction | null
    onUpdated?: (selectedData: Transaction) => void
    onDeleted?: (id: string) => void
    onClose: () => void
}

export interface DrawerDetailItem {
    label: string
    value: string
}

export function useTransactionDrawer({ selectedData, onUpdated, onDeleted, onClose }: UseTransactionDrawerOptions) {
    const queryClient = useQueryClient()
    const { data: categories = [], isLoading: isCategoryLoading } = useCategories()
    const [isEditing, setIsEditing] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState<string | null>(null)

    React.useEffect(() => {
        setIsEditing(false)
        setErrorMessage(null)
    }, [selectedData])

    const updateMutation = useMutation<Transaction, unknown, TransactionFormValues>({
        mutationFn: (values) => {
            if (!selectedData) {
                throw new Error('No transaction selected')
            }
            if (!values.date) {
                throw new Error('Date is required')
            }
            const payload = {
                amount: values.amount,
                date: values.date.toISOString().split('T')[0],
                type: values.type,
                categoryId: values.categoryId || undefined,
            }
            return apiSend<Transaction>(`/transactions/${selectedData.id}`, 'PUT', payload)
        },
        onSuccess: (updated) => {
            queryClient.invalidateQueries({ queryKey: ['transactions'] })
            setIsEditing(false)
            setErrorMessage(null)
            onUpdated?.(updated)
        },
        onError: (err: any) => {
            setErrorMessage(extractErrorMessage(err, 'Failed to update transaction'))
        },
    })

    const deleteMutation = useMutation({
        mutationFn: async () => {
            if (!selectedData) throw new Error('No transaction selected')
            await apiSend(`/transactions/${selectedData.id}`, 'DELETE')
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['transactions'] })
            setIsEditing(false)
            setErrorMessage(null)
            onClose()
            if (selectedData) {
                onDeleted?.(selectedData.id)
            }
        },
        onError: (err: any) => {
            setErrorMessage(extractErrorMessage(err, 'Failed to delete transaction'))
        },
    })

    const handleDelete = () => {
        if (!selectedData) return
        if (window.confirm('Are you sure you want to delete transaction?')) {
            deleteMutation.mutate()
        }
    }

    const typeLabel = selectedData?.type === 'income' ? 'Income' : 'Expense'
    const detailItems: DrawerDetailItem[] = selectedData ? [
            { label: 'Date', value: selectedData.date },
            { label: 'Category', value: selectedData.category?.name ?? 'Uncategorized' },
            { label: 'Type', value: typeLabel },
        ]
        : []

    const lastUpdatedLabel = selectedData
        ? `Last updated ${new Date(selectedData.updatedAt).toDateString()} ${new Date(selectedData.updatedAt).toLocaleTimeString()}` : ''

    const startEditing = () => {
        setErrorMessage(null)
        setIsEditing(true)
    }

    const cancelEditing = () => {
        setIsEditing(false)
        setErrorMessage(null)
    }

    return {
        categories,
        isCategoryLoading,
        isEditing,
        startEditing,
        cancelEditing,
        errorMessage,
        updateMutation,
        deleteMutation,
        handleDelete,
        typeLabel,
        detailItems,
        lastUpdatedLabel,
    }
}
