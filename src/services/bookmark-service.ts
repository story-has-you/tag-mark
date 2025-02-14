import type { BookmarkTreeNode, BookmarkUpdateParams } from "@/types/bookmark";

/**
 * 书签服务类
 * 负责处理与浏览器书签相关的所有操作
 */
class BookmarkService {
  private static instance: BookmarkService;

  private constructor() {}

  /**
   * 获取单例实例
   */
  public static getInstance(): BookmarkService {
    if (!BookmarkService.instance) {
      BookmarkService.instance = new BookmarkService();
    }
    return BookmarkService.instance;
  }

  /**
   * 获取所有书签
   * @returns Promise<BookmarkNode[]> 书签树结构
   */
  public async getAllBookmarks(): Promise<BookmarkTreeNode[]> {
    try {
      const bookmarks = await chrome.bookmarks.getTree();
      return this.processBookmarks(bookmarks);
    } catch (error) {
      console.error("获取书签失败:", error);
      throw new Error("Failed to fetch bookmarks");
    }
  }

  /**
   * 处理书签数据
   * @param nodes 原始书签节点
   * @returns 处理后的书签节点数组
   */
  private processBookmarks(nodes: chrome.bookmarks.BookmarkTreeNode[]): BookmarkTreeNode[] {
    return nodes.map((node) => ({
      ...node,
      children: node.children ? this.processBookmarks(node.children) : undefined
    }));
  }

  /**
   * 搜索书签
   * @param query 搜索关键词
   * @returns Promise<BookmarkNode[]> 匹配的书签数组
   */
  public async searchBookmarks(query: string): Promise<BookmarkTreeNode[]> {
    try {
      const results = await chrome.bookmarks.search(query);
      return this.processBookmarks(results);
    } catch (error) {
      console.error("搜索书签失败:", error);
      throw new Error("Failed to search bookmarks");
    }
  }

  /**
   * 更新书签
   * @param id 书签ID
   * @param params 更新参数，包含可选的 title 和 url
   * @returns Promise<BookmarkTreeNode> 更新后的书签节点
   */
  public async updateBookmark(id: string, params: BookmarkUpdateParams): Promise<BookmarkTreeNode> {
    try {
      const updatedBookmark = await chrome.bookmarks.update(id, params);
      return updatedBookmark;
    } catch (error) {
      console.error("更新书签失败:", error);
      throw new Error("Failed to update bookmark");
    }
  }

  /**
   * 删除书签
   * @param id 要删除的书签ID
   * @returns Promise<void>
   * @throws Error 如果删除失败
   */
  public async deleteBookmark(id: string): Promise<void> {
    try {
      await chrome.bookmarks.remove(id);
    } catch (error) {
      console.error("删除书签失败:", error);
      throw new Error("Failed to delete bookmark");
    }
  }
}

export default BookmarkService;
