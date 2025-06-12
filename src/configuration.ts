import { Configuration, App } from '@midwayjs/core';
import * as koa from '@midwayjs/koa';
import * as validate from '@midwayjs/validate';
import * as typeorm from '@midwayjs/typeorm'; // 确保 typeorm 组件已引入
import * as info from '@midwayjs/info';
import * as crossDomain from '@midwayjs/cross-domain'; // 1. 引入 cross-domain 组件
import { join } from 'path';
import { DefaultErrorFilter } from './filter/default.filter';
// import { NotFoundFilter } from './filter/notfound.filter';
import { ResponseMiddleware } from './middleware/response.middleware'; // Import the new middleware
import { AuthMiddleware } from './middleware/auth.middleware'; // 引入新的 AuthMiddleware
import { ReportMiddleware } from './middleware/report.middleware';

@Configuration({
  imports: [
    koa,
    validate,
    typeorm,
    {
      component: info,
      enabledEnvironment: ['local'],
    },
    crossDomain, // 2. 将组件添加到 imports 数组
  ],
  importConfigs: [join(__dirname, './config')],
})
export class MainConfiguration {
  @App('koa')
  app: koa.Application;

  async onReady() {
    // add middleware
    // @midwayjs/cross-domain 组件会自动注册其 CORS 中间件，通常不需要手动 useMiddleware
    // 如果需要调整顺序，确保它在其他业务中间件之前
    this.app.useMiddleware([ReportMiddleware, AuthMiddleware, ResponseMiddleware]);
    // add filter
    this.app.useFilter([DefaultErrorFilter]);
  }
}
