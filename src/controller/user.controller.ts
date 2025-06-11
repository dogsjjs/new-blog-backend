import { Inject, Controller, Post, Body } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { UserService } from '../service/user.service';
import { UserRegisterDTO, UserLoginDTO } from '../dto/user.dto';
import { Validate } from '@midwayjs/validate';
import { User } from '../entity/user.entity';

@Controller('/user')
export class UserController {
  @Inject()
  ctx: Context;

  @Inject()
  userService: UserService;

  @Post('/register', { description: '用户注册' })
  @Validate()
  async register(@Body() userDto: UserRegisterDTO): Promise<Omit<User, 'password'>> {
    const user = await this.userService.register(userDto);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = user; // 不返回密码
    this.ctx.status = 201; // Created
    return result;
  }

  @Post('/login', { description: '用户登录' })
  @Validate()
  async login(@Body() loginDto: UserLoginDTO): Promise<{ token: string; user: Omit<User, 'password'> }> {
    const result = await this.userService.login(loginDto);
    return result;
  }

  // 可以添加其他用户相关的接口，例如获取用户信息、修改密码等
  // 这些接口通常需要 AuthMiddleware 的保护
}