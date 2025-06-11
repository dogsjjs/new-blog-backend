import { MidwayConfig } from '@midwayjs/core';
import { join } from 'path';
import { Category } from '../entity/category.entity';
import { Tag } from '../entity/tag.entity';
import { Photo } from '../entity/photo.entity';

export default {
  // use for cookie sign key, should change to your own and keep security
  keys: '1749624076255_7376',
  koa: {
    port: 7001,
  },
  typeorm: {
    dataSource: {
      default: { // 'default' 是数据源的名称
        type: 'mysql', // <--- 修改为 'mysql'
        host: process.env.MYSQL_HOST || 'localhost', // 推荐使用环境变量
        port: parseInt(process.env.MYSQL_PORT, 10) || 3306,
        username: process.env.MYSQL_USER || 'root',
        password: process.env.MYSQL_PASSWORD || 'Wwh451212wh!',
        database: process.env.MYSQL_DB || 'new_blog',
        synchronize: true, // 开发环境下可以设置为 true。生产环境建议设为 false。
        logging: true, // 是否在控制台打印执行的 SQL 语句
        // entities: ['**/entity/**/*.ts'], // 扫描 entity 文件的路径
        entities: [Category, Tag, Photo,  /* 其他实体可以放在这里 */ join(__dirname, '../entity/**/*.ts')], // 更可靠的路径，确保 Category 实体被加载
        // 如果您的 entity 文件编译后在 dist 目录，可能需要调整为相对于 dist 的路径
        // entities: [ 'dist/entity/**/*.js' ]
        // charset: 'utf8mb4_unicode_ci', // 可选：为 MySQL 设置字符集
      }
    }
  },
} as MidwayConfig;
