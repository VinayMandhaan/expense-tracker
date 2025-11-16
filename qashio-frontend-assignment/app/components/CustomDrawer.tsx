'use client';

import { Drawer, Box, Stack, Alert } from '@mui/material'
import TransactionSummaryCard from './drawer/TransactionSummaryCard'
import TransactionDetailsCard from './drawer/TransactionDetailsCard'
import TransactionFormCard from './drawer/TransactionFormCard'
import TransactionDrawerFooter from './drawer/DrawerFooter'
import { Transaction } from '../transactions/types'
import { useTransactionDrawer } from '../transactions/hooks/useTransactionDrawer'
import DrawerHeader from './drawer/DrawerHeader';
import DrawerEmptyState from './drawer/DrawerEmptyState';
import DrawerFooter from './drawer/DrawerFooter';
const FORM_ID = 'transaction-drawer-form'

interface Props {
    open: boolean
    onClose: () => void
    selectedData?: Transaction | null
    onUpdated?: (selectedData: Transaction) => void
    onDeleted?: (id: string) => void
}


export default function CustomDrawer({ open, onClose, selectedData, onUpdated, onDeleted }: Props) {
    const headerTitle = selectedData?.category?.name ? selectedData?.category?.name : 'Details'
    const {
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
    } = useTransactionDrawer({ selectedData, onUpdated, onDeleted, onClose })
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
                <DrawerHeader title={headerTitle} onClose={onClose} />
                <Box sx={{ flex: 1, overflowY: 'auto', p: 3, pt: 2 }}>
                    {!selectedData ? (
                        <DrawerEmptyState />
                    ) : (
                        <Stack spacing={3}>
                            {errorMessage && (
                                <Alert severity="error" variant="outlined">
                                    {errorMessage}
                                </Alert>
                            )}
                            <TransactionSummaryCard
                                amount={selectedData.amount}
                                categoryName={selectedData.category?.name ?? 'Uncategorized'}
                                date={selectedData.date}
                                type={selectedData.type}
                                typeLabel={typeLabel}
                            />
                            {isEditing ? (
                                <TransactionFormCard
                                    formId={FORM_ID}
                                    formKey={`${selectedData.id}-${isEditing}`}
                                    categories={categories}
                                    isCategoryLoading={isCategoryLoading}
                                    selectedData={selectedData}
                                    onSubmit={(values) => updateMutation.mutate(values)}
                                />
                            ) : (
                                <TransactionDetailsCard details={detailItems} />
                            )}
                        </Stack>
                    )}
                </Box>
                {selectedData && lastUpdatedLabel && (
                    <Box sx={{ borderTop: '1px solid', borderColor: '#ececec', px: 3, py: 2.5 }}>
                        <DrawerFooter
                            isEditing={isEditing}
                            lastUpdatedLabel={lastUpdatedLabel}
                            isSaving={updateMutation.isPending}
                            isDeleting={deleteMutation.isPending}
                            onCancelEdit={cancelEditing}
                            onConfirmEdit={startEditing}
                            onDelete={handleDelete}
                        />
                    </Box>
                )}
            </Box>
        </Drawer>
    )
}
