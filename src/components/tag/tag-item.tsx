import { Card, CardContent } from "@/components/ui/card";
import type { Tag } from "@/types/tag";
import React from "react";

interface TagItemProps {
  tag: Tag;
  className?: string;
  onSelect: (tag: Tag) => void;
}

const TagItem: React.FC<TagItemProps> = ({ tag, onSelect }) => {
  return (
    <Card className="hover:bg-accent transition-colors cursor-pointer" onClick={() => onSelect(tag)}>
      <CardContent className="p-3">
        <div className="flex items-center gap-3">
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-medium truncate">#{tag.name}</span>
            {tag.fullPath && <span className="text-xs text-muted-foreground truncate">{tag.fullPath}</span>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

TagItem.displayName = "TagItem";

export default TagItem;
