import { Inject, Controller, Get, Post as HttpPost, Put, Del, Param, Body, HttpCode, Query } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { PostService } from '../service/post.service';
import { Post as PostEntity } from '../entity/post.entity'; // 避免与 HttpPost 冲突
import { CreatePostDTO, UpdatePostDTO, PostQueryDTO } from '../dto/post.dto';
import { Validate } from '@midwayjs/validate';

@Controller('/post')
export class PostController {
  @Inject()
  ctx: Context;

  @Inject()
  postService: PostService;

  @HttpPost('/', { description: '创建新的博客文章' })
  @Validate()
  async createPost(@Body() postDto: CreatePostDTO): Promise<PostEntity> {
    const post = await this.postService.createPost(postDto);
    this.ctx.status = 201;
    return post;
  }

  @Get('/', { description: '获取博客文章列表（分页）' })
  @Validate() // 对 PostQueryDTO 进行校验
  async getAllPosts(@Query() query: PostQueryDTO): Promise<{ posts: PostEntity[]; total: number; page: number; pageSize: number }> {
    const { posts, total } = await this.postService.getAllPosts(query);
    return { posts, total, page: query.page, pageSize: query.pageSize };
  }

  @Get('/:idOrSlug', { description: '根据ID或Slug获取单个博客文章' })
  async getPostByIdOrSlug(@Param('idOrSlug') idOrSlug: string): Promise<PostEntity> {
    const post = await this.postService.getPostByIdOrSlug(idOrSlug);
    if (!post) {
      this.ctx.throw(404, 'Post not found');
    }
    // 异步增加浏览次数，不阻塞主响应
    this.postService.incrementViewCount(post.id).catch(err => {
      this.ctx.logger.error(`Failed to increment view count for post ${post.id}`, err);
    });
    return post;
  }

  @Put('/:id', { description: '根据ID更新博客文章' })
  @Validate()
  async updatePost(@Param('id') id: string, @Body() postUpdateDto: UpdatePostDTO): Promise<PostEntity> {
    // 确保 id 是有效的 UUID (如果你的 id 策略是 uuid)
    // if (!isValidUuid(id)) { this.ctx.throw(400, 'Invalid post ID format'); }

    const updatedPost = await this.postService.updatePost(id, postUpdateDto);
    if (!updatedPost) {
      this.ctx.throw(404, 'Post not found for update');
    }
    return updatedPost;
  }

  @Del('/:id', { description: '根据ID删除博客文章' })
  @HttpCode(204) // No Content
  async deletePost(@Param('id') id: string): Promise<void> {
    // if (!isValidUuid(id)) { this.ctx.throw(400, 'Invalid post ID format'); }
    const success = await this.postService.deletePost(id);
    if (!success) {
      this.ctx.throw(404, 'Post not found for deletion');
    }
  }
}