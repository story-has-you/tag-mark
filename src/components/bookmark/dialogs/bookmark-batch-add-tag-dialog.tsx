// src/components/bookmark/dialogs/bookmark-batch-add-tag-dialog.tsx
import { useTranslation } from "@/components/i18n-context";
import TagSuggestions from "@/components/tag/tag-suggestions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useBookmarkTagManagement } from "@/hooks/bookmark/use-bookmark-tag-management";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import type { BookmarkTreeNode } from "@/types/bookmark";
import type { Tag } from "@/types/tag";
import { Tag as TagIcon } from "lucide-react";
import React, { useEffect, useState } from "react";

interface BookmarkBatchAddTagDialogProps {
  open: boolean;
  bookmarks: BookmarkTreeNode[];
  folderName: string;
  onOpenChange: (open: boolean) => void;
}

const BookmarkBatchAddTagDialog: React.FC<BookmarkBatchAddTagDialogProps> = ({ open, bookmarks, folderName, onOpenChange }) => {
  const { t, format } = useTranslation();
  const { toast } = useToast();
  // 我们使用第一个书签作为参考，仅用于获取标签数据
  // 这里主要是为了复用 useBookmarkTagManagement 的逻辑
  const referenceBookmark = bookmarks.length > 0 ? bookmarks[0] : undefined;

  // 使用现有的 hook 来管理标签
  const { allTags, loading: hookLoading, input, setInput, filteredTags, handleAddTag: addTagToSingleBookmark } = useBookmarkTagManagement(referenceBookmark);

  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [processing, setProcessing] = useState(false);
  const loading = hookLoading || processing;

  // 重置状态
  useEffect(() => {
    if (open) {
      setSelectedTags([]);
      setInput("");
    }
  }, [open, setInput]);

  // 添加标签到选择列表
  const handleAddTag = async (tagPath: string) => {
    if (!tagPath || !tagPath.trim()) return;

    try {
      // 查找标签是否已存在于选择列表中
      const normalizedPath = tagPath.replace(/^#/, "").trim();
      const existingTag = selectedTags.find(
        (tag) => tag.name.toLowerCase() === normalizedPath.toLowerCase() || (tag.fullPath && tag.fullPath.toLowerCase() === `#${normalizedPath}`.toLowerCase())
      );

      if (existingTag) {
        toast({
          title: t("toast_tag_added"),
          description: format("toast_tag_added_desc", existingTag.name)
        });
        return;
      }

      // 创建或查找标签并添加到选择列表，但不添加到书签
      // 我们先创建一个虚拟的选择列表
      const dummyBookmark = { id: "temp-selection" } as BookmarkTreeNode;
      // 使用与 useBookmarkTagManagement 相同的逻辑添加标签
      await addTagToSingleBookmark(tagPath);

      // 查找新标签
      const newTag = allTags.find(
        (tag) => tag.name.toLowerCase() === normalizedPath.toLowerCase() || (tag.fullPath && tag.fullPath.toLowerCase() === `#${normalizedPath}`.toLowerCase())
      );

      if (newTag && !selectedTags.some((tag) => tag.id === newTag.id)) {
        setSelectedTags((prev) => [...prev, newTag]);
      }

      setInput("");
    } catch (error) {
      console.error("添加标签失败:", error);
      toast({
        variant: "destructive",
        title: t("toast_add_failed"),
        description: t("toast_save_failed")
      });
    }
  };

  // 从选择列表中删除标签
  const handleDeleteTag = (tagId: string) => {
    setSelectedTags((prev) => prev.filter((tag) => tag.id !== tagId));
  };

  // 批量应用标签到所有书签
  const handleConfirm = async () => {
    if (selectedTags.length === 0 || bookmarks.length === 0) return;

    setProcessing(true);
    try {
      let successCount = 0;

      // 对每个书签循环处理
      for (const bookmark of bookmarks) {
        // 对每个选中的标签都添加到当前书签
        for (const tag of selectedTags) {
          try {
            // 使用标签的全路径或名称
            const tagPath = tag.fullPath || `#${tag.name}`;
            // 复用现有 hook 的方法添加标签到每个书签
            await addTagToSingleBookmark(tagPath);
            successCount++;
          } catch (error) {
            console.error(`给书签 ${bookmark.id} 添加标签 ${tag.id} 失败:`, error);
            // 继续处理其他标签
          }
        }
      }

      toast({
        title: t("toast_tag_added"),
        description: format("toast_tag_added_desc", successCount.toString())
      });

      onOpenChange(false);
    } catch (error) {
      console.error("批量添加标签失败:", error);
      toast({
        variant: "destructive",
        title: t("toast_save_failed"),
        description: t("toast_save_failed")
      });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TagIcon className="h-5 w-5" />
            {t("bookmark_batch_tag_dialog_title")}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">{format("bookmark_batch_tag_dialog_bookmarks_count", bookmarks.length.toString())}</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* 文件夹信息 */}
          <div className="grid gap-2">
            <h3 className="text-sm font-medium">{t("bookmark_batch_tag_dialog_folder_info")}</h3>
            <div className="rounded-lg border bg-card p-3">
              <h4 className="font-medium">{folderName}</h4>
            </div>
          </div>

          {/* 标签输入区域 */}
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">{t("bookmark_add_tag_dialog_add_tags")}</h3>
              <span className="text-xs text-muted-foreground">{format("bookmark_batch_tag_dialog_tags_selected", selectedTags.length.toString())}</span>
            </div>
            <TagSuggestions value={input} suggestions={filteredTags} onValueChange={setInput} onEnter={handleAddTag} disabled={loading} allTags={allTags} tags={selectedTags} />
          </div>

          {/* 已选标签展示区域 */}
          <div className="grid gap-2">
            <h3 className="text-sm font-medium">{t("bookmark_batch_tag_dialog_selected_tags")}</h3>
            <div className="min-h-[120px] rounded-lg border bg-card p-4">
              <div className="flex flex-wrap gap-2">
                {selectedTags.map((tag) => (
                  <Badge key={tag.id} variant="secondary" className={cn("flex items-center gap-1 px-3 py-1", "hover:bg-secondary/80 transition-colors")}>
                    {tag.fullPath || `#${tag.name}`}
                    <Button variant="ghost" size="icon" className="h-4 w-4 p-0 hover:bg-transparent" onClick={() => handleDeleteTag(tag.id)} disabled={loading}>
                      <span className="sr-only">{t("button_delete")}</span>×
                    </Button>
                  </Badge>
                ))}
                {selectedTags.length === 0 && !loading && (
                  <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">{t("bookmark_add_tag_dialog_no_tags")}</div>
                )}
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            {t("button_cancel")}
          </Button>
          <Button onClick={handleConfirm} disabled={loading || selectedTags.length === 0}>
            {loading ? t("bookmark_batch_tag_dialog_processing") : t("bookmark_batch_tag_dialog_apply")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BookmarkBatchAddTagDialog;
