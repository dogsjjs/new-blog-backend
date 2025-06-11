import { createLightApp, close } from '@midwayjs/mock';
import { Application } from '@midwayjs/koa';
import { Category } from '../../src/entity/category.entity';
import { CategoryService } from '../../src/service/category.service';
import { Repository } from 'typeorm';
import { ICategory } from '../../src/interface';
import { join } from 'path';

describe('CategoryService', () => {
  let app: Application; // 使用 Application 类型
  let categoryService: CategoryService; 
  let categoryRepository: Repository<Category>; // 直接使用真实的 Repository

  beforeAll(async () => {
    // 使用 createLightApp，并确保它加载了 TypeORM 和相关配置
    // 如果 config.unittest.ts 存在，Midway 会自动加载它
    app = await createLightApp({
      // baseDir: join(__dirname, '../..'), // 根据实际项目结构调整，确保能找到 src 和 config
    });
    // 获取 CategoryService 实例
    categoryService = await app.getApplicationContext().getAsync(CategoryService);
    // 获取真实的 Repository 实例，用于后续清理等操作
    categoryRepository = await app.getApplicationContext().getAsync('typeorm:getRepository:Category');
  });

  beforeEach(async () => {
    // 在每个测试用例执行前，清空 categories 表，确保测试环境干净
    // 注意：这会删除表中的所有数据！确保连接的是测试数据库。
    await categoryRepository.clear();
  });

  afterAll(async () => {
    await close(app);
  });

  // afterEach(() => {
    // 如果使用了 mock，在这里清除
    // jest.clearAllMocks(); 
  // });

  describe('createCategory', () => {
    it('should create and return a new category', async () => {
      const categoryDto: Omit<ICategory, 'id' | 'createdAt' | 'updatedAt'> = {
        name: 'Test Category',
        description: 'This is a test category',
      };

      const result = await categoryService.createCategory(categoryDto);

      expect(result).toBeDefined();
      expect(result.id).toBeDefined();
      expect(result.name).toBe(categoryDto.name);
      expect(result.description).toBe(categoryDto.description);
      expect(result.createdAt).toBeInstanceOf(Date);
      expect(result.updatedAt).toBeInstanceOf(Date);

      // 可选：从数据库中再次查询以确认数据已持久化
      const dbCategory = await categoryRepository.findOneBy({ id: result.id });
      expect(dbCategory).toBeDefined();
      expect(dbCategory?.name).toBe(categoryDto.name);
    });
  });
});
