import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('categories')
export class Categories {
    @PrimaryGeneratedColumn('uuid')
    id: string
    @Column({ unique: true }) 
    name: string
}