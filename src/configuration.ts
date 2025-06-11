import { Configuration, App } from '@midwayjs/core';
import * as koa from '@midwayjs/koa';
import * as validate from '@midwayjs/validate';
import * as typeorm from '@midwayjs/typeorm'; // 确保 typeorm 组件已引入
import * as info from '@midwayjs/info';
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
  ],
  importConfigs: [join(__dirname, './config')],
})
export class MainConfiguration {
  @App('koa')
  app: koa.Application;

  async onReady() {
    // add middleware
    this.app.useMiddleware([ReportMiddleware, AuthMiddleware, ResponseMiddleware]); // 添加 AuthMiddleware
    // add filter
    this.app.useFilter([DefaultErrorFilter]);
  }
}
