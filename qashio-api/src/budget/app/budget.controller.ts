import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { BudgetAppService } from './budget.service';
import { CreateBudgetDto } from '../dto/create-budget.dto';
import { Serialize } from '../../common/decorators/serialize.decorator';
import { BudgetView, DeleteBudgetView } from '../view/budget.view';
import { ApiKeyGuard } from '../../common/guards/api-key.guard';

@Controller('budget')
@UseGuards(ApiKeyGuard)
export class BudgetController {
  constructor(private readonly budgetService: BudgetAppService) { }

  @Post()
  @Serialize(BudgetView)
  create(@Body() dto: CreateBudgetDto) {
    return this.budgetService.create(dto)
  }

  @Delete(':id')
  @Serialize(DeleteBudgetView)
  delete(@Param('id') id: string) {
    return this.budgetService.delete(id)
  }
}
