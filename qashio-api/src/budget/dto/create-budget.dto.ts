import { IsDateString, IsNumber, IsUUID } from "class-validator";


export class CreateBudgetDto {
    @IsNumber()
    amount: number
    @IsUUID()
    categoryId: string
    @IsDateString()
    startDate: string
    @IsDateString()
    endDate: string
}
