import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { CategoryRepository } from '../infra/category.repository';
import { BudgetRepository } from '../../budget/infra/budget.repository';
import { BudgetUsageService } from '../../budget/infra/budget-usage.service';
import {
  CategoryDomainService
} from '../domain/category.domain-service';
import { Budget } from '../../budget/infra/budget.entity';

@Injectable()
export class CategoriesAppService {
  constructor(
    private readonly categoryRepository: CategoryRepository,
    private readonly budgetRepository: BudgetRepository,
    private readonly budgetService: BudgetUsageService,
    private readonly categoryDomain: CategoryDomainService,
  ) { }

  create(dto: CreateCategoryDto) {
    return this.categoryRepository.createCategory(dto)
  }

  getAll() {
    return this.categoryRepository.findAll()
  }

  getById(id: string) {
    return this.categoryRepository.findById(id)
  }

  async getBudgetsForCategory(id: string) {
    await this.categoryRepository.findById(id)
    return this.buildBudgets(id)
  }

  async getSummary(id: string) {
    const category = await this.categoryRepository.findById(id)
    const budgets = await this.buildBudgets(id)
    const totalSpent = await this.budgetService.calculateTotal(id)
    const currentBudget = this.categoryDomain.determineCurrentBudget(budgets)
    return {
      category: this.categoryDomain.mapCategory(category),
      totalSpent,
      budgets,
      currentBudget,
    }
  }

  private async buildBudgets(categoryId: string) {
    const budgets = await this.budgetRepository.findByCategory(categoryId)
    return Promise.all(
      budgets.map((budget) => this.buildBudgetPeriod(budget, categoryId)),
    )
  }

  private async buildBudgetPeriod(budget: Budget, categoryId: string) {
    const spent = await this.budgetService.calculateForRange(
      categoryId,
      budget.startDate,
      budget.endDate,
    )
    return this.categoryDomain.buildBudgetPeriod(budget, spent)
  }
}
