import { Categories } from "src/categories/categories.entity"
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm"


@Entity('budget')
export class Budget {
    @PrimaryGeneratedColumn('uuid')
    id: string
    @Column('numeric')
    amount: number
    @Column({ type: 'date' })
    periodStart: string
    @Column({ type: 'date' })
    periodEnd: string
    @ManyToOne(() => Categories, (c) => c.budgets)
    category: Categories
}