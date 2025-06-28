import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { IPhoto } from '../interface';

@Entity('photos') // 数据库中的表名
export class Photo implements IPhoto {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 }) // 图片地址
  imageUrl: string;

  @Column({ type: 'text', nullable: true }) // 图片描述，允许为空
  description?: string;

  @CreateDateColumn() // 创建时间，作为上传时间
  createdAt: Date;

  @UpdateDateColumn() // 更新时间
  updatedAt: Date;

  // 逻辑删除字段（推荐方式1：DeleteDateColumn，TypeORM自动处理）
  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt?: Date;
}
