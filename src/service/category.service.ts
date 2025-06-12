import { Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { ICategory } from '../interface';
import { Category } from '../entity/category.entity';
import { QueryCategoryDTO, CreateCategoryDTO, UpdateCategoryDTO } from '../dto/category.dto';
// import { v4 as uuidv4 } from 'uuid'; // 如果使用 @PrimaryGeneratedColumn('uuid')，则不再需要手动生成

@Provide()
export class CategoryService {

  @InjectEntityModel(Category)
  categoryRepository: Repository<Category>;

  async createCategory(categoryDto: CreateCategoryDTO): Promise<ICategory> {
    const category = new Category();
    category.name = categoryDto.name;
    category.description = categoryDto.description;
    category.icon = categoryDto.icon;
    // id, createdAt, updatedAt 将由 TypeORM 自动处理
    return this.categoryRepository.save(category);
  }

  // 使用 QueryBuilder 实现跨字段 OR 搜索的示例
  async getAllCategories(queryParams: QueryCategoryDTO): Promise<{ categories: ICategory[]; total: number }> {
    const { page = 1, pageSize = 10, query } = queryParams;
    const skip = (page - 1) * pageSize;

    const queryBuilder = this.categoryRepository.createQueryBuilder('category')
      .leftJoinAndSelect('category.posts', 'post') // 左连接 posts 表
      .loadRelationCountAndMap('category.postCount', 'category.posts'); // 计算 posts 的数量并映射到 category.postCount

    if (query && query.trim() !== '') { // 只有当 query 存在且不为空字符串时才添加搜索条件
      queryBuilder.andWhere('(category.name LIKE :query OR category.description LIKE :query)', { query: `%${query.trim()}%` }); // 使用 trim() 后的 query
    }

    queryBuilder.orderBy('category.createdAt', 'DESC')
      .skip(skip)
      .take(pageSize);

    const [rawCategories, total] = await queryBuilder.getManyAndCount();

    // 注意：此时的 category.postCount 已经是正确的数量了
    // 如果需要确保返回的类型是 ICategory，可以进行一次映射，但通常直接返回 rawCategories 即可，因为它们已经包含了 postCount
    const categories: ICategory[] = rawCategories.map(cat => ({
      ...cat,
      postCount: (cat as any).postCount, // TypeORM 会将 postCount 作为附加属性
    }));

    return { categories, total };
  }

  async getCategoryById(id: string): Promise<ICategory | undefined> {
    const category = await this.categoryRepository.findOneBy({ id });
    return category || undefined; // 确保如果未找到则返回 undefined
  }

  async updateCategory(id: string, categoryUpdateDto: UpdateCategoryDTO): Promise<ICategory | null> {
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
    if (categoryUpdateDto.icon !== undefined) {
      categoryToUpdate.icon = categoryUpdateDto.icon;
    }
    // updatedAt 将由 TypeORM 自动处理
    return this.categoryRepository.save(categoryToUpdate);
  }

  async deleteCategory(id: string): Promise<boolean> {
    const result = await this.categoryRepository.delete(id);
    return result.affected > 0;
  }
}