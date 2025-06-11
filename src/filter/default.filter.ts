// c:\Users\haowen\workspace\haowen-blog\haowen-bew-blog-backend\midway-project\src\filter\default.filter.ts
import { Catch, MidwayHttpError } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { MidwayValidationError } from '@midwayjs/validate';

/**
 * 统一全局响应格式接口
 */
interface IGlobalResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  code?: number; // HTTP status code or custom business code
}

@Catch() // 捕获所有类型的错误
export class DefaultErrorFilter {
  async catch(err: Error | MidwayHttpError | MidwayValidationError, ctx: Context) {
    let statusCode: number;
    let responseMessage: string;
    let responseData: any | undefined;

    // 识别错误类型并设置相应的状态码和消息
    if (err instanceof MidwayHttpError) {
      // 由 ctx.throw 或 @midwayjs/core 抛出的 HttpException
      statusCode = err.status;
      responseMessage = err.message;
    } else if (err instanceof MidwayValidationError) {
      // 参数校验错误
      statusCode = 422; // Unprocessable Entity
      responseMessage = err.message || 'Validation Failed';
      responseData = err.cause; // `err.cause` 包含详细的校验失败字段和原因
    } else if (err && typeof (err as any).status === 'number') {
      // 兼容某些库可能直接抛出带有 status 属性的错误对象
      statusCode = (err as any).status;
      responseMessage = err.message;
    }
    else {
      // 其他未知错误，视为服务器内部错误
      statusCode = 500;
      responseMessage = 'Internal Server Error';
      // 在生产环境中，不应将详细的 err.message 或 err.stack 暴露给客户端
      // 但在开发环境中可以打印到控制台以方便调试
      ctx.logger.error(err); // 使用 Midway 的 logger 记录完整错误信息
    }

    // 设置响应状态码
    ctx.status = statusCode;

    // 构建标准化的错误响应体
    const errorResponse: IGlobalResponse = {
      success: false,
      message: responseMessage,
      code: statusCode,
      data: responseData,
    };

    // 发送 JSON 响应
    ctx.body = errorResponse;
  }
}
