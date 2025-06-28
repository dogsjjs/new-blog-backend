import { Middleware, IMiddleware } from '@midwayjs/core';
import { NextFunction, Context } from '@midwayjs/koa';

/**
 * 报告中间件，用于记录请求的基本信息
 * - 请求方法
 * - 请求路径
 * - 响应状态码
 * - 响应时间
 */
@Middleware()
export class ReportMiddleware implements IMiddleware<Context, NextFunction> {
  resolve() {
    return async (ctx: Context, next: NextFunction) => {
      const startTime = Date.now();
      try {
        // 执行下一个中间件或路由处理
        // 注意：next() 返回的是一个 Promise，所以可以使用 await
        return await next();
      } finally {
        // 记录请求方法、路径、状态码和响应时间
        // 注意：ctx.status 在 next() 执行后才会被设置
        ctx.logger.info(
          `[Report] ${ctx.method} ${ctx.path} - ${ctx.status} - rt=${
            Date.now() - startTime
          }ms`
        );
      }
    };
  }
  /**
   * 中间件名称，用于注册时识别
   */
  static getName(): string {
    return 'report';
  }
}
