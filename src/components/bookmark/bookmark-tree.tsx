import { Button } from "@/components/ui/button";
import { useBookmark } from "@/hooks/bookmark/use-bookmark";
import { cn } from "@/lib/utils";
import type { BookmarkTreeNode } from "@/types/bookmark";
import { ChevronDown, ChevronRight, Folder } from "lucide-react";
import React, { useEffect, useState } from "react";

interface TreeNodeProps {
  node: BookmarkTreeNode;
  level: number;
}

const TreeNode: React.FC<TreeNodeProps> = ({ node, level }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { selectedNode, setSelectedNode } = useBookmark();
  const isSelected = selectedNode?.id === node.id;
  const isFolder = !node.url;
  const childFolders = node.children?.filter((child) => !child.url) || [];
  const hasChildFolders = childFolders.length > 0;

  // 新增：检查当前节点是否为选中节点的祖先
  useEffect(() => {
    if (selectedNode && isFolder && hasChildFolders) {
      // 检查是否为直接父节点
      const isDirectParent = selectedNode.parentId === node.id;

      // 或检查子树中是否包含选中节点（深层父节点）
      const containsSelectedNode = checkIfContainsNode(node, selectedNode.id);

      if (isDirectParent || containsSelectedNode) {
        setIsOpen(true);
      }
    }
  }, [selectedNode, node.id, isFolder, hasChildFolders]);

  // 辅助函数：检查节点树中是否包含特定ID的节点
  const checkIfContainsNode = (node: BookmarkTreeNode, targetId: string): boolean => {
    if (!node.children) return false;

    // 直接子节点中查找
    if (node.children.some((child) => child.id === targetId)) {
      return true;
    }

    // 递归检查所有子文件夹
    return node.children.some((child) => !child.url && child.children && checkIfContainsNode(child, targetId));
  };

  if (!isFolder) return null;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedNode(node);
    if (hasChildFolders) {
      setIsOpen(!isOpen);
    }
  };

  // 计算最大缩进值，防止过度缩进
  const maxIndentLevel = 7; // 设置最大缩进级别
  const effectiveLevel = Math.min(level, maxIndentLevel);
  // 深层级时添加视觉指示器
  const showDeepIndicator = level > maxIndentLevel;

  return (
    <div className="py-1">
      {" "}
      {/* 减少垂直间距 */}
      <Button
        variant={isSelected ? "secondary" : "ghost"}
        className={cn(
          "w-full justify-start gap-2 px-2 py-1 h-auto",
          isSelected && "bg-accent",
          showDeepIndicator && "border-l-2 border-primary/30" // 为深层级添加边框指示
        )}
        style={{ paddingLeft: `${effectiveLevel * 1}rem` }} // 减小缩进倍数并限制最大级别
        onClick={handleClick}>
        {hasChildFolders ? (
          isOpen ? (
            <ChevronDown className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
          ) : (
            <ChevronRight className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
          )
        ) : (
          <span className="w-4 flex-shrink-0" />
        )}
        <Folder className={cn("h-4 w-4 flex-shrink-0", isSelected ? "text-primary" : "text-muted-foreground")} />
        <span className="text-sm truncate">{node.title}</span>
      </Button>
      {isOpen && hasChildFolders && (
        <div
          className={cn(
            "border-l border-border",
            level < maxIndentLevel ? "ml-4" : "ml-2" // 深层级时减少左边距
          )}>
          {childFolders.map((child) => (
            <TreeNode key={child.id} node={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

const BookmarkTree: React.FC = () => {
  const { bookmarks } = useBookmark();

  return (
    <div className="py-2">
      {bookmarks.map((bookmark) => (
        <TreeNode key={bookmark.id} node={bookmark} level={0} />
      ))}
    </div>
  );
};

export { BookmarkTree, TreeNode };

