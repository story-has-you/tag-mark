import BookmarkService from "@/services/bookmark-service";
import { bookmarkLoadingAtom, bookmarksAtom } from "@/store/bookmark";
import type { BookmarkUpdateParams } from "@/types/bookmark";
import { useAtom } from "jotai";
import { useCallback, useEffect } from "react";

export const useBookmark = () => {
  const [bookmarks, setBookmarks] = useAtom(bookmarksAtom);
  const [loading, setLoading] = useAtom(bookmarkLoadingAtom);

  const fetchBookmarks = useCallback(async () => {
    try {
      setLoading(true);
      const data = await BookmarkService.getInstance().getAllBookmarks();
      setBookmarks(data);
    } finally {
      setLoading(false);
    }
  }, [setBookmarks]);

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
    fetchBookmarks,
    searchBookmarks,
    updateBookmark,
    deleteBookmark
  };
};
