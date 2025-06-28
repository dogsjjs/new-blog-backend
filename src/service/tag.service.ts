import { Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { ITag } from '../interface';
import { Tag } from '../entity/tag.entity';
import { QueryTagDTO, CreateTagDTO, UpdateTagDTO } from '../dto/tag.dto';

@Provide()
export class TagService {
  @InjectEntityModel(Tag)
  tagRepository: Repository<Tag>;

  async createTag(tagDto: CreateTagDTO): Promise<ITag> {
    const tag = new Tag();
    tag.name = tagDto.name;
    tag.description = tagDto.description;
    tag.icon = tagDto.icon;
    return this.tagRepository.save(tag);
  }

  async getAllTags(
    queryParams: QueryTagDTO
  ): Promise<{ tags: ITag[]; total: number }> {
    const { page = 1, pageSize = 10, query } = queryParams;
    const skip = (page - 1) * pageSize;

    const queryBuilder = this.tagRepository
      .createQueryBuilder('tag')
      .leftJoinAndSelect('tag.posts', 'post') // 可选，如果需要加载 posts 数组
      .loadRelationCountAndMap('tag.postCount', 'tag.posts');

    // 只有当 query 存在且不为空字符串时，才添加搜索条件
    if (query && query.trim() !== '') {
      // 同时搜索 name 和 description
      queryBuilder.andWhere(
        '(tag.name LIKE :query OR tag.description LIKE :query)',
        { query: `%${query.trim()}%` }
      );
    }

    queryBuilder.orderBy('tag.createdAt', 'DESC').skip(skip).take(pageSize);

    const [rawTags, total] = await queryBuilder.getManyAndCount();

    const tags: ITag[] = rawTags.map(t => ({
      ...t,
      postCount: (t as any).postCount,
    }));

    return { tags, total };
  }

  /**
   * 获取所有标签，不进行分页和搜索，通常用于下拉选择等场景
   * 仅返回 id, name, icon
   */
  async getAllTagsForSelect(): Promise<Pick<ITag, 'id' | 'name' | 'icon'>[]> {
    // 可以根据需要添加排序，例如按名称或创建时间
    const tags = await this.tagRepository.find({
      order: { createdAt: 'ASC' },
    });
    return tags.map(tag => ({
      id: tag.id,
      name: tag.name,
      icon: tag.icon,
    }));
  }

  async getTagById(id: string): Promise<ITag | undefined> {
    const tag = await this.tagRepository.findOneBy({ id });
    return tag || undefined;
  }

  async updateTag(
    id: string,
    tagUpdateDto: UpdateTagDTO
  ): Promise<ITag | null> {
    const tagToUpdate = await this.tagRepository.findOneBy({ id });
    if (!tagToUpdate) {
      return null;
    }

    if (tagUpdateDto.name !== undefined) {
      tagToUpdate.name = tagUpdateDto.name;
    }
    if (tagUpdateDto.description !== undefined) {
      tagToUpdate.description = tagUpdateDto.description;
    }
    if (tagUpdateDto.icon !== undefined) {
      tagToUpdate.icon = tagUpdateDto.icon;
    }
    return this.tagRepository.save(tagToUpdate);
  }

  async deleteTag(id: string): Promise<boolean> {
    const result = await this.tagRepository.softDelete(id);
    return result.affected > 0;
  }
}
