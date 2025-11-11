import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsEnum, IsNumber, IsUUID, isUUID } from "class-validator";



export class CreateTransactionDto {
    @ApiProperty()
    @IsNumber()
    amount: number
    @ApiProperty()
    @IsDateString()
    date: string
    @ApiProperty()
    @IsEnum(['income', 'expense'])
    type: 'income' | 'expense'
    @ApiProperty()
    @IsUUID()
    categoryId: string;

}