import { Rule, RuleType } from '@midwayjs/validate';

export class CreateTagDTO {
  @Rule(RuleType.string().required().min(1).max(50))
  name: string;

  @Rule(RuleType.string().optional().max(200))
  description?: string;

  @Rule(RuleType.string().optional().max(255)) // 图标可以是 URL 或 CSS 类名
  icon?: string;
}

export class UpdateTagDTO {
  @Rule(RuleType.string().optional().min(1).max(50))
  name?: string;

  @Rule(RuleType.string().optional().max(200))
  description?: string;

  @Rule(RuleType.string().optional().max(255))
  icon?: string;
}

export class QueryTagDTO {
  @Rule(RuleType.number().integer().min(1).optional().default(1))
  page?: number;

  @Rule(RuleType.number().integer().min(1).max(100).optional().default(10))
  pageSize?: number;

  @Rule(RuleType.string().optional().allow('').trim()) // 允许空字符串，并 trim
  query?: string;
}