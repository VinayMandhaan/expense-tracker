import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsNumber, IsOptional, Min } from 'class-validator';

export class UpdateCategoryBudgetDto {
  @ApiPropertyOptional()
  @IsNumber()
  @Min(0.01)
  @IsOptional()
  amount?: number

  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  startDate?: string

  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  endDate?: string
}
