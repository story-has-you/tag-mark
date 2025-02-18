import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Tag } from "@/types/tag";
import { Tag as TagIcon } from "lucide-react";
import React from "react";

interface TagItemProps {
  tag: Tag;
  className?: string;
}

const TagItem: React.FC<TagItemProps> = ({ tag, className }) => {
  return (
    <Card className={cn("hover:bg-accent transition-colors", className)}>
      <CardContent className="p-3">
        <div className="flex items-center gap-3">
          <TagIcon className="h-4 w-4 text-muted-foreground" />
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-medium truncate">{tag.name}</span>
            {tag.fullPath && <span className="text-xs text-muted-foreground truncate">{tag.fullPath}</span>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

TagItem.displayName = "TagItem";

export default TagItem;
