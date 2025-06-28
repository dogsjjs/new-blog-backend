import { Provide, Config } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entity/user.entity';
import { UserRegisterDTO, UserLoginDTO } from '../dto/user.dto';
import { md5 } from '../utils/crypto.util'; // 引入 MD5 工具
import * as jwt from 'jsonwebtoken';
import { IAuthUser } from '../middleware/auth.middleware'; // 引入 AuthMiddleware 中的用户负载结构
import { MidwayHttpError } from '@midwayjs/core';

@Provide()
export class UserService {
  @InjectEntityModel(User)
  userRepository: Repository<User>;

  @Config('jwt')
  jwtConfig: { secret: string; expiresIn: string };

  async register(userDto: UserRegisterDTO): Promise<User> {
    const existingUser = await this.userRepository.findOne({
      where: [{ username: userDto.username }, { email: userDto.email }],
    });

    if (existingUser) {
      if (existingUser.username === userDto.username) {
        throw new MidwayHttpError('Username already exists', 409); // 409 Conflict
      }
      if (userDto.email && existingUser.email === userDto.email) {
        throw new MidwayHttpError('Email already registered', 409);
      }
    }

    const user = new User();
    user.username = userDto.username;
    user.password = md5(userDto.password); // MD5 加密密码
    user.email = userDto.email;

    return this.userRepository.save(user);
  }

  async login(
    loginDto: UserLoginDTO
  ): Promise<{ token: string; user: Omit<User, 'password'> }> {
    const user = await this.userRepository.findOneBy({
      username: loginDto.username,
    });

    if (!user) {
      throw new MidwayHttpError('User not found', 404);
    }

    if (user.password !== md5(loginDto.password)) {
      throw new MidwayHttpError('Incorrect password', 401); // Unauthorized
    }

    // 密码正确，生成 JWT
    const payload: IAuthUser = {
      userId: user.id,
      // username: user.username, // 可以选择性添加
    };

    const token = jwt.sign(payload, this.jwtConfig.secret, {
      expiresIn: this.jwtConfig.expiresIn,
      algorithm: 'HS256', // 确保使用正确的算法
    } as jwt.SignOptions);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user; // 从返回的用户信息中移除密码
    return { token, user: userWithoutPassword };
  }
}
