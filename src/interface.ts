/**
 * @description User-Service parameters
 */
export interface IUserOptions {
  uid: number;
}

/**
 * 统一全局响应格式接口
 * @template T - 响应数据类型，默认为 any
 * @property {boolean} success - 请求是否成功
 * @property {T} [data] - 响应数据，成功时返回
 * @property {string} [message] - 响应消息，通常用于描述错误或状态
 * @property {number} [code] - 响应状态码，通常为 HTTP
 */
export interface IGlobalResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  code?: number;
}

export interface ICategory {
  id?: string; // 分类ID，通常由数据库生成或在创建时生成
  name: string; // 分类名称
  description?: string; // 分类描述，可选
  createdAt?: Date; // 创建时间
  updatedAt?: Date; // 更新时间
  postCount?: number; // 该分类下的文章数量
  icon?: string; // 分类图标，可选
}

export interface ITag {
  id?: string; // 标签ID
  name: string; // 标签名称
  description?: string; // 标签描述，可选
  createdAt?: Date;
  updatedAt?: Date;
  postCount?: number; // 该标签下的文章数量
  icon?: string; // 标签图标，可选
}

export interface IPost {
  id?: string; // 文章ID
  title: string; // 文章标题
  description?: string; // 文章描述，可选
  slug?: string; // 自定义 URL
  coverImage?: string; // 首图 URL
  categoryId: string; // 分类ID
  category?: ICategory; // 分类对象
  tagIds: string[]; // 标签ID数组
  tags?: ITag[]; // 标签对象数组
  content: string; // Markdown 内容
  isRecommended: boolean; // 是否推荐
  isPublic: boolean; // 是否公开
  viewCount: number; // 浏览次数
  createdAt?: Date; // 创建时间
  updatedAt?: Date; // 更新时间
}

export interface IDiary {
  id?: string;
  title: string;
  content: string; // Markdown content
  isPublic: boolean;
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

export interface IUser {
  // 用户接口
  id?: string; // 用户ID
  username: string; // 用户名
  password?: string; // 密码 (在接口中通常是可选的，因为不会直接返回)
  email?: string; // 邮箱，可选
  createdAt?: Date;
  updatedAt?: Date;
}
