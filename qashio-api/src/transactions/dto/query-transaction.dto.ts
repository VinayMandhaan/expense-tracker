import { IsDateString, IsOptional, IsString, IsUUID, IsEnum } from 'class-validator';
import { PaginationDto } from 'src/common/dto/pagination.dto';


export class QueryTransactionDto extends PaginationDto {
    @IsOptional()
    @IsUUID()
    categoryId?: string
    @IsOptional()
    @IsDateString()
    from?: string
    @IsOptional()
    @IsDateString()
    to?: string
    @IsOptional()
    @IsEnum(['income', 'expense'])
    type?: 'income' | 'expense'
    @IsOptional()
    @IsString()
    search?: string
    @IsOptional()
    @IsString()
    sort?: string;
}