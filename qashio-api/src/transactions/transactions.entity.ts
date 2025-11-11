import { Categories } from "src/categories/categories.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


@Entity('transactions')
export class Transactions {
    @PrimaryGeneratedColumn('uuid') 
    id: string
    @Column('numeric')
    amount: number
    @Column({ type: 'date' }) 
    date: string
    @Column({ 
        type: 'enum', 
        enum: ['income', 'expense'] 
    })
    @ManyToOne(() => Categories, (c) => c.transactions)
    category: Categories;
    @CreateDateColumn() 
    createdAt: Date
    @UpdateDateColumn() 
    updatedAt: Date
}