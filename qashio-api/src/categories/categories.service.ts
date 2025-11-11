import { Injectable } from "@nestjs/common";
import { Categories } from "./categories.entity";
import { Repository } from "typeorm";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { InjectRepository } from "@nestjs/typeorm";


@Injectable()
export class CategoriesService {
    constructor(@InjectRepository(Categories) private repo: Repository<Categories>) { }

    create(dto: CreateCategoryDto) {
        return this.repo.save(this.repo.create(dto))
    }
    getAll() {
        return this.repo.find()
    }
    getById(id: string) {
        return this.repo.findOne({ where: { id } })
    }

}