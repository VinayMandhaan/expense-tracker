import { IsDateString, IsEnum, IsNumber, IsUUID, isUUID } from "class-validator";



export class CreateTransactionDto {
    @IsNumber()
    amount: number
    @IsDateString()
    date: string
    @IsEnum(['income', 'expense'])
    type: 'income' | 'expense'
    @IsUUID()
    categoryId: string;

}