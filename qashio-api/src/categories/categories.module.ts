import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesController } from './app/categories.controller';
import { CategoriesAppService } from './app/categories.service';
import { Categories } from './infra/category.entity';
import { CategoryRepository } from './infra/category.repository';
import { BudgetModule } from '../budget/budget.module';
import { CategoryByIdPipe } from './app/pipes/category-by-id.pipe';
import { ApiKeyGuard } from '../common/guards/api-key.guard';
import { CategoryDomainService } from './domain/category.domain-service';

@Module({
  imports: [TypeOrmModule.forFeature([Categories]), BudgetModule],
  controllers: [CategoriesController],
  providers: [
    CategoriesAppService,
    CategoryRepository,
    CategoryByIdPipe,
    ApiKeyGuard,
    CategoryDomainService,
  ],
  exports: [CategoriesAppService, CategoryRepository],
})
export class CategoriesModule {}
