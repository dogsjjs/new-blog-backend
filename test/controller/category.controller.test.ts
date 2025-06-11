import { createApp, createHttpRequest, close } from '@midwayjs/mock';
import { Framework, Application } from '@midwayjs/koa';
import { CreateCategoryDTO } from '../../src/dto/category.dto';
import { MainConfiguration } from '../../src/configuration';
import { Repository } from 'typeorm';
import { Category } from '../../src/entity/category.entity';

describe('CategoryController', () => {
  let app: Application; // 使用 Application 类型
  let categoryRepository: Repository<Category>; // 用于清理数据

  beforeAll(async () => {
    // 使用 createApp 来创建一个完整的应用实例，它会加载 MainConfiguration
    // MainConfiguration 应该负责导入 Controller, Service, Middleware, Filter 等
    app = await createApp<Framework>(undefined, { // undefined 表示使用项目根目录
      // baseDir: join(__dirname, '../..'), // 根据实际项目结构调整
      imports: [MainConfiguration], // 确保主配置被加载
    } as any); // 使用 as any 避免类型检查问题，因为 options 类型可能不完全匹配

    // 获取真实的 Repository 实例，用于后续清理等操作
    categoryRepository = await app.getApplicationContext().getAsync('typeorm:getRepository:Category');
  });

  beforeEach(async () => {
    // 在每个测试用例执行前，清空 categories 表
    await categoryRepository.clear();
  });

  afterAll(async () => {
    await close(app);
  });

  // afterEach(() => {
    // jest.clearAllMocks(); // 如果有 mock 则需要
  // });

  describe('POST /category', () => {
    it('should create a category and return 200 with formatted response', async () => {
      const createDto: CreateCategoryDTO = { name: 'New Controller Test', description: 'Desc' };

      const response = await createHttpRequest(app).post('/category').send(createDto);

      expect(response.status).toBe(200); // Controller 默认返回 200 for POST if not specified
      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBeDefined();
      expect(response.body.data.name).toBe(createDto.name);
      expect(response.body.data.description).toBe(createDto.description);

      // 可选：验证数据是否真的写入数据库
      const dbCategory = await categoryRepository.findOneBy({ name: createDto.name });
      expect(dbCategory).toBeDefined();
      expect(dbCategory?.id).toBe(response.body.data.id);
    });

    it('should return 422 if validation fails', async () => {
      const invalidDto = { description: 'Only description' }; // Name is required
      const response = await createHttpRequest(app).post('/category').send(invalidDto);

      expect(response.status).toBe(422);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Validation Failed'); // Or more specific message from your DTO
      expect(response.body.data).toBeDefined(); // Contains validation error details
    });
  });
});
