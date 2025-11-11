import { Injectable, NotFoundException } from "@nestjs/common";
import { Transactions } from "./transactions.entity";
import { Repository } from "typeorm";
import { CreateTransactionDto } from "./dto/create-transaction.dto";
import { Categories } from "src/categories/categories.entity";
import { InjectRepository } from "@nestjs/typeorm";


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
}