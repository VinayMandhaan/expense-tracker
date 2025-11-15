import { Expose, Type } from 'class-transformer';
import { CategoryView } from '../../categories/view/category.view';

export class TransactionView {
  @Expose()
  id: string

  @Expose()
  amount: number

  @Expose()
  date: string

  @Expose()
  type: 'income' | 'expense'

  @Expose()
  @Type(() => CategoryView)
  category: CategoryView

  @Expose()
  createdAt: Date

  @Expose()
  updatedAt: Date
}

class TransactionListMetaView {
  @Expose()
  total: number

  @Expose()
  page: number

  @Expose()
  limit: number

  @Expose()
  pages: number
}

export class TransactionsListView {
  @Expose()
  @Type(() => TransactionView)
  items: TransactionView[]

  @Expose()
  @Type(() => TransactionListMetaView)
  meta: TransactionListMetaView
}

export class DeleteTransactionView {
  @Expose()
  id: string
}
