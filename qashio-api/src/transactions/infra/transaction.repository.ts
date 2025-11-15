import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Transactions } from './transaction.entity';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { Categories } from '../../categories/infra/category.entity';
import { QueryTransactionDto } from '../dto/query-transaction.dto';
import { parseSort } from '../../common/util/sort.util';

@Injectable()
export class TransactionRepository {
  constructor(
    @InjectRepository(Transactions)
    private readonly repo: Repository<Transactions>,
  ) { }

  async createTransaction(dto: CreateTransactionDto, category: Categories): Promise<Transactions> {
    const transaction = this.repo.create({
      amount: dto.amount,
      date: dto.date,
      type: dto.type,
      category,
    })
    const saved = await this.repo.save(transaction)
    return saved;
  }

  async paginate(params: QueryTransactionDto) {
    const page = Math.max(1, params.page ? params.page : 1)
    const limit = Math.max(1, params.limit ? params.limit : 10)
    const qb = this.repo.createQueryBuilder('transaction').leftJoinAndSelect('transaction.category', 'category')
    this.applyFilters(qb, params)
    this.applySorting(qb, params.sort)
    qb.skip((page - 1) * limit).take(limit)
    const [items, total] = await qb.getManyAndCount()
    return { items, total, page, limit }
  }

  async findById(id: string) {
    const transaction = await this.repo.findOne({
      where: { id },
      relations: { category: true },
    })
    if (!transaction) {
      throw new NotFoundException('transaction not found')
    }
    return transaction
  }

  save(transaction: Transactions) {
    return this.repo.save(transaction)
  }

  remove(transaction: Transactions) {
    return this.repo.remove(transaction)
  }


  applyFilters(qb: SelectQueryBuilder<Transactions>, params: QueryTransactionDto) {
    if (params.categoryId) {
      qb.andWhere('transaction."categoryId" = :categoryId', {
        categoryId: params.categoryId,
      })
    }
    if (params.type) {
      qb.andWhere('transaction.type = :type', { type: params.type })
    }
    const from = params.from ? params.from : params.to
    const to = params.to ? params.to : params.from
    if (from || to) {
      qb.andWhere('transaction.date BETWEEN :from AND :to', {
        from: from ? from : to,
        to: to ? to : from,
      })
    }
    if (params.search) {
      const search = params.search.trim()
      const amount = Number(search)
      if (!Number.isNaN(amount)) {
        qb.andWhere('transaction.amount = :amount', { amount: amount })
      }
    }
  }

  applySorting(qb: SelectQueryBuilder<Transactions>, sort?: string): void {
    const mappings: Record<string, string> = {
      date: 'transaction.date',
      amount: 'transaction.amount',
      type: 'transaction.type',
      createdAt: 'transaction.createdAt',
      category: 'category.name',
    }
    const sortRules = parseSort(sort)
    let applied = false
    for (const [field, direction] of sortRules) {
      const column = mappings[field]
      if (column) {
        qb.addOrderBy(column, direction)
        applied = true
      }
    }
    if (!applied) {
      qb.addOrderBy('transaction.date', 'DESC')
    }
  }
}
