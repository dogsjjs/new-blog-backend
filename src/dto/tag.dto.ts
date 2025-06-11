import { Rule, RuleType } from '@midwayjs/validate';

export class CreateTagDTO {
  @Rule(RuleType.string().required().min(1).max(50))
  name: string;

  @Rule(RuleType.string().optional().max(200))
  description?: string;
}

export class UpdateTagDTO {
  @Rule(RuleType.string().optional().min(1).max(50))
  name?: string;

  @Rule(RuleType.string().optional().max(200))
  description?: string;
}