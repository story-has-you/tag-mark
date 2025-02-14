// bookmark-manager.tsx
import { BookmarkProvider } from "@/components/bookmark/bookmark-context";
import BookmarkList from "@/components/bookmark/bookmark-list";
import { BookmarkTree } from "@/components/bookmark/bookmark-tree";
import Resizer from "@/components/resizer";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import BookmarkService from "@/services/bookmark-service";
import type { BookmarkTreeNode } from "@/types/bookmark";
import React, { useEffect, useState } from "react";

const MIN_SIDEBAR_WIDTH = 200;
const MAX_SIDEBAR_WIDTH = 600;

const BookmarkManager: React.FC = () => {
  const [bookmarks, setBookmarks] = useState<BookmarkTreeNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sidebarWidth, setSidebarWidth] = useState(300);

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
      <div className="flex items-center justify-center h-screen p-4">
        <div className="w-full max-w-md space-y-4">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="m-4">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <BookmarkProvider>
      <div className="flex h-screen select-none">
        <div
          className="border-r border-gray-200 dark:border-gray-700"
          style={{ width: sidebarWidth }}>
          <ScrollArea className="h-full">
            <BookmarkTree bookmarks={bookmarks} />
          </ScrollArea>
        </div>

        <Resizer onResize={handleResize} />

        <div className="flex-1">
          <ScrollArea className="h-full">
            <BookmarkList />
          </ScrollArea>
        </div>
      </div>
    </BookmarkProvider>
  );
};

BookmarkManager.displayName = "BookmarkManager";

export default BookmarkManager;