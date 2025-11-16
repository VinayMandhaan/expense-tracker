import * as React from 'react'
import { Button, Stack, Typography } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import SaveIcon from '@mui/icons-material/Save'
import CancelIcon from '@mui/icons-material/Cancel'
import PrimaryActionButton from '../PrimaryActionButton'

interface DrawerFooterProps {
    isEditing: boolean
    lastUpdatedLabel: string
    isSaving: boolean
    isDeleting: boolean
    onCancelEdit: () => void
    onConfirmEdit: () => void
    onDelete: () => void
    formId?: string
}

export default function DrawerFooter({
    isEditing,
    lastUpdatedLabel,
    isSaving,
    isDeleting,
    onCancelEdit,
    onConfirmEdit,
    onDelete,
    formId,
}: DrawerFooterProps) {
    const handleSaveClick = React.useCallback(() => {
        if (!formId) return
        const formElement = document.getElementById(formId) as HTMLFormElement | null
        formElement?.requestSubmit()
    }, [formId])

    return (
        <Stack direction="column" alignItems="center" justifyContent="space-between" spacing={2}>
            <Typography variant="caption" color="text.secondary">
                {lastUpdatedLabel}
            </Typography>
            <Stack direction="row" spacing={1}>
                {isEditing ? (
                    <>
                        <Button variant="outlined" startIcon={<CancelIcon />} onClick={onCancelEdit}>
                            Cancel
                        </Button>
                        <PrimaryActionButton
                            type="button"
                            startIcon={<SaveIcon />}
                            disabled={isSaving}
                            onClick={handleSaveClick}
                        >
                            {isSaving ? 'Saving' : 'Save changes'}
                        </PrimaryActionButton>
                    </>
                ) : (
                    <>
                        <Button
                            variant="outlined"
                            color="error"
                            startIcon={<DeleteIcon />}
                            onClick={onDelete}
                            disabled={isDeleting}
                        >
                            {isDeleting ? 'Deleting' : 'Delete'}
                        </Button>
                        <PrimaryActionButton type="button" startIcon={<EditIcon />} onClick={onConfirmEdit}>
                            Edit
                        </PrimaryActionButton>
                    </>
                )}
            </Stack>
        </Stack>
    )
}
