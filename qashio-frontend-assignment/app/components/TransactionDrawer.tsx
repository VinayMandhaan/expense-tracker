'use client';
import * as React from 'react';
import { Drawer, Box, Typography, Stack, IconButton, TextField, MenuItem, Button, Alert, Chip, Paper } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import type { Transaction, Category } from '../types'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiGet, apiSend } from '@/lib/api';
import PrimaryActionButton from './PrimaryActionButton';
import type { SxProps, Theme } from '@mui/material/styles';
import { extractErrorMessage, formatCurrency } from '@/lib/utils';

interface Props {
    open: boolean;
    onClose: () => void;
    selectedData?: Transaction | null;
    onUpdated?: (selectedData: Transaction) => void;
    onDeleted?: (id: string) => void;
}

const DetailItem = ({ label, value }: { label: string; value: React.ReactNode }) => (
    <Stack spacing={0.5}>
        <Typography variant="caption" color="text.secondary">
            {label}
        </Typography>
        <Typography fontWeight={600}>{value}</Typography>
    </Stack>
)

const boxStyle: SxProps<Theme> = {
    borderRadius: 4,
    borderColor: '#ececec',
    p: 3,
    bgcolor: '#fff',
}

export default function TransactionDrawer({ open, onClose, selectedData, onUpdated, onDeleted }: Props) {
    const queryClient = useQueryClient()
    const { data: categories } = useQuery({
        queryKey: ['categories', 'list'],
        queryFn: () => apiGet<Category[]>('/categories'),
    })
    const [isEditing, setIsEditing] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState<string | null>(null)
    const [amountValue, setAmountValue] = React.useState('')
    const [dateValue, setDateValue] = React.useState('')
    const [transactionType, setTransactionType] = React.useState<Transaction['type']>('expense')
    const [categoryId, setCategoryId] = React.useState('')


    React.useEffect(() => {
        if (!selectedData) {
            setAmountValue('')
            setDateValue('')
            setTransactionType('expense')
            setCategoryId('')
            setIsEditing(false)
            setErrorMessage(null)
            return
        }
        setAmountValue(typeof selectedData.amount === 'number' ? selectedData.amount.toString() : selectedData.amount ?? '')
        setDateValue(selectedData.date ? selectedData.date.substring(0, 10) : '')
        setTransactionType(selectedData.type)
        setCategoryId(selectedData.category?.id ?? '')
        setIsEditing(false)
        setErrorMessage(null)
    }, [selectedData])

    const updateMutation = useMutation<Transaction>({
        mutationFn: () => {
            if (!selectedData) {
                throw new Error('No transaction selected')
            }
            const parsedAmount = Number.parseFloat(amountValue)
            if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
                throw new Error('Amount must be greater than zero')
            }
            if (!dateValue) {
                throw new Error('Date is required')
            }
            const payload = {
                amount: parsedAmount,
                date: dateValue,
                type: transactionType,
                categoryId: categoryId || undefined,
            }
            return apiSend<Transaction>(`/transactions/${selectedData.id}`, 'PUT', payload)
        },
        onSuccess: (updated) => {
            queryClient.invalidateQueries({ queryKey: ['transactions'] })
            setAmountValue(typeof updated.amount === 'number' ? updated.amount.toString() : updated.amount ?? '')
            setDateValue(updated.date ? updated.date.substring(0, 10) : '')
            setTransactionType(updated.type)
            setCategoryId(updated.category?.id ?? '')
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
    const detailItems = selectedData
        ? [
            { label: 'Date', value: selectedData.date},
            { label: 'Category', value: selectedData.category?.name ?? '' },
            { label: 'Type', value: typeLabel },
        ]
        : []

    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={onClose}
            PaperProps={{
                sx: {
                    width: 460,
                    borderTopLeftRadius: 24,
                    borderBottomLeftRadius: 24,
                    overflow: 'hidden',
                },
            }}
        >
            <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', bgcolor: '#f9fafb' }}>
                <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{ px: 3, py: 2.5, borderBottom: '1px solid', borderColor: '#ececec' }}
                >
                    <Stack spacing={0.5}>
                        <Typography variant="overline" color="text.secondary" letterSpacing={1}>
                            Transaction
                        </Typography>
                        <Typography variant="h6" fontWeight={600}>
                            {selectedData?.category?.name ?? 'Details'}
                        </Typography>
                    </Stack>
                    <IconButton onClick={onClose}>
                        <CloseIcon />
                    </IconButton>
                </Stack>
                <Box sx={{ flex: 1, overflowY: 'auto', p: 3, pt: 2 }}>
                    {!selectedData ? (
                        <Stack spacing={1} alignItems="center" justifyContent="center" sx={{ py: 6 }}>
                            <Typography fontWeight={600}>No transaction selected</Typography>
                            <Typography color="text.secondary" variant="body2" align="center">
                                Choose a transaction from the list to see full details.
                            </Typography>
                        </Stack>
                    ) : (
                        <Stack spacing={3}>
                            {errorMessage && (
                                <Alert severity="error" variant="outlined">
                                    {errorMessage}
                                </Alert>
                            )}
                            <Paper variant="outlined" sx={{ ...boxStyle, pt: 4, pb: 4 }}>
                                <Stack spacing={2}>
                                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                                        <Stack spacing={0.5}>
                                            <Typography variant="caption" color="text.secondary">
                                                Current Amount
                                            </Typography>
                                            <Typography variant="h4" fontWeight={700}>
                                                {formatCurrency(Number(selectedData.amount))}
                                            </Typography>
                                        </Stack>
                                        <Chip
                                            label={typeLabel}
                                            color={selectedData.type === 'expense' ? 'error' : 'success'}
                                            variant="filled"
                                            size="small"
                                            sx={{ fontWeight: 600 }}
                                        />
                                    </Stack>
                                    <Stack direction="row" spacing={1.5} flexWrap="wrap" alignItems="center">
                                        <Chip
                                            label={selectedData.category?.name ?? 'Uncategorized'}
                                            size="small"
                                            variant="outlined"
                                            sx={{ borderRadius: 2 }}
                                        />
                                        <Typography variant="body2" color="text.secondary">
                                            {selectedData.date}
                                        </Typography>
                                    </Stack>
                                </Stack>
                            </Paper>

                            {isEditing ? (
                                <Paper variant="outlined" sx={boxStyle}>
                                    <Stack spacing={2}>
                                        <Typography fontWeight={600}>Update transaction</Typography>
                                        <TextField
                                            label="Amount"
                                            type="number"
                                            value={amountValue}
                                            onChange={(e) => setAmountValue(e.target.value)}
                                            fullWidth
                                        />
                                        <TextField
                                            label="Date"
                                            type="date"
                                            value={dateValue}
                                            onChange={(e) => setDateValue(e.target.value)}
                                            fullWidth
                                            InputLabelProps={{ shrink: true }}
                                        />
                                        <TextField
                                            label="Type"
                                            select
                                            value={transactionType}
                                            onChange={(e) => setTransactionType(e.target.value as Transaction['type'])}
                                            fullWidth
                                        >
                                            <MenuItem value="income">Income</MenuItem>
                                            <MenuItem value="expense">Expense</MenuItem>
                                        </TextField>
                                        <TextField
                                            label="Category"
                                            select
                                            value={categoryId}
                                            onChange={(e) => setCategoryId(e.target.value)}
                                            fullWidth
                                        >
                                            <MenuItem value="">None</MenuItem>
                                            {categories?.map((category) => (
                                                <MenuItem key={category.id} value={category.id}>
                                                    {category.name}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </Stack>
                                </Paper>
                            ) : (
                                <Paper variant="outlined" sx={boxStyle}>
                                    <Stack spacing={2}>
                                        <Typography fontWeight={600}>Details</Typography>
                                        <Box
                                            sx={{
                                                display: 'grid',
                                                gap: 2,
                                            }}
                                        >
                                            {detailItems.map((item) => (
                                                <DetailItem key={item.label} label={item.label} value={item.value} />
                                            ))}
                                        </Box>
                                    </Stack>
                                </Paper>
                            )}
                        </Stack>
                    )}
                </Box>
                <Box sx={{ borderTop: '1px solid', borderColor: '#ececec', px: 3, py: 2.5 }}>
                    {!selectedData ? null : (
                        <Stack direction="column" alignItems="center" justifyContent="space-between" spacing={2}>
                            <Typography variant="caption" color="text.secondary">
                                Last updated {new Date(selectedData.updatedAt).toDateString()} {new Date(selectedData.updatedAt).toLocaleTimeString()}
                            </Typography>
                            <Stack direction="row" spacing={1}>
                                {isEditing ? (
                                    <>
                                        <Button
                                            variant="outlined"
                                            startIcon={<CancelIcon />}
                                            onClick={() => {
                                                setIsEditing(false)
                                                setErrorMessage(null);
                                            }}
                                        >
                                            Cancel
                                        </Button>
                                        <PrimaryActionButton
                                            startIcon={<SaveIcon />}
                                            onClick={() => updateMutation.mutate()}
                                            disabled={updateMutation.isPending}
                                        >
                                            {updateMutation.isPending ? 'Saving' : 'Save changes'}
                                        </PrimaryActionButton>
                                    </>
                                ) : (
                                    <>
                                        <Button
                                            variant="outlined"
                                            color="error"
                                            startIcon={<DeleteIcon />}
                                            onClick={handleDelete}
                                            disabled={deleteMutation.isPending}
                                        >
                                            {deleteMutation.isPending ? 'Deleting' : 'Delete'}
                                        </Button>
                                        <PrimaryActionButton
                                            startIcon={<EditIcon />}
                                            onClick={() => setIsEditing(true)}
                                        >
                                            Edit
                                        </PrimaryActionButton>
                                    </>
                                )}
                            </Stack>
                        </Stack>
                    )}
                </Box>
            </Box>
        </Drawer>
    )
}
