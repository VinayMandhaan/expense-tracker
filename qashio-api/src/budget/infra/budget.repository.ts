import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Budget } from './budget.entity';
import { CreateBudgetDto } from '../dto/create-budget.dto';
import { Categories } from '../../categories/infra/category.entity';

@Injectable()
export class BudgetRepository {
  constructor(
    @InjectRepository(Budget) private readonly repo: Repository<Budget>,
  ) { }

  async createBudget(dto: CreateBudgetDto) {
    const budget = this.repo.create({
      amount: dto.amount,
      startDate: dto.startDate,
      endDate: dto.endDate,
      category: { id: dto.categoryId } as Categories,
    })
    return this.repo.save(budget)
  }

  async findByCategory(categoryId: string) {
    return this.repo.find({
      where: {
        category: {
          id: categoryId
        }
      }
    })
  }

  async findByIdAndCategory(id: string, categoryId: string) {
    const budget = await this.repo.findOne({
      where: {
        id,
        category: {
          id: categoryId
        }
      }
    })
    if (!budget) {
      throw new NotFoundException('budget not found')
    }
    return budget
  }

  async findById(id: string) {
    const budget = await this.repo.findOne({ where: { id } })
    if (!budget) {
      throw new NotFoundException('budget not found')
    }
    return budget
  }

  save(budget: Budget) {
    return this.repo.save(budget)
  }

  remove(budget: Budget) {
    return this.repo.remove(budget)
  }
}
