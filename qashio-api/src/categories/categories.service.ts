import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { Categories } from "./categories.entity";
import { Repository } from "typeorm";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Transactions } from "src/transactions/transactions.entity";
import { Budget } from "src/budget/budget.entity";


@Injectable()
export class CategoriesService {
    constructor(
        @InjectRepository(Categories) private repo: Repository<Categories>,
        @InjectRepository(Transactions) private transactionRepo: Repository<Transactions>,
        @InjectRepository(Budget) private budgetRepo: Repository<Budget>
    ) { }

    async create(dto: CreateCategoryDto) {
        const category = this.repo.create(dto)
        try {
            return await this.repo.save(category)
        } catch (error) {
            if (error.code === '23505') {
                throw new ConflictException(['Category with this name already exists'])
            }
            throw new InternalServerErrorException(error.message)
        }
    }
    getAll() {
        return this.repo.find()
    }
    async getById(id: string) {
        return this.getCategoryDetails(id)
    }

    async getBudgetsForCategory(id: string) {
        await this.getCategoryDetails(id)
        const budgets = await this.budgetRepo.find({
            where: { category: { id } },
        })

        return Promise.all(budgets.map(async (budget) => {
            const spent = await this.calculateSpendForRange(id, budget.startDate, budget.endDate)
            const amount = Number(budget.amount)
            return {
                id: budget.id,
                amount,
                startDate: budget.startDate,
                endDate: budget.endDate,
                spent,
                remaining: amount - spent,
            }
        }))
    }

    async getSummary(id: string) {
        const category = await this.getCategoryDetails(id)
        const budgets = await this.getBudgetsForCategory(id)
        const totalSpent = await this.calculateSpendForRange(id)

        const now = new Date()

        let currentBudget = budgets.find(budget => {
            const startDate = new Date(budget.startDate)
            const endDate = new Date(budget.endDate)
            return now >= startDate && now <= endDate
        })

        if (!currentBudget && budgets.length > 0) {
            currentBudget = budgets[0]
        }

        return {
            category,
            totalSpent,
            budgets,
            currentBudget: currentBudget ?? null,
        }
    }
    

    async getCategoryDetails(id: string) {
        const category = await this.repo.findOne({ where: { id } })
        if (!category) throw new NotFoundException('category not found')
        return category
    }


    async calculateSpendForRange(categoryId: string, startDate?: string, endDate?: string) {
        const qb = this.transactionRepo.createQueryBuilder('transaction')
            .select('COALESCE(SUM(transaction.amount), 0)', 'sum')
            .where('transaction."categoryId" = :categoryId', { categoryId })
            .andWhere('transaction.type = :type', { type: 'expense' })

        if (startDate && endDate) {
            qb.andWhere('transaction.date BETWEEN :start AND :end', { start: startDate, end: endDate })
        }

        const result = await qb.getRawOne<{ sum: string }>()
        return Number(result?.sum ?? 0)
    }

}
