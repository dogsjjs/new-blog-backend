import { Rule, RuleType } from '@midwayjs/validate';

export class CreateCategoryDTO {
  @Rule(RuleType.string().required().min(2).max(50))
  name: string;

  @Rule(RuleType.string().optional().max(200))
  description?: string;
}

export class UpdateCategoryDTO {
  @Rule(RuleType.string().optional().min(2).max(50))
  name?: string;

  @Rule(RuleType.string().optional().max(200))
  description?: string;
}


export class QueryCategoryDTO {
  @Rule(RuleType.number().integer().min(1).optional().default(1))
  page?: number;

  @Rule(RuleType.number().integer().min(1).max(100).optional().default(10))
  pageSize?: number;

  @Rule(RuleType.string().optional().allow('').trim()) // 允许空字符串，并 trim
  query?: string;
}