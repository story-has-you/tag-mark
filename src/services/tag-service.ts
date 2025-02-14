import type { CreateTagParams, Tag, UpdateTagParams } from "@/types/tag";

const STORAGE_KEY = "tags";

class TagService {
  private static instance: TagService;

  private constructor() {}

  public static getInstance(): TagService {
    if (!TagService.instance) {
      TagService.instance = new TagService();
    }
    return TagService.instance;
  }

  /**
   * 获取所有标签
   */
  public async getAllTags(): Promise<Tag[]> {
    try {
      const result = await chrome.storage.local.get(STORAGE_KEY);
      return result[STORAGE_KEY] || [];
    } catch (error) {
      console.error("获取标签失败:", error);
      throw new Error("Failed to fetch tags");
    }
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
        createdAt: Date.now(),
        updatedAt: Date.now()
      };

      tags.push(newTag);
      await chrome.storage.local.set({ [STORAGE_KEY]: tags });

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

      tags[index] = updatedTag;
      await chrome.storage.local.set({ [STORAGE_KEY]: tags });

      return updatedTag;
    } catch (error) {
      console.error("更新标签失败:", error);
      throw new Error("Failed to update tag");
    }
  }

  /**
   * 删除标签
   */
  public async deleteTag(id: string): Promise<void> {
    try {
      const tags = await this.getAllTags();
      const filteredTags = tags.filter((tag) => tag.id !== id);
      await chrome.storage.local.set({ [STORAGE_KEY]: filteredTags });
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
    } catch (error) {
      console.error("批量删除标签失败:", error);
      throw new Error("Failed to delete tags");
    }
  }
}

export default TagService;
