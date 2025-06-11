import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';
import { IUser } from '../interface';

@Entity('users') // 数据库中的表名
export class User implements IUser {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index({ unique: true }) // 为 username 创建唯一索引
  @Column({ type: 'varchar', length: 50, unique: true })
  username: string;

  @Column({ type: 'varchar', length: 32 }) // MD5 哈希通常是 32 个十六进制字符
  password: string;

  @Column({ type: 'varchar', length: 100, nullable: true, unique: true }) // 邮箱，可选，但如果提供则唯一
  email?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // 可以添加其他字段，如头像、角色等
}