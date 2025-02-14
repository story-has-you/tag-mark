import type { TagBookmarkRelation } from "@/types/relation";
import type { Tag } from "@/types/tag";

/**
 * 用来展示书签树的数据结构
 */
export type BookmarkTreeNode = chrome.bookmarks.BookmarkTreeNode;
export type BookmarkUpdateParams = chrome.bookmarks.BookmarkChangesArg;

/**
 * 用来存储书签的数据结构
 */
export interface BookmarkStoreNode {
  id: string;
  title: string;
  url?: string | undefined;
}

export interface BookmarkError {
  message: string;
  code?: string;
}

export interface BookmarkStore {
  tags: Tag[];
  bookmarks: BookmarkStoreNode[];
  relations: TagBookmarkRelation[];
  // 用于快速查询的索引
  tagBookmarkIndex: Record<string, string[]>; // tagId -> bookmarkIds
  bookmarkTagIndex: Record<string, string[]>; // bookmarkId -> tagIds
}
