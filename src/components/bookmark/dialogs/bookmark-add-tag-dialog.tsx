// components/bookmark/dialogs/bookmark-add-tag-dialog.tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import TagBookmarkRelationService from "@/services/tag-bookmark-relation-service";
import TagService from "@/services/tag-service";
import type { BookmarkTreeNode } from "@/types/bookmark";
import type { Tag } from "@/types/tag";
import React, { useEffect, useMemo, useState } from "react";

interface BookmarkAddTagDialogProps {
  open: boolean;
  bookmark?: BookmarkTreeNode;
  onOpenChange: (open: boolean) => void;
}

const BookmarkAddTagDialog: React.FC<BookmarkAddTagDialogProps> = ({ open, bookmark, onOpenChange }) => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const { toast } = useToast();

  // 过滤标签
  const filteredTags = useMemo(() => {
    if (!inputValue.trim()) return [];
    const search = inputValue.toLowerCase().trim();
    return tags.filter((tag) => tag.name.toLowerCase().includes(search) && !selectedTags.includes(tag.id));
  }, [tags, inputValue, selectedTags]);

  useEffect(() => {
    const fetchData = async () => {
      if (!bookmark) return;

      try {
        setLoading(true);
        const [allTags, bookmarkTags] = await Promise.all([
          TagService.getInstance().getAllTags(),
          TagBookmarkRelationService.getInstance().getTagsByBookmarkId(bookmark.id)
        ]);

        setTags(allTags);
        setSelectedTags(bookmarkTags.map((tag) => tag.id));
      } finally {
        setLoading(false);
      }
    };

    if (open) {
      fetchData();
      setInputValue("");
      setShowDropdown(false);
    }
  }, [open, bookmark]);

  const handleSelect = async (tagName: string) => {
    if (!bookmark || !tagName.trim()) return;

    try {
      setLoading(true);
      let targetTag = tags.find((tag) => tag.name === tagName);

      if (!targetTag) {
        targetTag = await TagService.getInstance().createTag({
          name: tagName.trim()
        });
        setTags((prev) => [...prev, targetTag!]);
      }

      if (!selectedTags.includes(targetTag.id)) {
        await TagBookmarkRelationService.getInstance().createRelation(targetTag.id, bookmark.id);
        setSelectedTags((prev) => [...prev, targetTag!.id]);
        toast({
          title: "已添加标签",
          description: `标签 "${tagName}" 已添加`
        });
      }

      setInputValue("");
      setShowDropdown(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "操作失败",
        description: "处理标签时发生错误"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveTag = async (tagId: string) => {
    if (!bookmark) return;

    try {
      setLoading(true);
      await TagBookmarkRelationService.getInstance().deleteRelation(tagId, bookmark.id);
      setSelectedTags((prev) => prev.filter((id) => id !== tagId));
      toast({
        title: "已移除标签",
        description: "标签已移除"
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "操作失败",
        description: "移除标签时发生错误"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>添加标签</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col space-y-4">
          <div className="relative">
            <Input
              placeholder="输入标签名称，回车添加..."
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                setShowDropdown(true);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && inputValue.trim()) {
                  e.preventDefault();
                  handleSelect(inputValue.trim());
                }
              }}
              onFocus={() => setShowDropdown(true)}
            />
            {showDropdown && filteredTags.length > 0 && (
              <div className="absolute w-full mt-1 bg-popover border rounded-md shadow-md z-50">
                <div className="p-1">
                  {filteredTags.map((tag) => (
                    <div
                      key={tag.id}
                      className="px-2 py-1.5 text-sm cursor-pointer hover:bg-accent rounded-sm"
                      onClick={() => handleSelect(tag.name)}>
                      {tag.name}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 已选标签展示 */}
          <div className="flex flex-wrap gap-2">
            {selectedTags.map((tagId) => {
              const tag = tags.find((t) => t.id === tagId);
              if (!tag) return null;
              return (
                <div key={tag.id} className="flex items-center gap-1 px-2 py-1 text-sm bg-secondary rounded-md">
                  {tag.name}
                  <button
                    onClick={() => handleRemoveTag(tag.id)}
                    className="text-muted-foreground hover:text-foreground">
                    ×
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

BookmarkAddTagDialog.displayName = "BookmarkAddTagDialog";

export default BookmarkAddTagDialog;
