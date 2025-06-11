/**
 * @description User-Service parameters
 */
export interface IUserOptions {
  uid: number;
}

export interface ICategory {
  id?: string; // 分类ID，通常由数据库生成或在创建时生成
  name: string; // 分类名称
  description?: string; // 分类描述，可选
  createdAt?: Date; // 创建时间
  updatedAt?: Date; // 更新时间
}

export interface ITag {
  id?: string; // 标签ID
  name: string; // 标签名称
  description?: string; // 标签描述，可选
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IPhoto {
  id?: string; // 图片ID
  imageUrl: string; // 图片地址
  description?: string; // 图片描述，可选
  uploadTime?: Date; // 上传时间 (使用 CreateDateColumn)
  createdAt?: Date; // 创建时间 (TypeORM 自动管理)
  updatedAt?: Date; // 更新时间 (TypeORM 自动管理)
}

export interface IUser { // 用户接口
  id?: string; // 用户ID
  username: string; // 用户名
  password?: string; // 密码 (在接口中通常是可选的，因为不会直接返回)
  email?: string; // 邮箱，可选
  createdAt?: Date;
  updatedAt?: Date;
}
