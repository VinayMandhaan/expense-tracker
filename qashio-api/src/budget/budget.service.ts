import { Injectable } from "@nestjs/common";
import { Budget } from "./budget.entity";
import { Repository } from "typeorm";
import { CreateBudgetDto } from "./dto/create-budget.dto";
import { InjectRepository } from "@nestjs/typeorm";


@Injectable()
export class BudgetService {
    constructor(@InjectRepository(Budget) private repo: Repository<Budget>) { }

    create(dto: CreateBudgetDto) {
        return this.repo.save(this.repo.create({...dto, category: {
            id: dto.categoryId
        }}))
    }

}