// bookmark-manager.tsx
import { BookmarkProvider } from "@/components/bookmark/bookmark-context";
import BookmarkList from "@/components/bookmark/bookmark-list";
import { BookmarkTree } from "@/components/bookmark/bookmark-tree";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import React from "react";

const MIN_SIDEBAR_WIDTH = 15; // percentage
const DEFAULT_SIDEBAR_WIDTH = 25; // percentage
const MAX_SIDEBAR_WIDTH = 40; // percentage

const BookmarkManager: React.FC = () => {
  return (
    <BookmarkProvider>
      <ResizablePanelGroup
        direction="horizontal"
        className="h-screen"
        onLayout={(sizes: number[]) => {
          document.cookie = `react-resizable-panels:layout=${JSON.stringify(sizes)}`;
        }}>
        <ResizablePanel defaultSize={DEFAULT_SIDEBAR_WIDTH} minSize={MIN_SIDEBAR_WIDTH} maxSize={MAX_SIDEBAR_WIDTH} className="border-r border-border">
          <ScrollArea className="h-full">
            <BookmarkTree />
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
