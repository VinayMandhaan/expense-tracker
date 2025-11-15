import { Injectable } from '@nestjs/common';
import { CreateBudgetDto } from '../dto/create-budget.dto';
import { BudgetRepository } from '../infra/budget.repository';
import { BudgetUsageService } from '../infra/budget-usage.service';
import { BudgetDomainService } from '../domain/budget.domain-service';

@Injectable()
export class BudgetAppService {
  constructor(
    private readonly budgetRepository: BudgetRepository,
    private readonly budgetService: BudgetUsageService,
    private readonly domainService: BudgetDomainService,
  ) {}

  async create(dto: CreateBudgetDto) {
    const budget = await this.budgetRepository.createBudget(dto)
    const spent = await this.budgetService.calculateForRange(
      dto.categoryId,
      dto.startDate,
      dto.endDate,
    );
    return this.domainService.buildBudgetView(budget, spent)
  }

  async delete(id: string) {
    const budget = await this.budgetRepository.findById(id)
    await this.budgetRepository.remove(budget)
    return { id: budget.id }
  }
}
