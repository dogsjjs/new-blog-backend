import { Rule, RuleType } from '@midwayjs/validate';

export class CreatePostDTO {
  @Rule(RuleType.string().required().min(1).max(200))
  title: string;

  @Rule(RuleType.string().optional().max(500))
  description?: string;

  @Rule(RuleType.string().optional().max(200).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)) // slug 格式校验，例如 a-valid-slug
  slug?: string;

  @Rule(RuleType.string().optional().uri())
  coverImage?: string;

  @Rule(RuleType.string().required().uuid()) // 假设 categoryId 是 UUID
  categoryId: string;

  @Rule(RuleType.array().items(RuleType.string().uuid()).optional().min(0)) // 标签ID数组，每个都是 UUID
  tagIds?: string[];

  @Rule(RuleType.string().required())
  content: string;

  @Rule(RuleType.boolean().optional().default(false))
  isRecommended?: boolean;

  @Rule(RuleType.boolean().optional().default(true))
  isPublic?: boolean;

  // viewCount 通常由后端管理，不在创建时提供
}

export class UpdatePostDTO {
  @Rule(RuleType.string().optional().min(1).max(200))
  title?: string;

  // ... 其他字段与 CreatePostDTO 类似，但都是可选的
  @Rule(RuleType.string().optional().max(500))
  description?: string;

  @Rule(RuleType.string().optional().max(200).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/))
  slug?: string;

  @Rule(RuleType.string().optional().uri())
  coverImage?: string;

  @Rule(RuleType.string().optional().uuid())
  categoryId?: string;

  @Rule(RuleType.array().items(RuleType.string().uuid()).optional().min(0))
  tagIds?: string[];

  @Rule(RuleType.string().optional())
  content?: string;

  @Rule(RuleType.boolean().optional())
  isRecommended?: boolean;

  @Rule(RuleType.boolean().optional())
  isPublic?: boolean;
}

export class PostQueryDTO { // 用于查询文章列表的 DTO
  @Rule(RuleType.number().integer().min(1).optional().default(1))
  page?: number;

  @Rule(RuleType.number().integer().min(1).max(100).optional().default(10))
  pageSize?: number;

  @Rule(RuleType.string().optional())
  categoryId?: string;

  @Rule(RuleType.string().optional()) // 可以是单个 tagId 或逗号分隔的多个 tagId
  tagId?: string;

  @Rule(RuleType.string().optional().allow('createdAt', 'updatedAt', 'viewCount', 'title'))
  sortBy?: string;

  @Rule(RuleType.string().optional().allow('ASC', 'DESC').default('DESC'))
  sortOrder?: 'ASC' | 'DESC';

  @Rule(RuleType.string().optional())
  keyword?: string; // 用于标题或内容搜索

  @Rule(RuleType.boolean().optional())
  isPublic?: boolean; // 只查询公开或非公开的文章
}