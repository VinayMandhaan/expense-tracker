import { Categories } from "src/categories/categories.entity"
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm"


@Entity('budget')
export class Budget {
    @PrimaryGeneratedColumn('uuid')
    id: string
    @Column('numeric')
    amount: number
    @Column({ type: 'date' })
    startDate: string
    @Column({ type: 'date' })
    endDate: string
    @ManyToOne(() => Categories, (c) => c.budgets)
    category: Categories
}