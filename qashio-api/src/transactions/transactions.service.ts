import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { Transactions } from "./transactions.entity";
import { Between, Repository } from "typeorm";
import { CreateTransactionDto } from "./dto/create-transaction.dto";
import { Categories } from "src/categories/categories.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { QueryTransactionDto } from "./dto/query-transaction.dto";
import { UpdateTransactionDto } from "./dto/update-transaction.dto";


@Injectable()
export class TransactionsService {
    constructor(
        @InjectRepository(Transactions) private transactionRepo: Repository<Transactions>,
        @InjectRepository(Categories) private categoryRepo: Repository<Categories>
    ) { }

    async create(dto: CreateTransactionDto) {
        let category = await this.categoryRepo.findOne({ where: { id: dto.categoryId } })
        if (!category) throw new NotFoundException('category not found')
        let transactionRequest = this.transactionRepo.create({ amount: dto.amount, date: dto.date, type: dto.type, category: category })
        return this.transactionRepo.save(transactionRequest)
    }

    async getAll(q: QueryTransactionDto) {
        const page = Math.max(1, q.page ?? 1)
        const limit = Math.max(1, q.limit ?? 10)
        const skip = (page - 1) * limit
        const from = q.from ?? q.to
        const to = q.to ?? q.from
        const where: any = {}

        if (q.categoryId) where.category = { id: q.categoryId }
        if (q.type) where.type = q.type

        if (from || to) {
            where.date = Between(from ?? to, to ?? from)
        }

        const [items, total] = await this.transactionRepo.findAndCount({ where, relations: {
            category:true
        }, take: limit, skip })

        return {
            items,
            meta: { total, page, limit, pages: Math.ceil(total / limit) },
        }
    }

    async getTransaction(id: string) {
        const transactionRequest = await this.transactionRepo.findOne({ where: { id }, relations: {
            category: true
        } })
        if (!transactionRequest) throw new NotFoundException('transaction not found')
        return transactionRequest
    }

    async update(id: string, dto: UpdateTransactionDto) {
        const transactionRequest = await this.getTransaction(id)
        Logger.warn(transactionRequest,"Transaction")
        if (dto.categoryId) {
            let category = await this.categoryRepo.findOne({ where: { id: dto.categoryId } })
            if (!category) throw new NotFoundException('category not found');
            (transactionRequest as any).category = category
        }
        Object.assign(transactionRequest, { amount: dto.amount ?? transactionRequest.amount, date: dto.date ?? transactionRequest.date, type: dto.type ?? transactionRequest.type })
        const transactionResponse = await this.transactionRepo.save(transactionRequest)
        return transactionResponse
    }

    async deleteTransaction(id: string) {
        const transactionRequest = await this.getTransaction(id)
        await this.transactionRepo.remove(transactionRequest)
        return { id }
    }


}