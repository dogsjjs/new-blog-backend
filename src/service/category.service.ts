import { Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { ICategory } from '../interface';
import { Category } from '../entity/category.entity';
// import { v4 as uuidv4 } from 'uuid'; // 如果使用 @PrimaryGeneratedColumn('uuid')，则不再需要手动生成

@Provide()
export class CategoryService {
  
  @InjectEntityModel(Category)
  categoryRepository: Repository<Category>;

  async createCategory(categoryDto: Omit<ICategory, 'id' | 'createdAt' | 'updatedAt'>): Promise<ICategory> {
    const category = new Category();
    category.name = categoryDto.name;
    category.description = categoryDto.description;
    // id, createdAt, updatedAt 将由 TypeORM 自动处理
    return this.categoryRepository.save(category);
  }

  async getAllCategories(): Promise<ICategory[]> {
    return this.categoryRepository.find();
  }

  async getCategoryById(id: string): Promise<ICategory | undefined> {
    const category = await this.categoryRepository.findOneBy({ id });
    return category || undefined; // 确保如果未找到则返回 undefined
  }

  async updateCategory(id: string, categoryUpdateDto: Partial<Omit<ICategory, 'id' | 'createdAt' | 'updatedAt'>>): Promise<ICategory | null> {
    const categoryToUpdate = await this.categoryRepository.findOneBy({ id });
    if (!categoryToUpdate) {
      return null;
    }

    // 更新允许修改的字段
    if (categoryUpdateDto.name !== undefined) {
      categoryToUpdate.name = categoryUpdateDto.name;
    }
    if (categoryUpdateDto.description !== undefined) {
      categoryToUpdate.description = categoryUpdateDto.description;
    }
    // updatedAt 将由 TypeORM 自动处理
    return this.categoryRepository.save(categoryToUpdate);
  }

  async deleteCategory(id: string): Promise<boolean> {
    const result = await this.categoryRepository.delete(id);
    return result.affected > 0;
  }
}