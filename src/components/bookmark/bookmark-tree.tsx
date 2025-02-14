// components/bookmark-tree.tsx
import { useBookmark } from "@/components/bookmark/bookmark-context";
import type { BookmarkTreeNode } from "@/types/bookmark";
import { ChevronDown, ChevronRight, Folder } from "lucide-react";
import React, { useState } from "react";

interface TreeNodeProps {
  node: BookmarkTreeNode;
  level: number;
}

const TreeNode: React.FC<TreeNodeProps> = ({ node, level }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { selectedNode, setSelectedNode } = useBookmark();
  const isSelected = selectedNode?.id === node.id;

  // 判断是否为文件夹
  const isFolder = !node.url;

  // 获取子文件夹数量
  const childFolders = node.children?.filter((child) => !child.url) || [];
  const hasChildFolders = childFolders.length > 0;

  // 如果不是文件夹，不渲染
  if (!isFolder) {
    return null;
  }

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setSelectedNode(node);
    if (hasChildFolders) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div className="py-0.5">
      <div
        className={`flex items-center gap-2 px-2 py-1.5 rounded-lg cursor-pointer
          ${isSelected ? "bg-blue-100 dark:bg-blue-900" : "hover:bg-gray-100 dark:hover:bg-gray-800"}
          transition-colors`}
        style={{ paddingLeft: `${level * 1.5}rem` }}
        onClick={handleClick}>
        {/* 只在有子文件夹时显示箭头 */}
        {hasChildFolders && (
          <span className="text-gray-500 w-4">
            {isOpen ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </span>
        )}
        {/* 如果没有子文件夹，添加占位以保持对齐 */}
        {!hasChildFolders && <span className="w-4" />}
        <Folder
          className={`h-4 w-4 ${isSelected ? "text-blue-600" : "text-gray-500"}`}
        />
        <span className="text-sm truncate">{node.title}</span>
      </div>
      {isOpen && hasChildFolders && (
        <div className="border-l border-gray-200 dark:border-gray-700 ml-4">
          {childFolders.map((child) => (
            <TreeNode key={child.id} node={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

const BookmarkTree: React.FC<{ bookmarks: BookmarkTreeNode[] }> = ({
  bookmarks
}) => {
  return (
    <div className="h-full overflow-y-auto">
      {bookmarks.map((bookmark) => (
        <TreeNode key={bookmark.id} node={bookmark} level={0} />
      ))}
    </div>
  );
};

export { BookmarkTree, TreeNode };

