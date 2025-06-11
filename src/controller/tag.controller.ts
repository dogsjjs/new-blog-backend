import { Inject, Controller, Get, Post, Put, Del, Param, Body, HttpCode } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { TagService } from '../service/tag.service';
import { ITag } from '../interface';
import { CreateTagDTO, UpdateTagDTO } from '../dto/tag.dto';
import { Validate } from '@midwayjs/validate';

@Controller('/tag')
export class TagController {
  @Inject()
  ctx: Context;

  @Inject()
  tagService: TagService;

  @Post('/', { description: '创建新的博客标签' })
  @Validate()
  async createTag(@Body() tagDto: CreateTagDTO): Promise<ITag> {
    return this.tagService.createTag(tagDto);
  }

  @Get('/', { description: '获取所有博客标签' })
  async getAllTags(): Promise<ITag[]> {
    return this.tagService.getAllTags();
  }

  @Get('/:id', { description: '根据ID获取单个博客标签' })
  async getTagById(@Param('id') id: string): Promise<ITag> {
    const tag = await this.tagService.getTagById(id);
    if (!tag) {
      this.ctx.throw(404, 'Tag not found');
    }
    return tag;
  }

  @Put('/:id', { description: '根据ID更新博客标签' })
  @Validate()
  async updateTag(@Param('id') id: string, @Body() tagUpdateDto: UpdateTagDTO): Promise<ITag> {
    const updatedTag = await this.tagService.updateTag(id, tagUpdateDto);
    if (!updatedTag) {
      this.ctx.throw(404, 'Tag not found for update');
    }
    return updatedTag;
  }

  @Del('/:id', { description: '根据ID删除博客标签' })
  @HttpCode(204) // No Content
  async deleteTag(@Param('id') id: string): Promise<void> {
    const success = await this.tagService.deleteTag(id);
    if (!success) {
      this.ctx.throw(404, 'Tag not found for deletion');
    }
  }
}