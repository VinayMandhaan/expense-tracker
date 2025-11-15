import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TransactionsAppService } from './transactions.service';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { QueryTransactionDto } from '../dto/query-transaction.dto';
import { UpdateTransactionDto } from '../dto/update-transaction.dto';
import { Serialize } from '../../common/decorators/serialize.decorator';
import {
  DeleteTransactionView,
  TransactionView,
  TransactionsListView,
} from '../view/transaction.view';
import { TransactionParam } from './decorators/transaction-param.decorator';
import { Transactions } from '../infra/transaction.entity';
import { ApiKeyGuard } from '../../common/guards/api-key.guard';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionService: TransactionsAppService) {}

  @Post()
  @UseGuards(ApiKeyGuard)
  @Serialize(TransactionView)
  create(@Body() dto: CreateTransactionDto) {
    return this.transactionService.create(dto);
  }

  @Get()
  @Serialize(TransactionsListView)
  @UseGuards(ApiKeyGuard)
  getAll(@Query() q: QueryTransactionDto) {
    return this.transactionService.getAll(q);
  }

  @Get(':id')
  @Serialize(TransactionView)
  getTransaction(@TransactionParam() transaction: Transactions) {
    return transaction;
  }

  @Put(':id')
  @UseGuards(ApiKeyGuard)
  @Serialize(TransactionView)
  update(
    @TransactionParam() transaction: Transactions,
    @Body() dto: UpdateTransactionDto,
  ) {
    return this.transactionService.update(transaction, dto);
  }

  @Delete(':id')
  @UseGuards(ApiKeyGuard)
  @Serialize(DeleteTransactionView)
  deleteTransaction(@TransactionParam() transaction: Transactions) {
    return this.transactionService.delete(transaction);
  }
}
