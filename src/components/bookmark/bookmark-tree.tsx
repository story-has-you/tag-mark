import { useBookmarkContext } from "@/components/bookmark/bookmark-context";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { BookmarkTreeNode } from "@/types/bookmark";
import { ChevronDown, ChevronRight, Folder } from "lucide-react";
import React, { useState } from "react";

interface TreeNodeProps {
  node: BookmarkTreeNode;
  level: number;
}

const TreeNode: React.FC<TreeNodeProps> = ({ node, level }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { selectedNode, setSelectedNode } = useBookmarkContext();
  const isSelected = selectedNode?.id === node.id;
  const isFolder = !node.url;
  const childFolders = node.children?.filter((child) => !child.url) || [];
  const hasChildFolders = childFolders.length > 0;

  if (!isFolder) return null;

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
      <Button
        variant={isSelected ? "secondary" : "ghost"}
        className={cn(
          "w-full justify-start gap-2 px-2 py-1.5 h-auto",
          isSelected && "bg-accent"
        )}
        style={{ paddingLeft: `${level * 1.5}rem` }}
        onClick={handleClick}>
        {hasChildFolders ? (
          isOpen ? (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          )
        ) : (
          <span className="w-4" />
        )}
        <Folder
          className={cn(
            "h-4 w-4",
            isSelected ? "text-primary" : "text-muted-foreground"
          )}
        />
        <span className="text-sm truncate">{node.title}</span>
      </Button>
      {isOpen && hasChildFolders && (
        <div className="border-l border-border ml-4">
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
    <div className="py-2">
      {bookmarks.map((bookmark) => (
        <TreeNode key={bookmark.id} node={bookmark} level={0} />
      ))}
    </div>
  );
};

export { BookmarkTree, TreeNode };

