import { Middleware, IMiddleware, Config, Inject } from '@midwayjs/core';
import { NextFunction, Context } from '@midwayjs/koa';
import * as jwt from 'jsonwebtoken';

// 可选：定义附加到 ctx.state.user 的用户信息结构
export interface IAuthUser {
  userId: string; // 或其他用户标识符
  // 其他你希望从 token 中获取并传递的用户信息
  // username?: string;
  // roles?: string[];
}

@Middleware()
export class AuthMiddleware implements IMiddleware<Context, NextFunction> {
  @Config('jwt')
  jwtConfig: { secret: string; expiresIn: string };

  @Inject()
  ctx: Context;

  // 定义不需要 token 验证的白名单路径
  // 可以使用字符串或正则表达式
  private static whiteList: Array<string | RegExp> = [
    '/user/login', // 假设登录接口路径
    '/user/register', // 假设注册接口路径
    /^\/public\//, // 匹配所有 /public/ 开头的路径
    '/', // 根路径，如果不需要验证
    // 其他开放接口，例如文档、健康检查等
    '/swagger-ui',
    '/api-docs',
    '/favicon.ico',
  ];

  resolve() {
    return async (ctx: Context, next: NextFunction) => {
      // 检查当前请求路径是否在白名单中
      const isIgnored = AuthMiddleware.whiteList.some(pattern => {
        if (typeof pattern === 'string') {
          return ctx.path === pattern;
        }
        if (pattern instanceof RegExp) {
          return pattern.test(ctx.path);
        }
        return false;
      });

      if (isIgnored) {
        await next();
        return;
      }

      const authHeader = ctx.get('Authorization');
      if (!authHeader) {
        ctx.status = 401;
        ctx.body = {
          success: false,
          code: 401,
          message: 'Authorization header is missing',
        };
        return;
      }

      const parts = authHeader.split(' ');
      if (parts.length !== 2 || parts[0] !== 'Bearer') {
        ctx.status = 401;
        ctx.body = {
          success: false,
          code: 401,
          message: 'Invalid Authorization header format. Expected "Bearer <token>"',
        };
        return;
      }
      const token = parts[1];
      try {
        // 验证 token
        const decoded = jwt.verify(token, this.jwtConfig.secret, {
          algorithms: ['HS256'], // 确保使用正确的算法
        }) as IAuthUser; // 类型断言为你的用户负载结构
        // 可选：将解码后的用户信息附加到 ctx.state，方便后续业务逻辑使用
        ctx.state.user = decoded;
      } catch (err) {
        ctx.status = 401;
        let message = 'Invalid token';
        if (err.name === 'TokenExpiredError') {
          message = 'Token has expired';
        } else if (err.name === 'JsonWebTokenError') {
          message = 'Invalid token signature';
        }
        ctx.logger.warn(`JWT Verification Error for path ${ctx.path}: ${err.message}`);
        ctx.body = {
          success: false,
          code: 401,
          message: message,
        };
        return; // 认证失败后直接返回，阻止后续中间件执行
      }
      await next();
    };
  }

  public static getName(): string {
    return 'auth';
  }
}
