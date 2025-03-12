import { generatePastelColor } from "@/lib/color-utils";
import { safeGetFromStorage } from "@/lib/storage-utils";
import type { CreateTagParams, Tag, UpdateTagParams } from "@/types/tag";

const STORAGE_KEY = "tags";

class TagService {
  private static instance: TagService;
  // 添加缓存属性
  private tagsCache: Tag[] | null = null;
  private lastCacheTime: number = 0;
  private cacheExpiration: number = 5000; // 缓存有效期(毫秒)

  private constructor() {}

  public static getInstance(): TagService {
    if (!TagService.instance) {
      TagService.instance = new TagService();
    }
    return TagService.instance;
  }

  /**
   * 获取所有标签 - 增加缓存机制和安全处理
   */
  public async getAllTags(): Promise<Tag[]> {
    const currentTime = Date.now();

    // 如果缓存有效，直接返回缓存结果
    if (this.tagsCache && currentTime - this.lastCacheTime < this.cacheExpiration) {
      return [...this.tagsCache]; // 返回副本以避免外部修改影响缓存
    }

    try {
      // 使用安全的存储访问函数
      const tags = await safeGetFromStorage<Tag[]>(STORAGE_KEY, []);

      // 数据验证：确保返回的是有效的标签数组
      const validTags = Array.isArray(tags) ? tags.filter((tag) => tag && typeof tag === "object" && typeof tag.id === "string" && typeof tag.name === "string") : [];

      // 更新缓存
      this.tagsCache = validTags;
      this.lastCacheTime = currentTime;

      return [...validTags]; // 返回副本
    } catch (error) {
      console.error("获取标签失败:", error);
      // 如果出错但有缓存，尝试返回过期缓存
      if (this.tagsCache) {
        return [...this.tagsCache];
      }
      throw new Error("Failed to fetch tags");
    }
  }

  /**
   * 清除缓存
   */
  private clearCache(): void {
    this.tagsCache = null;
  }

  /**
   * 根据ID获取标签
   */
  public async getTagById(id: string): Promise<Tag | null> {
    try {
      const tags = await this.getAllTags();
      return tags.find((tag) => tag.id === id) || null;
    } catch (error) {
      console.error("获取标签失败:", error);
      throw new Error("Failed to fetch tag");
    }
  }

  /**
   * 创建标签
   */
  public async createTag(params: CreateTagParams): Promise<Tag> {
    try {
      const tags = await this.getAllTags();

      const newTag: Tag = {
        id: crypto.randomUUID(),
        name: params.name,
        parentId: params.parentId,
        order: params.order || tags.length,
        color: params.color || generatePastelColor(), // 使用提供的颜色或生成随机颜色
        createdAt: Date.now(),
        updatedAt: Date.now()
      };

      tags.push(newTag);
      await chrome.storage.local.set({ [STORAGE_KEY]: tags });
      this.clearCache(); // 清除缓存
      return newTag;
    } catch (error) {
      console.error("创建标签失败:", error);
      throw new Error("Failed to create tag");
    }
  }

  /**
   * 更新标签
   */
  public async updateTag(id: string, params: UpdateTagParams): Promise<Tag> {
    try {
      const tags = await this.getAllTags();
      const index = tags.findIndex((tag) => tag.id === id);

      if (index === -1) {
        throw new Error("Tag not found");
      }

      const updatedTag: Tag = {
        ...tags[index],
        ...params,
        updatedAt: Date.now()
      };

      // 如果没有提供颜色，则保持原有颜色
      if (!params.color && tags[index].color) {
        updatedTag.color = tags[index].color;
      }

      tags[index] = updatedTag;
      await chrome.storage.local.set({ [STORAGE_KEY]: tags });
      this.clearCache(); // 清除缓存
      return updatedTag;
    } catch (error) {
      console.error("更新标签失败:", error);
      throw new Error("Failed to update tag");
    }
  }

  /**
   * 删除标签
   * @param id 要删除的标签ID
   * @param deleteDescendants 是否删除子标签（级联删除）
   */
  public async deleteTag(id: string, deleteDescendants: boolean = false): Promise<void> {
    try {
      const tags = await this.getAllTags();

      // 找到要删除的标签的索引
      const deleteIndex = tags.findIndex((tag) => tag.id === id);

      if (deleteIndex === -1) {
        throw new Error("Tag not found");
      }

      let updatedTags: any[];

      if (deleteDescendants) {
        // 删除所有子孙标签
        // 辅助函数：递归找到所有子孙标签ID
        const findDescendantIds = (parentId: string, tagsArray: Tag[]): string[] => {
          const descendants: string[] = [];
          for (const tag of tagsArray) {
            if (tag.parentId === parentId) {
              descendants.push(tag.id);
              descendants.push(...findDescendantIds(tag.id, tagsArray));
            }
          }
          return descendants;
        };

        // 获取所有需要删除的标签ID
        const descendantIds = findDescendantIds(id, tags);
        const allTagsToDelete = [id, ...descendantIds];

        // 过滤掉需要删除的标签
        updatedTags = tags.filter((tag) => !allTagsToDelete.includes(tag.id));
      } else {
        // 只删除当前标签，子标签变为顶级标签
        updatedTags = tags.map((tag) => {
          if (tag.parentId === id) {
            return {
              ...tag,
              parentId: null,
              updatedAt: Date.now()
            };
          }
          return tag;
        });

        // 从数组中移除要删除的标签
        updatedTags.splice(deleteIndex, 1);
      }
      this.clearCache(); // 清除缓存
      // 保存更新后的标签数组
      await chrome.storage.local.set({ [STORAGE_KEY]: updatedTags });
    } catch (error) {
      console.error("删除标签失败:", error);
      throw new Error("Failed to delete tag");
    }
  }

  /**
   * 批量删除标签
   */
  public async deleteTags(ids: string[]): Promise<void> {
    try {
      const tags = await this.getAllTags();
      const filteredTags = tags.filter((tag) => !ids.includes(tag.id));
      await chrome.storage.local.set({ [STORAGE_KEY]: filteredTags });
      this.clearCache(); // 清除缓存
    } catch (error) {
      console.error("批量删除标签失败:", error);
      throw new Error("Failed to delete tags");
    }
  }
}

export default TagService;
