import { Body, Controller, Get, Post } from "@nestjs/common";
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

}