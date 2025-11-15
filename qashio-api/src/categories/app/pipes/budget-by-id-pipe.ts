import { Injectable, PipeTransform } from '@nestjs/common';
import { Categories } from '../../infra/category.entity';
import { CategoryRepository } from '../../infra/category.repository';
import { Budget } from 'src/budget/infra/budget.entity';
import { BudgetRepository } from 'src/budget/infra/budget.repository';

@Injectable()
export class BudgetByIdPipe
    implements PipeTransform<string, Promise<Budget>> {
    constructor(private readonly budgetRepository: BudgetRepository) { }

    transform(value: string): Promise<Budget> {
        return this.budgetRepository.findByIdOrFail(value)
    }
}
