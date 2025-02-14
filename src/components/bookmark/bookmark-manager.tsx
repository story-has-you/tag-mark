// components/bookmark-manager.tsx
import { BookmarkProvider } from "@/components/bookmark/bookmark-context";
import BookmarkList from "@/components/bookmark/bookmark-list";
import { BookmarkTree } from "@/components/bookmark/bookmark-tree";
import BookmarkService from "@/services/bookmark-service";
import type { BookmarkTreeNode } from "@/types/bookmark";
import React, { useEffect, useState } from "react";

const BookmarkManager: React.FC = () => {
  const [bookmarks, setBookmarks] = useState<BookmarkTreeNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      <div className="flex h-screen">
        <div className="w-1/3 border-r border-gray-200 dark:border-gray-700">
          <BookmarkTree bookmarks={bookmarks} />
        </div>
        <div className="flex-1 overflow-y-auto">
          <BookmarkList />
        </div>
      </div>
    </BookmarkProvider>
  );
};

BookmarkManager.displayName = "BookmarkManager";

export default BookmarkManager;
