import { Inject, Controller, Get, Post, Put, Del, Param, Body, HttpCode } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { PhotoService } from '../service/photo.service';
import { IPhoto } from '../interface';
import { CreatePhotoDTO, UpdatePhotoDTO } from '../dto/photo.dto';
import { Validate } from '@midwayjs/validate';

@Controller('/api/photo')
export class PhotoController {
  @Inject()
  ctx: Context;

  @Inject()
  photoService: PhotoService;

  @Post('/', { description: '上传新的博客图片' })
  @Validate()
  async createPhoto(@Body() photoDto: CreatePhotoDTO): Promise<IPhoto> {
    return this.photoService.createPhoto(photoDto);
  }

  @Get('/', { description: '获取所有博客图片' })
  async getAllPhotos(): Promise<IPhoto[]> {
    return this.photoService.getAllPhotos();
  }

  @Get('/:id', { description: '根据ID获取单个博客图片' })
  async getPhotoById(@Param('id') id: string): Promise<IPhoto> {
    const photo = await this.photoService.getPhotoById(id);
    if (!photo) {
      this.ctx.throw(404, 'Photo not found');
    }
    return photo;
  }

  @Put('/:id', { description: '根据ID更新博客图片' })
  @Validate()
  async updatePhoto(@Param('id') id: string, @Body() photoUpdateDto: UpdatePhotoDTO): Promise<IPhoto> {
    const updatedPhoto = await this.photoService.updatePhoto(id, photoUpdateDto);
    if (!updatedPhoto) {
      this.ctx.throw(404, 'Photo not found for update');
    }
    return updatedPhoto;
  }

  @Del('/:id', { description: '根据ID删除博客图片' })
  @HttpCode(204) // No Content
  async deletePhoto(@Param('id') id: string): Promise<void> {
    const success = await this.photoService.deletePhoto(id);
    if (!success) {
      this.ctx.throw(404, 'Photo not found for deletion');
    }
  }
}