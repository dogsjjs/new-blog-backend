import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  DeleteDateColumn
} from 'typeorm';
import { ICategory } from '../interface';
import { Post } from './post.entity'; // 引入 Post 实体

@Entity('categories') // 'categories' 是数据库中的表名
export class Category implements ICategory {
  @PrimaryGeneratedColumn('uuid') // UUID 主键，MySQL 也支持
  id: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  name: string;

  @Column({ type: 'text', nullable: true }) // 'text' 类型在 MySQL 中是合适的
  description?: string;

  @OneToMany(() => Post, post => post.category) // 一个分类对应多篇文章
  posts?: Post[]; // 可选，因为在查询分类时不一定总是需要加载文章列表

  @Column({ type: 'varchar', length: 255, nullable: true }) // 分类图标的 URL 或类名
  icon?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // 逻辑删除字段（推荐方式1：DeleteDateColumn，TypeORM自动处理）
  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt?: Date;
}
