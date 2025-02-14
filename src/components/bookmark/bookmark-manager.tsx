import { BookmarkProvider } from "@/components/bookmark/bookmark-context";
import BookmarkList from "@/components/bookmark/bookmark-list";
import { BookmarkTree } from "@/components/bookmark/bookmark-tree";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup
} from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import BookmarkService from "@/services/bookmark-service";
import type { BookmarkTreeNode } from "@/types/bookmark";
import React, { useEffect, useState } from "react";

const MIN_SIDEBAR_WIDTH = 15; // percentage
const DEFAULT_SIDEBAR_WIDTH = 25; // percentage
const MAX_SIDEBAR_WIDTH = 40; // percentage

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
      <ResizablePanelGroup
        direction="horizontal"
        className="h-screen"
        onLayout={(sizes: number[]) => {
          document.cookie = `react-resizable-panels:layout=${JSON.stringify(
            sizes
          )}`;
        }}>
        <ResizablePanel
          defaultSize={DEFAULT_SIDEBAR_WIDTH}
          minSize={MIN_SIDEBAR_WIDTH}
          maxSize={MAX_SIDEBAR_WIDTH}
          className="border-r border-border">
          <ScrollArea className="h-full">
            <BookmarkTree bookmarks={bookmarks} />
          </ScrollArea>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel>
          <ScrollArea className="h-full">
            <BookmarkList />
          </ScrollArea>
        </ResizablePanel>
      </ResizablePanelGroup>
    </BookmarkProvider>
  );
};

BookmarkManager.displayName = "BookmarkManager";

export default BookmarkManager;
