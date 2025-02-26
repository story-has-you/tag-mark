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
   * 获取所有关联关系
   */
  public async getAllRelations(): Promise<TagBookmarkRelation[]> {
    try {
      const result = await chrome.storage.local.get(STORAGE_KEY);
      return result[STORAGE_KEY] || [];
    } catch (error) {
      console.error("获取关联关系失败:", error);
      throw new Error("Failed to fetch relations");
    }
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
    } catch (error) {
      console.error("删除书签关联关系失败:", error);
      throw new Error("Failed to delete relations by bookmark");
    }
  }

  /**
   * 获取书签的所有标签
   */
  public async getTagsByBookmarkId(bookmarkId: string): Promise<Tag[]> {
    try {
      const relations = await this.getAllRelations();
      const tagIds = relations.filter((relation) => relation.bookmarkId === bookmarkId).map((relation) => relation.tagId);

      const allTags = await this.tagService.getAllTags();
      return allTags.filter((tag) => tagIds.includes(tag.id));
    } catch (error) {
      console.error("获取书签标签失败:", error);
      throw new Error("Failed to get tags by bookmark");
    }
  }

  /**
   * 获取标签关联的所有书签
   */
  public async getBookmarksByTagId(tagId: string): Promise<BookmarkTreeNode[]> {
    try {
      const relations = await this.getAllRelations();
      const bookmarkIds = relations.filter((relation) => relation.tagId === tagId).map((relation) => relation.bookmarkId);

      const promises = bookmarkIds.map((id) => this.bookmarkService.getBookmarkById(id));
      const bookmarks = await Promise.all(promises);

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
    } catch (error) {
      console.error("更新书签标签失败:", error);
      throw new Error("Failed to update bookmark tags");
    }
  }
}

export default TagBookmarkRelationService;
