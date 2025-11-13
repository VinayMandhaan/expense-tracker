import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { Transactions } from "./transactions.entity";
import { Between, Repository } from "typeorm";
import { CreateTransactionDto } from "./dto/create-transaction.dto";
import { Categories } from "src/categories/categories.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { QueryTransactionDto } from "./dto/query-transaction.dto";
import { UpdateTransactionDto } from "./dto/update-transaction.dto";
import { KafkaProducer } from "src/kafka/kafka.producer";
import { parseSort } from "src/common/util/sort.util";


@Injectable()
export class TransactionsService {
    constructor(
        @InjectRepository(Transactions) private transactionRepo: Repository<Transactions>,
        @InjectRepository(Categories) private categoryRepo: Repository<Categories>,
        private readonly kafkaProducer: KafkaProducer,
    ) { }

    async create(dto: CreateTransactionDto) {
        let category = await this.categoryRepo.findOne({ where: { id: dto.categoryId } })
        if (!category) throw new NotFoundException('category not found')
        let transactionRequest = this.transactionRepo.create({ amount: dto.amount, date: dto.date, type: dto.type, category: category })
        const result = await this.transactionRepo.save(transactionRequest)
        // await this.kafkaProducer.send('transactions.created', result)
        this.kafkaProducer
            .send('transactions.created', result)
            .catch(err => Logger.error('Kafka publish failed', err))
        return result
    }

    async getAll(q: QueryTransactionDto) {
        const page = Math.max(1, q.page ?? 1)
        const limit = Math.max(1, q.limit ?? 10)
        const skip = (page - 1) * limit
        const from = q.from ?? q.to
        const to = q.to ?? q.from
        const where: any = {}
        const order = Object.fromEntries(parseSort(q.sort))
        if (q.categoryId) where.category = { id: q.categoryId }
        if (q.type) where.type = q.type

        if (from || to) {
            where.date = Between(from ?? to, to ?? from)
        }

        const [items, total] = await this.transactionRepo.findAndCount({
            where, order: Object.keys(order).length ? order : { date: 'DESC' }, relations: {
                category: true
            }, take: limit, skip
        })

        return {
            items,
            meta: { total, page, limit, pages: Math.ceil(total / limit) },
        }
    }

    async getTransaction(id: string) {
        const transactionRequest = await this.transactionRepo.findOne({
            where: { id }, relations: {
                category: true
            }
        })
        if (!transactionRequest) throw new NotFoundException('transaction not found')
        return transactionRequest
    }

    async update(id: string, dto: UpdateTransactionDto) {
        const transactionRequest = await this.getTransaction(id)
        Logger.warn(transactionRequest, "Transaction")
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