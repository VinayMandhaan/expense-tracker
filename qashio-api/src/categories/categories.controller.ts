import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { CategoriesService } from "./categories.service";
import { CreateCategoryDto } from "./dto/create-category.dto";

@Controller('categories')
export class CategoriesController {
    constructor(private readonly categoryService: CategoriesService) { }

    @Post()
    create(@Body() dto: CreateCategoryDto) {
        return this.categoryService.create(dto)
    }
    @Get()
    getAll() {
        return this.categoryService.getAll()
    }
    @Get(':id')
    getCategory(@Param('id') id: string) {
        return this.categoryService.getById(id)
    }
    @Get(':id/budgets')
    getBudgets(@Param('id') id: string) {
        return this.categoryService.getBudgetsForCategory(id)
    }
    @Get(':id/summary')
    getSummary(@Param('id') id: string) {
        return this.categoryService.getSummary(id)
    }

}
