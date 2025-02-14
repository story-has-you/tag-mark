import { useBookmark } from "@/components/bookmark/bookmark-context";
import Favicon from "@/components/favicon";
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
      <div className="flex items-center justify-center h-full text-gray-500">
        请选择一个文件夹
      </div>
    );
  }

  const bookmarks = getAllBookmarks(selectedNode);

  return (
    <div className="p-4 space-y-2">
      <h2 className="text-lg font-semibold mb-4">{selectedNode.title}</h2>
      <div className="grid gap-2">
        {bookmarks.map((bookmark) => (
          <a
            key={bookmark.id}
            href={bookmark.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 
              dark:hover:bg-gray-800 transition-colors group">
            <div className="flex items-center justify-center w-6 h-6">
              <Favicon url={bookmark.url || ""} size={24} />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-medium truncate group-hover:text-blue-600">
                {bookmark.title}
              </span>
              <span className="text-xs text-gray-500 truncate">
                {bookmark.url}
              </span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

BookmarkList.displayName = "BookmarkList";

export default BookmarkList;
