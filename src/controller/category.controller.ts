import { Inject, Controller, Get, Post, Put, Del, Param, Body, HttpCode, Query } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { CategoryService } from '../service/category.service';
import { ICategory } from '../interface';
import { CreateCategoryDTO, UpdateCategoryDTO, QueryCategoryDTO } from '../dto/category.dto'; // 我们将创建DTO文件
import { Validate } from '@midwayjs/validate';


@Controller('/api/category')
export class CategoryController {

  @Inject()
  ctx: Context;

  @Inject()
  categoryService: CategoryService;

  @Post('/', { description: '创建新的博客分类' })
  @Validate() // 启用校验
  async createCategory(@Body() categoryDto: CreateCategoryDTO): Promise<ICategory> {
    return this.categoryService.createCategory(categoryDto);
  }

  @Get('/', { description: '获取所有博客分类' })
  @Validate() // 对 QueryCategoryDTO 进行校验
  async getAllCategories(@Query() queryParams: QueryCategoryDTO): Promise<{ categories: ICategory[]; total: number; page: number; pageSize: number }> {
    const { categories, total } = await this.categoryService.getAllCategories(queryParams);
    return { categories, total, page: queryParams.page, pageSize: queryParams.pageSize };
  }

  @Get('/select-options', { description: '获取所有博客分类（用于下拉选择）' })
  async getAllCategoriesForSelect(): Promise<ICategory[]> {
    return this.categoryService.getAllCategoriesForSelect();
  }

  @Get('/:id', { description: '根据ID获取单个博客分类' })
  async getCategoryById(@Param('id') id: string): Promise<ICategory> {
    const category = await this.categoryService.getCategoryById(id);
    if (!category) {
      this.ctx.throw(404, 'Category not found');
    }
    return category;
  }

  @Put('/:id', { description: '根据ID更新博客分类' })
  @Validate() // 启用校验
  async updateCategory(@Param('id') id: string, @Body() categoryUpdateDto: UpdateCategoryDTO): Promise<ICategory> {
    const updatedCategory = await this.categoryService.updateCategory(id, categoryUpdateDto);
    if (!updatedCategory) {
      this.ctx.throw(404, 'Category not found for update');
    }
    return updatedCategory;
  }

  @Del('/:id', { description: '根据ID删除博客分类' })
  @HttpCode(204) // No Content
  async deleteCategory(@Param('id') id: string): Promise<void> {
    const success = await this.categoryService.deleteCategory(id);
    if (!success) {
      this.ctx.throw(404, 'Category not found for deletion');
    }
  }
}
