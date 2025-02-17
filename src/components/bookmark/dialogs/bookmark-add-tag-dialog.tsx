import TagSuggestions from "@/components/tag/tag-suggestions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useBookmarkTagManagement } from "@/hooks/bookmark/use-bookmark-tag-management";
import { useTagSuggestions } from "@/hooks/tag/use-tag-suggestions";
import { cn } from "@/lib/utils";
import type { BookmarkTreeNode } from "@/types/bookmark";
import { Tag } from "lucide-react";
import React, { useEffect, useState } from "react";

interface BookmarkAddTagDialogProps {
  open: boolean;
  bookmark?: BookmarkTreeNode;
  onOpenChange: (open: boolean) => void;
}

const BookmarkAddTagDialog: React.FC<BookmarkAddTagDialogProps> = ({ open, bookmark, onOpenChange }) => {
  const { tags, loading, input, setInput, handleAddTag, handleDeleteTag, allTags } = useBookmarkTagManagement(bookmark);
  const suggestions = useTagSuggestions(allTags, input);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    if (!open) {
      setInput("");
      setShowSuggestions(false);
    }
  }, [open, setInput]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Tag className="h-5 w-5" />
            标签管理
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col space-y-6 py-4">
          {/* 书签信息 */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">书签信息</h3>
            <div className="rounded-lg border bg-card p-4">
              <h4 className="font-medium">{bookmark?.title}</h4>
              <p className="text-sm text-muted-foreground truncate">{bookmark?.url}</p>
            </div>
          </div>

          {/* 标签输入区域 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-muted-foreground">添加标签</h3>
              <span className="text-xs text-muted-foreground">已添加 {tags.length} 个标签</span>
            </div>
            <TagSuggestions
              value={input}
              suggestions={suggestions}
              onValueChange={setInput}
              onEnter={handleAddTag}
              disabled={loading}
              allTags={allTags}
              tags={tags}
            />
          </div>

          {/* 标签展示区域 */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">已添加标签</h3>
            <div className="min-h-[100px] rounded-lg border bg-card p-4">
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Badge
                    key={tag.id}
                    variant="secondary"
                    className={cn("flex items-center gap-1 px-3 py-1", "hover:bg-secondary/80 transition-colors")}>
                    {tag.fullPath}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 p-0 hover:bg-transparent"
                      onClick={() => handleDeleteTag(tag.id)}>
                      <span className="sr-only">删除标签</span>×
                    </Button>
                  </Badge>
                ))}
                {tags.length === 0 && !loading && (
                  <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
                    暂无标签，请在上方添加
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

BookmarkAddTagDialog.displayName = "BookmarkAddTagDialog";

export default BookmarkAddTagDialog;
