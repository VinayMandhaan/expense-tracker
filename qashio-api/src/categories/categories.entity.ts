import { Budget } from "src/budget/budget.entity";
import { Transactions } from "src/transactions/transactions.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('categories')
export class Categories {
    @PrimaryGeneratedColumn('uuid')
    id: string
    @Column({ unique: true }) 
    name: string
    @OneToMany(() => Transactions, (t) => t.category)
    transactions: Transactions[]
    @OneToMany(() => Budget, (b) => b.category)
    budgets: Budget[]
}