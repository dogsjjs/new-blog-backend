import { Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { IPhoto } from '../interface';
import { Photo } from '../entity/photo.entity';

@Provide()
export class PhotoService {
  @InjectEntityModel(Photo)
  photoRepository: Repository<Photo>;

  async createPhoto(photoDto: Omit<IPhoto, 'id' | 'createdAt' | 'updatedAt'>): Promise<IPhoto> {
    const photo = new Photo();
    photo.imageUrl = photoDto.imageUrl;
    photo.description = photoDto.description;
    // createdAt and updatedAt are handled by TypeORM
    return this.photoRepository.save(photo);
  }

  async getAllPhotos(): Promise<IPhoto[]> {
    return this.photoRepository.find();
  }

  async getPhotoById(id: string): Promise<IPhoto | undefined> {
    const photo = await this.photoRepository.findOneBy({ id });
    return photo || undefined;
  }

  async updatePhoto(id: string, photoUpdateDto: Partial<Omit<IPhoto, 'id' | 'createdAt' | 'updatedAt'>>): Promise<IPhoto | null> {
    const photoToUpdate = await this.photoRepository.findOneBy({ id });
    if (!photoToUpdate) {
      return null;
    }

    if (photoUpdateDto.imageUrl !== undefined) {
      photoToUpdate.imageUrl = photoUpdateDto.imageUrl;
    }
    if (photoUpdateDto.description !== undefined) {
      photoToUpdate.description = photoUpdateDto.description;
    }
    return this.photoRepository.save(photoToUpdate);
  }

  async deletePhoto(id: string): Promise<boolean> {
    const result = await this.photoRepository.delete(id);
    return result.affected > 0;
  }
}