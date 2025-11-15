import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNumber, IsUUID } from 'class-validator';

export class CreateBudgetDto {
  @ApiProperty()
  @IsNumber()
  amount: number

  @ApiProperty()
  @IsUUID()
  categoryId: string

  @ApiProperty()
  @IsDateString()
  startDate: string

  @ApiProperty()
  @IsDateString()
  endDate: string
}
