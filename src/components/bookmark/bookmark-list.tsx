// bookmark-list.tsx
import { useBookmark } from "@/components/bookmark/bookmark-context";
import Favicon from "@/components/favicon";
import { Card, CardContent } from "@/components/ui/card";
import type { BookmarkTreeNode } from "@/types/bookmark";
import React from "react";

const BookmarkList: React.FC = () => {
  const { selectedNode } = useBookmark();

  const getAllBookmarks = (node: BookmarkTreeNode): BookmarkTreeNode[] => {
    let bookmarks: BookmarkTreeNode[] = [];

    const traverse = (n: BookmarkTreeNode) => {
      if (n.url) {
        bookmarks.push(n);
      }
      n.children?.forEach(traverse);
    };

    traverse(node);
    return bookmarks;
  };

  if (!selectedNode) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        请选择一个文件夹
      </div>
    );
  }

  const bookmarks = getAllBookmarks(selectedNode);

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-lg font-semibold">{selectedNode.title}</h2>
      <div className="grid gap-2">
        {bookmarks.map((bookmark) => (
          <Card key={bookmark.id} className="overflow-hidden">
            <CardContent className="p-0">
              <a
                href={bookmark.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 hover:bg-accent transition-colors">
                <div className="flex items-center justify-center">
                  <Favicon url={bookmark.url || ""} className="w-8 h-8" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-medium truncate hover:text-primary">
                    {bookmark.title}
                  </span>
                  <span className="text-xs text-muted-foreground truncate">
                    {bookmark.url}
                  </span>
                </div>
              </a>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

BookmarkList.displayName = "BookmarkList";

export default BookmarkList;