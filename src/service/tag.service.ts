import { Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { ITag } from '../interface';
import { Tag } from '../entity/tag.entity';

@Provide()
export class TagService {
  @InjectEntityModel(Tag)
  tagRepository: Repository<Tag>;

  async createTag(tagDto: Omit<ITag, 'id' | 'createdAt' | 'updatedAt'>): Promise<ITag> {
    const tag = new Tag();
    tag.name = tagDto.name;
    tag.description = tagDto.description;
    return this.tagRepository.save(tag);
  }

  async getAllTags(): Promise<ITag[]> {
    return this.tagRepository.find();
  }

  async getTagById(id: string): Promise<ITag | undefined> {
    const tag = await this.tagRepository.findOneBy({ id });
    return tag || undefined;
  }

  async updateTag(id: string, tagUpdateDto: Partial<Omit<ITag, 'id' | 'createdAt' | 'updatedAt'>>): Promise<ITag | null> {
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
    return this.tagRepository.save(tagToUpdate);
  }

  async deleteTag(id: string): Promise<boolean> {
    const result = await this.tagRepository.delete(id);
    return result.affected > 0;
  }
}