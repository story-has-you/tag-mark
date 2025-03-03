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
   * 根据ID获取书签
   * @param id 书签ID
   * @returns Promise<BookmarkTreeNode | null> 书签节点,不存在时返回 null
   */
  public async getBookmarkById(id: string): Promise<BookmarkTreeNode | null> {
    try {
      const subTree = await chrome.bookmarks.getSubTree(id);
      if (subTree && subTree.length > 0) {
        return this.processBookmarks(subTree)[0];
      }
      return null;
    } catch (error) {
      if (error instanceof Error && error.message.includes("No bookmark with id")) {
        return null;
      }
      console.error("获取书签失败:", error);
      throw new Error("Failed to fetch bookmark");
    }
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

  /**
   * 创建标签组并打开书签
   * @param bookmarks 要打开的书签数组
   * @param groupTitle 标签组标题
   * @returns Promise<void>
   */
  public async openBookmarksInGroup(bookmarks: BookmarkTreeNode[], groupTitle: string): Promise<void> {
    try {
      // 先打开所有书签并获取标签ID
      const tabPromises = bookmarks
        .filter((bookmark) => bookmark.url) // 只处理有 URL 的书签
        .map(async (bookmark) => {
          const tab = await chrome.tabs.create({
            url: bookmark.url,
            active: false // 不自动切换到新标签
          });
          return tab.id;
        });

      // 等待所有标签创建完成
      const tabIds = await Promise.all(tabPromises);

      // 过滤出有效的标签ID
      const validTabIds = tabIds.filter((id): id is number => id !== undefined);

      if (validTabIds.length === 0) {
        throw new Error("No valid tabs created");
      }

      // 创建标签组并添加标签
      const groupId = await chrome.tabs.group({
        tabIds: validTabIds,
        createProperties: { windowId: chrome.windows.WINDOW_ID_CURRENT }
      });

      // 设置标签组标题
      await chrome.tabGroups.update(groupId, {
        title: groupTitle,
        collapsed: false
      });
    } catch (error) {
      console.error("打开书签组失败:", error);
      throw new Error("Failed to open bookmarks in group");
    }
  }

  public async createTab(url: string) {
    try {
      chrome.tabs.create({ url });
    } catch (error) {
      console.error("创建标签页失败:", error);
      throw new Error("Failed to create tab");
    }
  }
}

export default BookmarkService;
