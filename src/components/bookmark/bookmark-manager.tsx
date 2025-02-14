import { BookmarkProvider } from "@/components/bookmark/bookmark-context";
import BookmarkList from "@/components/bookmark/bookmark-list";
import { BookmarkTree } from "@/components/bookmark/bookmark-tree";
import Resizer from "@/components/resizer";
import BookmarkService from "@/services/bookmark-service";
import type { BookmarkTreeNode } from "@/types/bookmark";
import React, { useEffect, useState } from "react";

const MIN_SIDEBAR_WIDTH = 200; // 最小宽度
const MAX_SIDEBAR_WIDTH = 600; // 最大宽度

const BookmarkManager: React.FC = () => {
  const [bookmarks, setBookmarks] = useState<BookmarkTreeNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sidebarWidth, setSidebarWidth] = useState(300); // 默认宽度

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const bookmarkService = BookmarkService.getInstance();
        const data = await bookmarkService.getAllBookmarks();
        setBookmarks(data);
      } catch (err) {
        setError("加载书签失败");
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarks();
  }, []);

  const handleResize = (delta: number) => {
    setSidebarWidth((width) => {
      const newWidth = width + delta;
      return Math.min(Math.max(newWidth, MIN_SIDEBAR_WIDTH), MAX_SIDEBAR_WIDTH);
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 p-4 text-center">{error}</div>;
  }

  return (
    <BookmarkProvider>
      <div className="flex h-screen select-none">
        {/* 左侧树形结构 */}
        <div
          className="border-r border-gray-200 dark:border-gray-700 overflow-hidden"
          style={{ width: sidebarWidth }}>
          <BookmarkTree bookmarks={bookmarks} />
        </div>

        {/* 分隔条 */}
        <Resizer onResize={handleResize} />

        {/* 右侧书签列表 */}
        <div className="flex-1 overflow-hidden">
          <BookmarkList />
        </div>
      </div>
    </BookmarkProvider>
  );
};

BookmarkManager.displayName = "BookmarkManager";

export default BookmarkManager;
