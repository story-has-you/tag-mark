export interface Tag {
  id: string; // 使用 UUID
  name: string; // 标签名称
  parentId?: string; // 父标签ID，可选
  order: number; // 排序序号
  createdAt: number; // 创建时间戳
  updatedAt: number; // 更新时间戳
}
