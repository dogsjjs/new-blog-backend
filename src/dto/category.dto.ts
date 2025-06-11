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
