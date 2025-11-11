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
}