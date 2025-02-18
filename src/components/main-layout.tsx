import BookmarkManager from "@/components/bookmark/bookmark-manager";
import TagManager from "@/components/tag/tag-manager";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Toaster } from "@/components/ui/toaster";
import { Bookmark, Tags } from "lucide-react";
import React from "react";

const MainLayout: React.FC = () => {
  return (
    <>
      <Toaster />
      <Tabs defaultValue="bookmarks" className="h-screen">
        <TabsList className="mx-4 mt-4">
          <TabsTrigger value="bookmarks" className="gap-2">
            <Bookmark className="h-4 w-4" />
            书签管理
          </TabsTrigger>
          <TabsTrigger value="tags" className="gap-2">
            <Tags className="h-4 w-4" />
            标签管理
          </TabsTrigger>
        </TabsList>

        <TabsContent value="bookmarks" className="h-[calc(100vh-76px)]">
          <BookmarkManager />
        </TabsContent>

        <TabsContent value="tags" className="h-[calc(100vh-76px)]">
          <TagManager />
        </TabsContent>
      </Tabs>
    </>
  );
};

MainLayout.displayName = "MainLayout";

export default MainLayout;
