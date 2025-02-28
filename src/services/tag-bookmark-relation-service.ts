import BookmarkService from "@/services/bookmark-service";
import TagService from "@/services/tag-service";
import type { BookmarkTreeNode } from "@/types/bookmark";
import type { TagBookmarkRelation } from "@/types/relation";
import type { Tag } from "@/types/tag";

const STORAGE_KEY = "tag_bookmark_relations";

class TagBookmarkRelationService {
  private static instance: TagBookmarkRelationService;
  private tagService: TagService;
  private bookmarkService: BookmarkService;
  // 添加缓存属性
  private relationsCache: TagBookmarkRelation[] | null = null;
  private lastCacheTime: number = 0;
  private cacheExpiration: number = 5000; // 缓存有效期(毫秒)

  private constructor() {
    this.tagService = TagService.getInstance();
    this.bookmarkService = BookmarkService.getInstance();
  }

  public static getInstance(): TagBookmarkRelationService {
    if (!TagBookmarkRelationService.instance) {
      TagBookmarkRelationService.instance = new TagBookmarkRelationService();
    }
    return TagBookmarkRelationService.instance;
  }

  /**
   * 获取所有关联关系 - 增加缓存机制
   */
  public async getAllRelations(): Promise<TagBookmarkRelation[]> {
    const currentTime = Date.now();

    // 如果缓存有效，直接返回缓存结果
    if (this.relationsCache && currentTime - this.lastCacheTime < this.cacheExpiration) {
      return this.relationsCache;
    }

    try {
      const result = await chrome.storage.local.get(STORAGE_KEY);
      const relations = result[STORAGE_KEY] || [];

      // 更新缓存
      this.relationsCache = relations;
      this.lastCacheTime = currentTime;

      return relations;
    } catch (error) {
      console.error("获取关联关系失败:", error);
      // 如果出错但有缓存，尝试返回过期缓存
      if (this.relationsCache) {
        return this.relationsCache;
      }
      throw new Error("Failed to fetch relations");
    }
  }

  /**
   * 清除缓存
   */
  private clearCache(): void {
    this.relationsCache = null;
  }

  /**
   * 创建关联关系
   */
  public async createRelation(tagId: string, bookmarkId: string): Promise<TagBookmarkRelation> {
    try {
      const relations = await this.getAllRelations();

      // 检查是否已存在相同的关联关系
      const existingRelation = relations.find((relation) => relation.tagId === tagId && relation.bookmarkId === bookmarkId);

      if (existingRelation) {
        return existingRelation;
      }

      const newRelation: TagBookmarkRelation = {
        tagId,
        bookmarkId,
        createdAt: Date.now()
      };

      relations.push(newRelation);
      await chrome.storage.local.set({ [STORAGE_KEY]: relations });

      // 清除缓存以保持一致性
      this.clearCache();

      return newRelation;
    } catch (error) {
      console.error("创建关联关系失败:", error);
      throw new Error("Failed to create relation");
    }
  }

  /**
   * 删除关联关系
   */
  public async deleteRelation(tagId: string, bookmarkId: string): Promise<void> {
    try {
      const relations = await this.getAllRelations();
      const filteredRelations = relations.filter((relation) => !(relation.tagId === tagId && relation.bookmarkId === bookmarkId));
      await chrome.storage.local.set({ [STORAGE_KEY]: filteredRelations });
      this.clearCache(); // 清除缓存
    } catch (error) {
      console.error("删除关联关系失败:", error);
      throw new Error("Failed to delete relation");
    }
  }

  /**
   * 删除标签的所有关联关系
   */
  public async deleteRelationsByTagId(tagId: string): Promise<void> {
    try {
      const relations = await this.getAllRelations();
      const filteredRelations = relations.filter((relation) => relation.tagId !== tagId);
      await chrome.storage.local.set({ [STORAGE_KEY]: filteredRelations });
      // 清除缓存以保持一致性
      this.clearCache();
    } catch (error) {
      console.error("删除标签关联关系失败:", error);
      throw new Error("Failed to delete relations by tag");
    }
  }

  /**
   * 删除书签的所有关联关系
   */
  public async deleteRelationsByBookmarkId(bookmarkId: string): Promise<void> {
    try {
      const relations = await this.getAllRelations();
      const filteredRelations = relations.filter((relation) => relation.bookmarkId !== bookmarkId);
      await chrome.storage.local.set({ [STORAGE_KEY]: filteredRelations });
      // 清除缓存以保持一致性
      this.clearCache();
    } catch (error) {
      console.error("删除书签关联关系失败:", error);
      throw new Error("Failed to delete relations by bookmark");
    }
  }

  /**
   * 优化获取书签的所有标签的方法
   */
  public async getTagsByBookmarkId(bookmarkId: string): Promise<Tag[]> {
    try {
      // 先获取与该书签相关的所有标签ID
      const relations = await this.getAllRelations();
      const tagIds = relations.filter((relation) => relation.bookmarkId === bookmarkId).map((relation) => relation.tagId);

      if (tagIds.length === 0) {
        return []; // 如果没有标签，直接返回空数组，避免获取所有标签
      }

      // 获取所有标签，但只保留与书签相关的标签
      const allTags = await this.tagService.getAllTags();
      return allTags.filter((tag) => tagIds.includes(tag.id));
    } catch (error) {
      console.error("获取书签标签失败:", error);
      throw new Error("Failed to get tags by bookmark");
    }
  }

  /**
   * 优化获取标签关联的所有书签的方法
   */
  public async getBookmarksByTagId(tagId: string): Promise<BookmarkTreeNode[]> {
    try {
      // 先获取与该标签相关的所有书签ID
      const relations = await this.getAllRelations();
      const bookmarkIds = relations.filter((relation) => relation.tagId === tagId).map((relation) => relation.bookmarkId);

      if (bookmarkIds.length === 0) {
        return []; // 如果没有书签，直接返回空数组
      }

      // 优化：使用Promise.all并行获取各书签详情
      const bookmarks = await Promise.all(bookmarkIds.map((id) => this.bookmarkService.getBookmarkById(id)));

      return bookmarks.filter((bookmark): bookmark is BookmarkTreeNode => bookmark !== null);
    } catch (error) {
      console.error("获取标签书签失败:", error);
      throw new Error("Failed to get bookmarks by tag");
    }
  }

  /**
   * 批量更新书签的标签
   */
  public async updateBookmarkTags(bookmarkId: string, tagIds: string[]): Promise<void> {
    try {
      // 获取当前所有关联关系
      const allRelations = await this.getAllRelations();

      // 过滤掉当前书签的所有关联关系
      const otherRelations = allRelations.filter((relation) => relation.bookmarkId !== bookmarkId);

      // 创建新的关联关系
      const newRelations: TagBookmarkRelation[] = tagIds.map((tagId) => ({
        tagId,
        bookmarkId,
        createdAt: Date.now()
      }));

      // 合并并保存关联关系
      const updatedRelations = [...otherRelations, ...newRelations];
      await chrome.storage.local.set({ [STORAGE_KEY]: updatedRelations });
      // 清除缓存以保持一致性
      this.clearCache();
    } catch (error) {
      console.error("更新书签标签失败:", error);
      throw new Error("Failed to update bookmark tags");
    }
  }
}

export default TagBookmarkRelationService;
