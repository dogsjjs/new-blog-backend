import { IMiddleware, Middleware } from '@midwayjs/core';
import { NextFunction, Context } from '@midwayjs/koa';
import { IGlobalResponse } from '../interface'; // 确保导入了全局响应格式接口

@Middleware()
export class ResponseMiddleware implements IMiddleware<Context, NextFunction> {
  resolve() {
    return async (ctx: Context, next: NextFunction) => {
      await next(); // Execute subsequent middleware and controller logic

      // If ctx.body is already in our global response format (e.g., handled by error filter or controller returned it directly),
      // then we don't need to do anything.
      if (ctx.body && typeof ctx.body === 'object' && 'success' in ctx.body) {
        return;
      }

      // Only format successful responses that haven't been formatted yet.
      // The error filter handles error formatting.
      if (ctx.status >= 200 && ctx.status < 400) { // Consider 3xx redirects if any, but typically for APIs, we focus on 2xx.
        const responseData = ctx.body;
        const successResponse: IGlobalResponse = {
          success: true,
          code: ctx.status,
          data: responseData,
          // message: 'Request successful', // Optional: add a default success message
        };

        // Handle 204 No Content specifically if needed
        if (ctx.status === 204) {
          // For 204, the body is typically empty.
          // Our wrapper will send a JSON body, which is fine.
          successResponse.data = undefined;
        }
        ctx.body = successResponse;
      }
    };
  }

  // Optional: a static method to get middleware name, useful for configuration or debugging
  public static getName(): string {
    return 'response-formatter';
  }
}
