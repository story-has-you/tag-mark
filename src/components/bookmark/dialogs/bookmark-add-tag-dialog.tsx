import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useTagManagement } from "@/hooks/tag/use-tag-management";
import { cn } from "@/lib/utils";
import type { BookmarkTreeNode } from "@/types/bookmark";
import { Loader2 } from "lucide-react";
import React, { useEffect } from "react";

interface BookmarkAddTagDialogProps {
  open: boolean;
  bookmark?: BookmarkTreeNode;
  onOpenChange: (open: boolean) => void;
}

const BookmarkAddTagDialog: React.FC<BookmarkAddTagDialogProps> = ({ open, bookmark, onOpenChange }) => {
  const { tags, loading, input, setInput, handleAddTag, handleDeleteTag } = useTagManagement(bookmark);

  useEffect(() => {
    if (!open) {
      setInput("");
    }
  }, [open, setInput]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && input.trim()) {
      e.preventDefault();
      handleAddTag(input.trim());
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>标签管理</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col space-y-4">
          {/* 输入区域 */}
          <div className="relative">
            <Input
              placeholder="输入标签名称，回车添加..."
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
              }}
              onKeyDown={handleKeyDown}
              className="w-full"
              disabled={loading}
            />

            {/* 加载状态 */}
            {loading && (
              <div className="absolute right-3 top-2.5">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            )}
          </div>

          {/* 已选标签列表 */}
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Badge
                key={tag.id}
                variant="secondary"
                className={cn("flex items-center gap-1 px-2 py-1", "hover:bg-secondary/80 transition-colors")}>
                {tag.name}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 p-0 hover:bg-transparent"
                  onClick={() => handleDeleteTag(tag.id)}>
                  <span className="sr-only">删除标签</span>×
                </Button>
              </Badge>
            ))}
            {tags.length === 0 && !loading && <div className="text-sm text-muted-foreground">暂无标签</div>}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

BookmarkAddTagDialog.displayName = "BookmarkAddTagDialog";

export default BookmarkAddTagDialog;
