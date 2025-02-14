// bookmark-manager.tsx
import { BookmarkProvider } from "@/components/bookmark/bookmark-context";
import BookmarkList from "@/components/bookmark/bookmark-list";
import { BookmarkTree } from "@/components/bookmark/bookmark-tree";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useBookmark } from "@/hooks/bookmark/use-bookmark";
import React from "react";

const MIN_SIDEBAR_WIDTH = 15; // percentage
const DEFAULT_SIDEBAR_WIDTH = 25; // percentage
const MAX_SIDEBAR_WIDTH = 40; // percentage

const BookmarkManager: React.FC = () => {
  const { bookmarks } = useBookmark();

  // 数据为空时显示错误状态
  if (!bookmarks?.length) {
    return (
      <Alert variant="destructive" className="m-4">
        <AlertDescription>加载书签失败</AlertDescription>
      </Alert>
    );
  }

  return (
    <BookmarkProvider>
      <ResizablePanelGroup
        direction="horizontal"
        className="h-screen"
        onLayout={(sizes: number[]) => {
          document.cookie = `react-resizable-panels:layout=${JSON.stringify(sizes)}`;
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
