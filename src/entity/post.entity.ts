import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
  Index,
} from 'typeorm';
import { IPost } from '../interface';
import { Category } from './category.entity';
import { Tag } from './tag.entity';

@Entity('posts') // 数据库中的表名
export class Post implements IPost {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 200 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Index({ unique: true }) // slug 通常需要唯一，便于 URL 访问
  @Column({ type: 'varchar', length: 200, nullable: true })
  slug?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  coverImage?: string;

  @Column({ type: 'varchar', length: 36, nullable: true }) // 用于存储 categoryId
  categoryId: string;

  @ManyToOne(() => Category, category => category.posts, { onDelete: 'SET NULL', nullable: true }) // 如果分类被删除，将 post 的 categoryId 设为 null
  category?: Category;

  @ManyToMany(() => Tag, tag => tag.posts, { cascade: true }) // cascade 可以在保存 Post 时自动处理关联的 Tag
  @JoinTable() // 会自动创建 posts_tags_tags 中间表
  tags?: Tag[];
  tagIds: string[]; // 这个字段不会直接映射到数据库列，主要用于 DTO 和 Service 逻辑

  @Column({ type: 'mediumtext' }) // Markdown 内容可能较长
  content: string;

  @Column({ default: false })
  isRecommended: boolean;

  @Column({ default: true })
  isPublic: boolean;

  @Column({ type: 'int', default: 0 })
  viewCount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}