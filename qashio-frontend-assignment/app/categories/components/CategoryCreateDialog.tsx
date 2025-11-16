import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material'
import PrimaryActionButton from '@/app/components/PrimaryActionButton'
import BudgetDialogContent from './BudgetDialogContent'
import { BudgetFormValues } from './BudgetForm'

interface CategoryCreateDialogProps {
  open: boolean
  showBudgetForm: boolean
  success: boolean
  isSaving: boolean
  errorMessage: string | null
  onClose: () => void
  onShowBudgetForm: () => void
  onSubmitBudget: (values: BudgetFormValues) => void
}

export default function CategoryCreateDialog({
  open,
  showBudgetForm,
  success,
  isSaving,
  errorMessage,
  onClose,
  onShowBudgetForm,
  onSubmitBudget,
}: CategoryCreateDialogProps) {
  const showPrompt = !showBudgetForm && !success
  const title = success ? 'Budget Added' : showBudgetForm ? 'Add a Budget' : 'Category Created'

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent dividers>
        {showPrompt && (
          <Typography sx={{ mb: 2 }}>
            Category was created successfully. Would you like to add a budget for this category now?
          </Typography>
        )}
        <BudgetDialogContent
          showForm={showBudgetForm}
          success={success}
          errorMessage={errorMessage}
          isSaving={isSaving}
          onSubmit={onSubmitBudget}
          formId="new-category-budget-form"
          successDescription="You can manage this category and its budgets anytime from the categories page."
        />
      </DialogContent>
      <DialogActions>
        {showPrompt && (
          <>
            <Button onClick={onClose}>Maybe later</Button>
            <PrimaryActionButton onClick={onShowBudgetForm}>
              Add Budget
            </PrimaryActionButton>
          </>
        )}
        {showBudgetForm && !success && (
          <>
            <Button onClick={onClose} disabled={isSaving}>
              Skip
            </Button>
            <PrimaryActionButton type="submit" form="new-category-budget-form" disabled={isSaving}>
              {isSaving ? 'Saving' : 'Save Budget'}
            </PrimaryActionButton>
          </>
        )}
        {success && (
          <PrimaryActionButton onClick={onClose}>
            Done
          </PrimaryActionButton>
        )}
      </DialogActions>
    </Dialog>
  )
}
