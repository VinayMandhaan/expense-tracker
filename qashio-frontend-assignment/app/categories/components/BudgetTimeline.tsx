import {
  Alert,
  Chip,
  CircularProgress,
  Divider,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import CustomTableHead from '@/app/components/CustomTableHead'
import { formatCurrency } from '@/lib/utils'
import { CategorySummary } from '../types'

interface BudgetTimelineProps {
  budgets: CategorySummary['budgets']
  deletingBudgetId: string | null
  errorMessage?: string | null
  onDelete: (budgetId: string) => void
}

export default function BudgetTimeline({ budgets, deletingBudgetId, errorMessage, onDelete }: BudgetTimelineProps) {
  return (
    <Paper variant="outlined">
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', md: 'center' }}
        sx={{ p: 3, pb: 0, gap: 2 }}
      >
        <Stack>
          <Typography variant="h6" fontWeight={600}>
            Budget Timeline
          </Typography>
          <Typography color="text.secondary">Historical view of budget periods</Typography>
        </Stack>
      </Stack>
      <Divider sx={{ mt: 2 }} />
      {errorMessage && (
        <Alert severity="error" sx={{ mx: 3, mt: 2 }}>
          {errorMessage}
        </Alert>
      )}
      <Table>
        <CustomTableHead
          columns={[
            { label: 'Period' },
            { label: 'Amount' },
            { label: 'Spent' },
            { label: 'Remaining' },
            { label: 'Status', align: 'right' },
          ]}
        />
        <TableBody>
          {budgets.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5}>
                <Typography color="text.secondary" textAlign="center">
                  No budgets found for this category
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            budgets.map((budget) => {
              const status = budget.remaining >= 0 ? 'On Track' : 'Exceeded'
              const color = budget.remaining >= 0 ? 'success' : 'error'
              const isDeleting = deletingBudgetId === budget.id
              return (
                <TableRow key={budget.id}>
                  <TableCell>
                    <Typography fontWeight={600}>
                      {budget.startDate} – {budget.endDate}
                    </Typography>
                  </TableCell>
                  <TableCell>{formatCurrency(budget.amount)}</TableCell>
                  <TableCell>{formatCurrency(budget.spent)}</TableCell>
                  <TableCell>{formatCurrency(budget.remaining)}</TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={1} justifyContent="flex-end" alignItems="center">
                      <Chip label={status} color={color} size="small" />
                      <Tooltip title="Delete budget">
                        <span>
                          <IconButton size="small" color="error" disabled={isDeleting} onClick={() => onDelete(budget.id)}>
                            {isDeleting ? <CircularProgress size={18} /> : <DeleteOutlineIcon fontSize="small" />}
                          </IconButton>
                        </span>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              )
            })
          )}
        </TableBody>
      </Table>
    </Paper>
  )
}
