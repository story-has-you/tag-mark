import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Tag } from "@/types/tag";
import { ChevronDown, ChevronRight, Tag as TagIcon } from "lucide-react";
import React, { useMemo } from "react";

import { useTagContext } from "./tag-context";

interface TreeNodeProps {
  tag: Tag;
  level: number;
  childTags: Tag[];
  onSelect: (tag: Tag) => void;
}

// 使用 React.memo 优化子组件
const TreeNode: React.FC<TreeNodeProps> = React.memo(({ tag, level, childTags, onSelect }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const { selectedTag } = useTagContext();
  const isSelected = selectedTag?.id === tag.id;

  const hasChildTags = childTags.length > 0;

  const handleClick = React.useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      onSelect(tag);
      if (hasChildTags) {
        setIsOpen(!isOpen);
      }
    },
    [tag, hasChildTags, onSelect]
  );

  return (
    <div className="py-2">
      <Button
        variant={isSelected ? "secondary" : "ghost"}
        className={cn("w-full justify-start gap-2 px-2 py-1.5 h-auto", isSelected && "bg-accent")}
        style={{ paddingLeft: `${level * 1}rem` }}
        onClick={handleClick}>
        {hasChildTags ? isOpen ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" /> : <span className="w-4" />}
        <TagIcon className={cn("h-4 w-4", isSelected ? "text-primary" : "text-muted-foreground")} />
        <span className="text-base truncate">#{tag.name}</span>
      </Button>
      {isOpen && hasChildTags && (
        <div className="border-l border-border ml-4">
          {childTags.map((childTag) => (
            <TreeNode
              key={childTag.id}
              tag={childTag}
              level={level + 1}
              childTags={[]} // 递归传递子标签
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
});

TreeNode.displayName = "TreeNode";

const TagTree: React.FC = () => {
  const { tags, setSelectedTag } = useTagContext();

  // 使用 useMemo 优化标签过滤和排序
  const { rootTags, tagMap } = useMemo(() => {
    const map = new Map<string, Tag[]>();
    tags.forEach((tag) => {
      const parentId = tag.parentId || "root";
      if (!map.has(parentId)) {
        map.set(parentId, []);
      }
      map.get(parentId)!.push(tag);
    });

    // 对每个分组进行排序
    map.forEach((group) => group.sort((a, b) => a.order - b.order));

    return {
      rootTags: map.get("root") || [],
      tagMap: map
    };
  }, [tags]);

  return (
    <div className="py-1">
      {rootTags.map((tag) => (
        <TreeNode key={tag.id} tag={tag} level={0} childTags={tagMap.get(tag.id) || []} onSelect={setSelectedTag} />
      ))}
    </div>
  );
};

TagTree.displayName = "TagTree";

export default TagTree;
