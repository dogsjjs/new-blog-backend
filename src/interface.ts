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
