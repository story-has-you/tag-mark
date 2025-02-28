import BookmarkService from "@/services/bookmark-service";
import { bookmarkLoadingAtom, bookmarksAtom, selectedNodeAtom } from "@/store/bookmark";
import type { BookmarkTreeNode, BookmarkUpdateParams } from "@/types/bookmark";
import { useAtom } from "jotai";
import { useCallback, useEffect, useState } from "react";

export const useBookmark = () => {
  const [bookmarks, setBookmarks] = useAtom(bookmarksAtom);
  const [loading, setLoading] = useAtom(bookmarkLoadingAtom);
  const [selectedNode, setSelectedNode] = useAtom(selectedNodeAtom);
  const [openableBookmarks, setOpenableBookmarks] = useState<BookmarkTreeNode[]>([]);

  const searchBookmarks = useCallback(
    async (query: string) => {
      try {
        setLoading(true);
        const results = await BookmarkService.getInstance().searchBookmarks(query);
        setBookmarks(results);
      } finally {
        setLoading(false);
      }
    },
    [setBookmarks, setLoading]
  );

  const updateBookmark = useCallback(
    async (id: string, params: BookmarkUpdateParams) => {
      try {
        setLoading(true);
        return await BookmarkService.getInstance().updateBookmark(id, params);
      } finally {
        setLoading(false);
      }
    },
    [setLoading]
  );

  const getBookmarkById = useCallback(async (id: string) => await BookmarkService.getInstance().getBookmarkById(id), [bookmarks]);

  // 将获取可打开书签的逻辑从回调函数中移出，避免不必要的依赖
  const getOpenableBookmarks = useCallback((nodes: BookmarkTreeNode[]): BookmarkTreeNode[] => {
    const result: BookmarkTreeNode[] = [];

    const traverse = (node: BookmarkTreeNode) => {
      // 如果是可打开的书签，添加到结果中
      if (node.url) {
        result.push(node);
      }

      // 如果有子节点，递归处理
      if (node.children) {
        node.children.forEach(traverse);
      }
    };

    // 遍历所有根节点
    nodes.forEach(traverse);
    return result;
  }, []); // 移除 bookmarks 依赖，因为它在函数内部没有使用

  const fetchBookmarks = useCallback(async () => {
    try {
      setLoading(true);
      const data = await BookmarkService.getInstance().getAllBookmarks();
      setBookmarks(data);
      // 使用新获取的数据计算可打开书签
      const openable = getOpenableBookmarks(data);
      setOpenableBookmarks(openable);
    } finally {
      setLoading(false);
    }
  }, [getOpenableBookmarks, setBookmarks, setLoading]);

  const deleteBookmark = useCallback(
    async (id: string) => {
      try {
        setLoading(true);
        await BookmarkService.getInstance().deleteBookmark(id);
        // 删除后重新获取最新数据
        await fetchBookmarks();
      } finally {
        setLoading(false);
      }
    },
    [fetchBookmarks, setLoading]
  );

  useEffect(() => {
    fetchBookmarks();
  }, []);

  return {
    bookmarks,
    loading,
    selectedNode,
    openableBookmarks,
    getBookmarkById,
    fetchBookmarks,
    searchBookmarks,
    updateBookmark,
    deleteBookmark,
    setSelectedNode
  };
};
