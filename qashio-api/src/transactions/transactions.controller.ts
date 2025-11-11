import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post, Put, Query } from "@nestjs/common";
import { TransactionsService } from "./transactions.service";
import { CreateTransactionDto } from "./dto/create-transaction.dto";
import { QueryTransactionDto } from "./dto/query-transaction.dto";
import { UpdateTransactionDto } from "./dto/update-transaction.dto";



@Controller('transactions')
export class TransactionsController {
    constructor(private readonly transactionService: TransactionsService) { }

    @Post()
    create(@Body() dto: CreateTransactionDto) {
        return this.transactionService.create(dto)
    }

    @Get()
    getAll(@Query() q: QueryTransactionDto) {
        return this.transactionService.getAll(q)
    }

    @Get(':id') 
    getTransaction(@Param('id', new ParseUUIDPipe()) id: string) {
        return this.transactionService.getTransaction(id)
    }

    @Put(':id') 
    update(@Param('id', new ParseUUIDPipe()) id: string, @Body() dto: UpdateTransactionDto) {
        return this.transactionService.update(id, dto)
    }

    @Delete(':id') 
    deleteTransaction(@Param('id', new ParseUUIDPipe()) id: string) {
        return this.transactionService.deleteTransaction(id)
    }

}