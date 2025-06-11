import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ICategory } from '../interface';

@Entity('categories') // 'categories' 是数据库中的表名
export class Category implements ICategory {
  @PrimaryGeneratedColumn('uuid') // UUID 主键，MySQL 也支持
  id: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  name: string;

  @Column({ type: 'text', nullable: true }) // 'text' 类型在 MySQL 中是合适的
  description?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
