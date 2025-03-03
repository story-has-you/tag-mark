import { Button } from "@/components/ui/button";
import { useTagManagement } from "@/hooks/tag/use-tag-management";
import { cn } from "@/lib/utils";
import type { Tag } from "@/types/tag";
import { ChevronDown, ChevronRight, Tag as TagIcon } from "lucide-react";
import React, { useMemo } from "react";

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

  // 计算最大缩进值，防止过度缩进
  const maxIndentLevel = 7;
  const effectiveLevel = Math.min(level, maxIndentLevel);
  const showDeepIndicator = level > maxIndentLevel;

  // 添加自动展开功能
  React.useEffect(() => {
    if (selectedTag && hasChildTags) {
      // 检查是否为直接父节点
      if (selectedTag.parentId === tag.id) {
        setIsOpen(true);
        return;
      }

      // 检查是否为间接父节点（祖先节点）
      const isAncestor = checkIfAncestor(tag.id, selectedTag.id, tagMap);
      if (isAncestor) {
        setIsOpen(true);
      }
    }
  }, [selectedTag, tag.id, hasChildTags, tagMap]);

  // 辅助函数：检查 potentialAncestorId 是否为 tagId 的祖先
  const checkIfAncestor = (potentialAncestorId: string, tagId: string, tagMap: Map<string, Tag[]>): boolean => {
    // 获取当前标签的直接子标签
    const children = tagMap.get(potentialAncestorId) || [];

    // 检查直接子标签中是否包含目标标签
    if (children.some((child) => child.id === tagId)) {
      return true;
    }

    // 递归检查所有子标签
    return children.some((child) => checkIfAncestor(child.id, tagId, tagMap));
  };
  
  const handleToggle = React.useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (hasChildTags) {
        setIsOpen((prev) => !prev);
      }
    },
    [hasChildTags]
  );

  const handleSelect = React.useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      onSelect(tag);
    },
    [tag, onSelect]
  );

  return (
    <div className="py-1">
      {" "}
      {/* 减少垂直间距 */}
      <div className="flex">
        {/* 展开/折叠按钮 */}
        {hasChildTags ? (
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0 flex-shrink-0 hover:bg-accent" onClick={handleToggle}>
            {isOpen ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
          </Button>
        ) : (
          <div className="w-6 flex-shrink-0" /> // 减小占位宽度
        )}

        {/* 标签按钮 */}
        <Button
          variant={isSelected ? "secondary" : "ghost"}
          className={cn(
            "flex-1 justify-start gap-1 px-1 py-1 h-auto text-sm",
            isSelected && "bg-accent",
            showDeepIndicator && "border-l-2 border-primary/30" // 为深层级添加边框指示
          )}
          style={{ paddingLeft: `${effectiveLevel * 0.75}rem` }} // 减小缩进倍数
          onClick={handleSelect}>
          <TagIcon className={cn("h-3.5 w-3.5 flex-shrink-0", isSelected ? "text-primary" : "text-muted-foreground")} />
          <span className="truncate">#{tag.name}</span>
        </Button>
      </div>
      {/* 子节点 */}
      {isOpen && hasChildTags && (
        <div
          className={cn(
            "border-l border-border",
            level < maxIndentLevel ? "ml-5" : "ml-2" // 深层级时减少左边距
          )}>
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
