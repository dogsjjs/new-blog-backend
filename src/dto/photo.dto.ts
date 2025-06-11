import { Rule, RuleType } from '@midwayjs/validate';

export class CreatePhotoDTO {
  @Rule(RuleType.string().required().uri()) // 图片地址，要求是有效的URI
  imageUrl: string;

  @Rule(RuleType.string().optional().max(500)) // 图片描述，可选
  description?: string;
}

export class UpdatePhotoDTO {
  @Rule(RuleType.string().optional().uri())
  imageUrl?: string;

  @Rule(RuleType.string().optional().max(500))
  description?: string;
}