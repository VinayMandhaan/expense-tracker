import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CategoriesAppService } from './categories.service';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { Serialize } from '../../common/decorators/serialize.decorator';
import { CategorySummaryView, CategoryView } from '../view/category.view';
import { BudgetView } from '../../budget/view/budget.view';
import { CategoryParam } from './decorators/category-param.decorator';
import { Categories } from '../infra/category.entity';
import { ApiKeyGuard } from '../../common/guards/api-key.guard';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesAppService) {

  }

  @Post()
  @Serialize(CategoryView)
  create(@Body() dto: CreateCategoryDto) {
    return this.categoriesService.create(dto)
  }

  @Get()
  @Serialize(CategoryView)
  getAll() {
    return this.categoriesService.getAll()
  }

  @Get(':id')
  @UseGuards(ApiKeyGuard)
  @Serialize(CategoryView)
  getCategory(@CategoryParam() category: Categories) {
    return category
  }

  @Get(':id/budgets')
  @Serialize(BudgetView)
  getBudgets(@CategoryParam('id') category: Categories) {
    return this.categoriesService.getBudgetsForCategory(category.id)
  }

  @Get(':id/summary')
  @Serialize(CategorySummaryView)
  getSummary(@CategoryParam('id') category: Categories) {
    return this.categoriesService.getSummary(category.id)
  }
}
