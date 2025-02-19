import type { BookmarkTreeNode } from "@/types/bookmark";
import { useCallback, useEffect, useState } from "react";

const getBookmarksFromNode = (node: BookmarkTreeNode): BookmarkTreeNode[] => {
  // 只返回直接子节点中的书签（带 url 的节点）
  return node.children?.filter((child) => child.url) || [];
};

export const useBookmarkList = (selectedNode: BookmarkTreeNode | null) => {
  const [bookmarks, setBookmarks] = useState<BookmarkTreeNode[]>([]);

  // 只在 selectedNode 变化时更新书签列表
  useEffect(() => {
    if (!selectedNode) {
      setBookmarks([]);
      return;
    }
    setBookmarks(getBookmarksFromNode(selectedNode));
  }, [selectedNode]);

  const updateLocalBookmark = useCallback((updatedBookmark: BookmarkTreeNode) => {
    setBookmarks((prev) => prev.map((bookmark) => (bookmark.id === updatedBookmark.id ? updatedBookmark : bookmark)));
  }, []);

  const deleteLocalBookmark = useCallback((bookmarkId: string) => {
    setBookmarks((prev) => prev.filter((bookmark) => bookmark.id !== bookmarkId));
  }, []);

  return {
    bookmarks,
    updateLocalBookmark,
    deleteLocalBookmark
  };
};
