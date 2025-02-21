import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Tag } from "@/types/tag";
import { ChevronDown, ChevronRight, Tag as TagIcon } from "lucide-react";
import React, { useMemo } from "react";

import { useTagManagement } from "~hooks/tag/use-tag-management";

interface TreeNodeProps {
  tag: Tag;
  level: number;
  childTags: Tag[];
  onSelect: (tag: Tag) => void;
  tagMap: Map<string, Tag[]>;
}

const TreeNode: React.FC<TreeNodeProps> = React.memo(({ tag, level, childTags, onSelect, tagMap }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const { selectedTag } = useTagManagement();
  const isSelected = selectedTag?.id === tag.id;

  const hasChildTags = childTags.length > 0;

  // 分离展开/折叠处理
  const handleToggle = React.useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (hasChildTags) {
        setIsOpen((prev) => !prev);
      }
    },
    [hasChildTags]
  );

  // 分离选择处理
  const handleSelect = React.useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      onSelect(tag);
    },
    [tag, onSelect]
  );

  return (
    <div className="py-2">
      <div className="flex">
        {/* 展开/折叠按钮 */}
        {hasChildTags ? (
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-accent" onClick={handleToggle}>
            {isOpen ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
          </Button>
        ) : (
          <div className="w-8" /> // 占位
        )}

        {/* 标签按钮 */}
        <Button
          variant={isSelected ? "secondary" : "ghost"}
          className={cn("flex-1 justify-start gap-2 px-2 py-1.5 h-auto", isSelected && "bg-accent")}
          style={{ paddingLeft: `${level * 1}rem` }}
          onClick={handleSelect}>
          <TagIcon className={cn("h-4 w-4", isSelected ? "text-primary" : "text-muted-foreground")} />
          <span className="text-base truncate">#{tag.name}</span>
        </Button>
      </div>

      {/* 子节点 */}
      {isOpen && hasChildTags && (
        <div className="border-l border-border ml-8">
          {childTags.map((childTag) => (
            <TreeNode key={childTag.id} tag={childTag} level={level + 1} childTags={tagMap.get(childTag.id) || []} onSelect={onSelect} tagMap={tagMap} />
          ))}
        </div>
      )}
    </div>
  );
});

TreeNode.displayName = "TreeNode";

const TagTree: React.FC = () => {
  const { tags, setSelectedTag } = useTagManagement();

  const { rootTags, tagMap } = useMemo(() => {
    const map = new Map<string, Tag[]>();
    tags.forEach((tag) => {
      const parentId = tag.parentId || "root";
      if (!map.has(parentId)) {
        map.set(parentId, []);
      }
      map.get(parentId)!.push(tag);
    });

    map.forEach((group) => group.sort((a, b) => a.order - b.order));

    return {
      rootTags: map.get("root") || [],
      tagMap: map
    };
  }, [tags]);

  return (
    <div className="py-1">
      {rootTags.map((tag) => (
        <TreeNode key={tag.id} tag={tag} level={0} childTags={tagMap.get(tag.id) || []} onSelect={setSelectedTag} tagMap={tagMap} />
      ))}
    </div>
  );
};

TagTree.displayName = "TagTree";

export default TagTree;
