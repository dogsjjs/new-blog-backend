import { Rule, RuleType } from '@midwayjs/validate';

export class UserRegisterDTO {
  @Rule(RuleType.string().required().min(3).max(50).alphanum()) // 用户名，字母数字组合
  username: string;

  @Rule(RuleType.string().required().min(6).max(30)) // 密码，明文输入，后端加密
  password: string;

  @Rule(RuleType.string().optional().email()) // 邮箱，可选
  email?: string;
}

export class UserLoginDTO {
  @Rule(RuleType.string().required())
  username: string;

  @Rule(RuleType.string().required())
  password: string;
}