import { Body, Controller, Post } from "@nestjs/common";
import { BudgetService } from "./budget.service";
import { CreateBudgetDto } from "./dto/create-budget.dto";


@Controller('budget')
export class BudgetController {
    constructor(private readonly budgetService: BudgetService) { }

    @Post()
    create(@Body() dto: CreateBudgetDto) {
        return this.budgetService.create(dto)
    }
}