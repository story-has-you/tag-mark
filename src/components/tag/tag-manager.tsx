import { TagProvider } from "@/components/tag/tag-context";
import TagList from "@/components/tag/tag-list";
import TagTree from "@/components/tag/tag-tree";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTagManagement } from "@/hooks/tag/use-tag-management";
import React from "react";

const MIN_SIDEBAR_WIDTH = 15;
const DEFAULT_SIDEBAR_WIDTH = 25;
const MAX_SIDEBAR_WIDTH = 40;

const TagManager: React.FC = () => {
  const { tags } = useTagManagement();
  return (
    <TagProvider>
      <ResizablePanelGroup
        direction="horizontal"
        className="h-screen"
        onLayout={(sizes: number[]) => {
          document.cookie = `react-resizable-panels:layout=${JSON.stringify(sizes)}`;
        }}>
        <ResizablePanel defaultSize={DEFAULT_SIDEBAR_WIDTH} minSize={MIN_SIDEBAR_WIDTH} maxSize={MAX_SIDEBAR_WIDTH} className="border-r border-border">
          <ScrollArea className="h-full">
            <TagTree tags={tags} />
          </ScrollArea>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel>
          <ScrollArea className="h-full">
            <TagList />
          </ScrollArea>
        </ResizablePanel>
      </ResizablePanelGroup>
    </TagProvider>
  );
};

TagManager.displayName = "TagManager";

export default TagManager;
