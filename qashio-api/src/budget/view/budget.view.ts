import { Expose } from 'class-transformer';

export class BudgetView {
  @Expose()
  id: string

  @Expose()
  amount: number

  @Expose()
  startDate: string

  @Expose()
  endDate: string

  @Expose()
  spent: number

  @Expose()
  remaining: number
}

export class DeleteBudgetView {
  @Expose()
  id: string
}
