export interface Tag {
  id: string; // 使用 UUID
  name: string; // 标签名称
  fullPath?: string; // 完整路径, 可选, 查询的时候构建
  parentId?: string; // 父标签ID，可选
  order: number; // 排序序号
  color?: string; // 新增：标签颜色
  createdAt: number; // 创建时间戳
  updatedAt: number; // 更新时间戳
}

export interface CreateTagParams {
  name: string;
  parentId?: string;
  order?: number;
  color?: string; // 新增：标签颜色
}

export interface UpdateTagParams extends CreateTagParams {
  id: string;
}
