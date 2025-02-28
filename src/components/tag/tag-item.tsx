import { Card, CardContent } from "@/components/ui/card";
import { sanitizeInput } from "@/lib/security-utils";
import type { Tag } from "@/types/tag";
import { Hash } from "lucide-react"; // 导入 Hash 图标
import React from "react";

interface TagItemProps {
  tag: Tag;
  className?: string;
  onSelect: (tag: Tag) => void;
}

const TagItem: React.FC<TagItemProps> = ({ tag, onSelect }) => {
  // 提取父路径部分和当前标签名，以便于差异化显示
  const getPathParts = (fullPath?: string, name?: string) => {
    if (!fullPath || !name) return { parentPath: "", tagName: name || "" };

    // 将从路径中移除前导的 '#' 符号
    const path = fullPath.startsWith("#") ? fullPath.substring(1) : fullPath;

    // 查找最后一个 '/' 位置
    const lastSlashIndex = path.lastIndexOf("/");

    if (lastSlashIndex === -1) {
      // 没有父路径
      return { parentPath: "", tagName: path };
    }

    // 分离父路径和标签名
    return {
      parentPath: path.substring(0, lastSlashIndex),
      tagName: path.substring(lastSlashIndex + 1)
    };
  };

  const { parentPath, tagName } = getPathParts(tag.fullPath, tag.name);

  return (
    <Card className="hover:bg-accent transition-colors cursor-pointer hover:shadow-sm border-transparent hover:border-primary/20" onClick={() => onSelect(tag)}>
      <CardContent className="p-3">
        <div className="flex items-center gap-2">
          <Hash className="h-4 w-4 text-primary/70 flex-shrink-0" />
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-medium truncate">{sanitizeInput(tagName)}</span>
            {parentPath && <span className="text-xs text-muted-foreground truncate">在 {parentPath} 中</span>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

TagItem.displayName = "TagItem";

export default TagItem;
