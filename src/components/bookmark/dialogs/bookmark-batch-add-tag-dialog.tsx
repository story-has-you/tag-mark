import { useTranslation } from "@/components/i18n-context";
import TagSuggestions from "@/components/tag/tag-suggestions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useBookmarkBatchTagManagement } from "@/hooks/bookmark/use-bookmark-batch-tag-management";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import type { BookmarkTreeNode } from "@/types/bookmark";
import { Tag as TagIcon } from "lucide-react";
import React from "react";

interface BookmarkBatchAddTagDialogProps {
  open: boolean;
  bookmarks: BookmarkTreeNode[];
  folderName: string;
  onOpenChange: (open: boolean) => void;
}

const BookmarkBatchAddTagDialog: React.FC<BookmarkBatchAddTagDialogProps> = ({ open, bookmarks, folderName, onOpenChange }) => {
  const { t, format } = useTranslation();
  const { toast } = useToast();

  const { loading, input, setInput, filteredTags, allTags, selectedTags, handleAddTag, handleDeleteTag, applyTagsToBookmarks } =
    useBookmarkBatchTagManagement(bookmarks);

  // 处理确认添加
  const handleConfirm = async () => {
    try {
      const successCount = await applyTagsToBookmarks();

      if (successCount > 0) {
        toast({
          title: t("toast_tag_added"),
          description: format("toast_tag_added_desc", successCount.toString())
        });
        onOpenChange(false);
      }
    } catch (error) {
      console.error("批量添加标签失败:", error);
      toast({
        variant: "destructive",
        title: t("toast_save_failed"),
        description: t("toast_save_failed")
      });
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

BookmarkBatchAddTagDialog.displayName = "BookmarkBatchAddTagDialog";

export default BookmarkBatchAddTagDialog;
