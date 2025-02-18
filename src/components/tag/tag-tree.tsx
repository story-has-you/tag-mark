import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Tag } from "@/types/tag";
import { ChevronDown, ChevronRight, Tag as TagIcon } from "lucide-react";
import React, { useState } from "react";

import { useTagContext } from "./tag-context";

interface TreeNodeProps {
  tag: Tag;
  level: number;
  allTags: Tag[]; // 修改为传入所有标签
}

const TreeNode: React.FC<TreeNodeProps> = ({ tag, level, allTags }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { selectedTag, setSelectedTag } = useTagContext();
  const isSelected = selectedTag?.id === tag.id;

  // 获取当前标签的子标签并排序
  const childTags = allTags.filter((t) => t.parentId === tag.id).sort((a, b) => a.order - b.order);

  const hasChildTags = childTags.length > 0;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedTag(tag);
    if (hasChildTags) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div className="py-2">
      <Button
        variant={isSelected ? "secondary" : "ghost"}
        className={cn("w-full justify-start gap-2 px-2 py-1.5 h-auto", isSelected && "bg-accent")}
        style={{ paddingLeft: `${level * 1}rem` }}
        onClick={handleClick}>
        {hasChildTags ? isOpen ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" /> : <span className="w-4" />}
        <TagIcon className={cn("h-4 w-4", isSelected ? "text-primary" : "text-muted-foreground")} />
        <span className="text-base truncate">{tag.name}</span>
      </Button>
      {isOpen && hasChildTags && (
        <div className="border-l border-border ml-4">
          {childTags.map((childTag) => (
            <TreeNode
              key={childTag.id}
              tag={childTag}
              level={level + 1}
              allTags={allTags} // 传递所有标签
            />
          ))}
        </div>
      )}
    </div>
  );
};

interface TagTreeProps {
  tags?: Tag[];
}

const TagTree: React.FC<TagTreeProps> = ({ tags = [] }) => {
  // 获取根标签并排序
  const rootTags = tags.filter((tag) => !tag.parentId).sort((a, b) => a.order - b.order);

  return (
    <div className="py-1">
      {rootTags.map((tag) => (
        <TreeNode
          key={tag.id}
          tag={tag}
          level={0}
          allTags={tags} // 传递所有标签
        />
      ))}
    </div>
  );
};

TagTree.displayName = "TagTree";

export default TagTree;
