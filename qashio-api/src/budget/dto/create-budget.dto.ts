import { IsDateString, IsNumber, IsUUID } from "class-validator";


export class CreateBudgetDto {
    @IsNumber()
    amount: number
    @IsDateString()
    startDate: string
    endDate: string
    @IsUUID()
    categoryId: string
}