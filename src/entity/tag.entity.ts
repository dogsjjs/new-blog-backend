import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ITag } from '../interface';

@Entity('tags') // 数据库中的表名
export class Tag implements ITag {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50, unique: true }) // 标签名称，设置为唯一
  name: string;

  @Column({ type: 'text', nullable: true }) // 标签描述，允许为空
  description?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}