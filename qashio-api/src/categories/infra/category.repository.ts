import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Categories } from './category.entity';
import { CreateCategoryDto } from '../dto/create-category.dto';

@Injectable()
export class CategoryRepository {
  constructor(
    @InjectRepository(Categories) private readonly repo: Repository<Categories>,
  ) {}

  async createCategory(dto: CreateCategoryDto) {
    const entity = this.repo.create(dto)
    return this.repo.save(entity)
  }

  findAll() {
    return this.repo.find()
  }

  async findById(id: string) {
    const category = await this.repo.findOne({ where: { id } })
    if (!category) {
      throw new NotFoundException('category not found')
    }
    return category
  }
}
