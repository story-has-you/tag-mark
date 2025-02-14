import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useTagManagement } from "@/hooks/tag/use-tag-management";
import type { BookmarkTreeNode } from "@/types/bookmark";
import React, { useEffect, useState } from "react";

interface BookmarkAddTagDialogProps {
  open: boolean;
  bookmark?: BookmarkTreeNode;
  onOpenChange: (open: boolean) => void;
}

const BookmarkAddTagDialog: React.FC<BookmarkAddTagDialogProps> = ({ open, bookmark, onOpenChange }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const { tags, selectedTags, input, setInput, filteredTags, loadTags, handleTagOperation, reset } =
    useTagManagement(bookmark);

  useEffect(() => {
    if (open) {
      loadTags();
      setShowDropdown(false);
    }
    return () => reset();
  }, [open, loadTags, reset]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>添加标签</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col space-y-4">
          {/* 输入区域 */}
          <div className="relative">
            <Input
              placeholder="输入标签名称，回车添加..."
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                setShowDropdown(true);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && input.trim()) {
                  e.preventDefault();
                  handleTagOperation(input.trim());
                }
              }}
              onFocus={() => setShowDropdown(true)}
            />
            {/* 下拉选项 */}
            {showDropdown && filteredTags.length > 0 && (
              <div className="absolute w-full mt-1 bg-popover border rounded-md shadow-md z-50">
                <div className="p-1">
                  {filteredTags.map((tag) => (
                    <div
                      key={tag.id}
                      className="px-2 py-1.5 text-sm cursor-pointer hover:bg-accent rounded-sm"
                      onClick={() => handleTagOperation(tag.name)}>
                      {tag.name}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 已选标签 */}
          <div className="flex flex-wrap gap-2">
            {selectedTags.map((tagId) => {
              const tag = tags.find((t) => t.id === tagId);
              if (!tag) return null;
              return (
                <div key={tag.id} className="flex items-center gap-1 px-2 py-1 text-sm bg-secondary rounded-md">
                  {tag.name}
                  <button
                    onClick={() => handleTagOperation(tag.name, true)}
                    className="text-muted-foreground hover:text-foreground">
                    ×
                  </button>
                </div>
              );
            })}
          </div>
        </div>
        <DialogDescription></DialogDescription>
      </DialogContent>
    </Dialog>
  );
};

BookmarkAddTagDialog.displayName = "BookmarkAddTagDialog";

export default BookmarkAddTagDialog;
