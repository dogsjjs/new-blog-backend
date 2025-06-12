import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToMany } from 'typeorm';
import { ITag } from '../interface';
import { Post } from './post.entity'; // 引入 Post 实体

@Entity('tags') // 数据库中的表名
export class Tag implements ITag {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50, unique: true }) // 标签名称，设置为唯一
  name: string;

  @Column({ type: 'text', nullable: true }) // 标签描述，允许为空
  description?: string;

  @Column({ type: 'varchar', length: 255, nullable: true }) // 标签图标的 URL 或类名
  icon?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // 注意：在 Post 实体中已经通过 @JoinTable 定义了多对多关系的所有者方。
  // Tag 实体作为被拥有方，只需要定义 @ManyToMany 即可。
  @ManyToMany(() => Post, post => post.tags)
  posts?: Post[]; // 可选，查询标签时不一定总是需要加载关联的文章
}