import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { TransactionsService } from "./transactions.service";
import { CreateTransactionDto } from "./dto/create-transaction.dto";
import { QueryTransactionDto } from "./dto/query-transaction.dto";



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


}