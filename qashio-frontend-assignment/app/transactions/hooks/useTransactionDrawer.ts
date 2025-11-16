import * as React from 'react'
import { useCategories } from '../../hooks/useCategories'
import { Transaction } from '../types'
import { useTransactionMutations } from './useTransactionMutations'

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
    const { data: categories = [], isLoading: isCategoryLoading } = useCategories()
    const [isEditing, setIsEditing] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState<string | null>(null)

    React.useEffect(() => {
        setIsEditing(false)
        setErrorMessage(null)
    }, [selectedData])

    const { updateMutation, deleteMutation } = useTransactionMutations({
        selectedData,
        onUpdated,
        onDeleted,
        onClose,
        resetEditingState: () => setIsEditing(false),
        setErrorMessage,
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

    const lastUpdatedLabel = selectedData ? `Last updated ${new Date(selectedData.updatedAt).toDateString()} ${new Date(selectedData.updatedAt).toLocaleTimeString()}` : ''

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
