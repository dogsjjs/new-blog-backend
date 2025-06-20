import { Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository, In } from 'typeorm';
import { Post } from '../entity/post.entity';
import { Category } from '../entity/category.entity';
import { Tag } from '../entity/tag.entity';
import { CreatePostDTO, UpdatePostDTO, PostQueryDTO } from '../dto/post.dto';
import { MidwayHttpError } from '@midwayjs/core';

@Provide()
export class PostService {
  @InjectEntityModel(Post)
  postRepository: Repository<Post>;

  @InjectEntityModel(Category)
  categoryRepository: Repository<Category>;

  @InjectEntityModel(Tag)
  tagRepository: Repository<Tag>;

  async createPost(postDto: CreatePostDTO): Promise<Post> {
    // 检查 Category 是否存在
    const category = await this.categoryRepository.findOneBy({ id: postDto.categoryId });
    if (!category) {
      throw new MidwayHttpError('Category not found', 404);
    }

    // 检查并处理 Tags
    let tags: Tag[] = [];
    if (postDto.tagIds && postDto.tagIds.length > 0) {
      tags = await this.tagRepository.findBy({ id: In(postDto.tagIds) });
      if (tags.length !== postDto.tagIds.length) {
        // 可以更精确地指出哪些 tagId 无效
        throw new MidwayHttpError('One or more tags not found', 404);
      }
    }

    // 检查 slug 是否唯一 (如果提供了 slug)
    if (postDto.slug) {
      const existingPostWithSlug = await this.postRepository.findOneBy({ slug: postDto.slug });
      if (existingPostWithSlug) {
        throw new MidwayHttpError('Slug already exists', 409);
      }
    }

    const post = new Post();
    post.title = postDto.title;
    post.description = postDto.description;
    post.slug = postDto.slug;
    post.coverImage = postDto.coverImage;
    post.categoryId = postDto.categoryId; // 直接存储 ID
    post.category = category; // 关联对象
    post.tags = tags; // 关联对象数组
    post.content = postDto.content;
    post.isRecommended = postDto.isRecommended ?? false;
    post.isPublic = postDto.isPublic ?? true;
    post.viewCount = 0; // 初始化浏览次数

    return this.postRepository.save(post);
  }

  /**
     * 获取所有博客文章，不进行分页和搜索
     */
  async getRealAllPosts(): Promise<{ posts: Post[]; total: number }> {
    // 可以根据需要添加排序，例如按名称或创建时间
    const queryBuilder = this.postRepository.createQueryBuilder('post')
      .leftJoinAndSelect('post.category', 'category')
      .leftJoinAndSelect('post.tags', 'tags');
    const [posts, total] = await queryBuilder.getManyAndCount();
    return { posts, total };
  }


  async getAllPosts(queryParams: PostQueryDTO): Promise<{ posts: Post[]; total: number }> {
    const { page = 1, pageSize = 10, categoryId, tagIds, keyword, isPublic, isRecommended } = queryParams;
    const skip = (page - 1) * pageSize;

    const queryBuilder = this.postRepository.createQueryBuilder('post')
      .leftJoinAndSelect('post.category', 'category')
      .leftJoinAndSelect('post.tags', 'tags');

    if (keyword && keyword.trim() !== '') {
      const trimmedKeyword = keyword.trim();
      queryBuilder.andWhere('(post.title LIKE :keyword OR post.description LIKE :keyword)', { keyword: `%${trimmedKeyword}%` });
    }

    if (categoryId) {
      queryBuilder.andWhere('post.categoryId = :categoryId', { categoryId });
    }

    if (tagIds && tagIds !== undefined && tagIds.length > 0) {
      // Find posts that have AT LEAST ONE of the specified tags.
      // The join table name 'post_tags_tag' is TypeORM's default for ManyToMany between Post and Tag.
      // Ensure your @JoinTable decorator in Post entity matches this or adjust accordingly.
      queryBuilder.andWhere(
        'post.id IN (SELECT ptt."postId" FROM post_tags_tag ptt WHERE ptt."tagId" IN (:...tagIdsToFilter))',
        { tagIdsToFilter: tagIds }
      );
    }

    if (typeof isPublic === 'boolean') {
      queryBuilder.andWhere('post.isPublic = :isPublic', { isPublic });
    }

    if (typeof isRecommended === 'boolean') {
      queryBuilder.andWhere('post.isRecommended = :isRecommended', { isRecommended });
    }

    queryBuilder.orderBy('post.createdAt', 'DESC'); // Default sort order
    queryBuilder.skip(skip).take(pageSize);

    const [posts, total] = await queryBuilder.getManyAndCount();
    return { posts, total };
  }

  async getPostByIdOrSlug(idOrSlug: string): Promise<Post | undefined> {
    // 尝试按 ID 查找，然后按 slug 查找
    let post = await this.postRepository.findOne({
      where: { id: idOrSlug },
      relations: ['category', 'tags'],
    });
    if (!post) {
      post = await this.postRepository.findOne({
        where: { slug: idOrSlug },
        relations: ['category', 'tags'],
      });
    }
    // 可以在这里增加浏览次数的逻辑
    // if (post) {
    //   post.viewCount += 1;
    //   await this.postRepository.save(post);
    // }
    return post || undefined;
  }

  async updatePost(id: string, postUpdateDto: UpdatePostDTO): Promise<Post | null> {
    const postToUpdate = await this.postRepository.findOneBy({ id });
    if (!postToUpdate) {
      return null;
    }

    // 更新普通字段
    Object.keys(postUpdateDto).forEach(key => {
      if (key !== 'tagIds' && key !== 'categoryId' && postUpdateDto[key] !== undefined) {
        postToUpdate[key] = postUpdateDto[key];
      }
    });

    // 更新 Category (如果提供了 categoryId)
    if (postUpdateDto.categoryId) {
      const category = await this.categoryRepository.findOneBy({ id: postUpdateDto.categoryId });
      if (!category) throw new MidwayHttpError('Category not found for update', 404);
      postToUpdate.categoryId = category.id; // 更新 ID
      postToUpdate.category = category; // 更新关联对象
    }

    // 更新 Tags (如果提供了 tagIds)
    if (postUpdateDto.tagIds) {
      postToUpdate.tags = await this.tagRepository.findBy({ id: In(postUpdateDto.tagIds) });
    }

    return this.postRepository.save(postToUpdate);
  }

  async deletePost(id: string): Promise<boolean> {
    const result = await this.postRepository.delete(id);
    return result.affected > 0;
  }

  async incrementViewCount(postId: string): Promise<void> {
    await this.postRepository.increment({ id: postId }, 'viewCount', 1);
  }
}