import { useMutation, useQueryClient } from '@tanstack/react-query'
import { extractErrorMessage } from '@/lib/utils'
import { Transaction, TransactionFormValues } from '../types'
import { deleteTransaction, updateTransaction } from '../request/transactionRequest'

interface UseTransactionMutationsParams {
  selectedData?: Transaction | null
  onUpdated?: (transaction: Transaction) => void
  onDeleted?: (id: string) => void
  onClose: () => void
  resetEditingState: () => void
  setErrorMessage: (message: string | null) => void
}

export function useTransactionMutations({
  selectedData,
  onUpdated,
  onDeleted,
  onClose,
  resetEditingState,
  setErrorMessage,
}: UseTransactionMutationsParams) {
  const queryClient = useQueryClient()

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
      return updateTransaction(selectedData.id, payload)
    },
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      resetEditingState()
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
      await deleteTransaction(selectedData.id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      resetEditingState()
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

  return { updateMutation, deleteMutation }
}
