import { useTranslation } from "@/components/i18n-context";
import TagSuggestions from "@/components/tag/tag-suggestions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useBookmarkTagManagement } from "@/hooks/bookmark/use-bookmark-tag-management";
import { useTagSuggestions } from "@/hooks/tag/use-tag-suggestions";
import { cn } from "@/lib/utils";
import type { BookmarkTreeNode } from "@/types/bookmark";
import { Tag } from "lucide-react";
import React, { useEffect } from "react";

interface BookmarkAddTagDialogProps {
  open: boolean;
  bookmark?: BookmarkTreeNode;
  onOpenChange: (open: boolean) => void;
}

const BookmarkAddTagDialog: React.FC<BookmarkAddTagDialogProps> = ({ open, bookmark, onOpenChange }) => {
  const { t, format } = useTranslation();
  const { tags, loading, input, setInput, handleAddTag, handleDeleteTag, allTags } = useBookmarkTagManagement(bookmark);
  const suggestions = useTagSuggestions(allTags, input);

  useEffect(() => {
    if (!open) {
      setInput("");
    }
  }, [open, setInput]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Tag className="h-5 w-5" />
            {t("bookmark_add_tag_dialog_title")}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col space-y-6 py-4">
          {/* 书签信息 */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">{t("bookmark_add_tag_dialog_bookmark_info")}</h3>
            <div className="rounded-lg border bg-card p-4">
              <h4 className="font-medium">{bookmark?.title}</h4>
              <p className="text-sm text-muted-foreground truncate">{bookmark?.url}</p>
            </div>
          </div>

          {/* 标签输入区域 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-muted-foreground">{t("bookmark_add_tag_dialog_add_tags")}</h3>
              <span className="text-xs text-muted-foreground">{format("bookmark_add_tag_dialog_tag_count", tags.length.toString())}</span>
            </div>
            <TagSuggestions value={input} suggestions={suggestions} onValueChange={setInput} onEnter={handleAddTag} disabled={loading} allTags={allTags} tags={tags} />
          </div>

          {/* 标签展示区域 - 主要修改部分 */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">{t("bookmark_add_tag_dialog_added_tags")}</h3>
            <div className="min-h-[100px] max-h-[200px] rounded-lg border bg-card">
              <ScrollArea className="h-full max-h-[200px] p-4">
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Badge key={tag.id} variant="secondary" className={cn("flex items-center gap-1 px-3 py-1 max-w-full", "hover:bg-secondary/80 transition-colors")}>
                      <span className="truncate max-w-[180px]">{tag.fullPath}</span>
                      <Button variant="ghost" size="icon" className="h-4 w-4 p-0 hover:bg-transparent flex-shrink-0" onClick={() => handleDeleteTag(tag.id)}>
                        <span className="sr-only">{t("button_delete")}</span>×
                      </Button>
                    </Badge>
                  ))}
                  {tags.length === 0 && !loading && (
                    <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground p-4">{t("bookmark_add_tag_dialog_no_tags")}</div>
                  )}
                </div>
              </ScrollArea>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

BookmarkAddTagDialog.displayName = "BookmarkAddTagDialog";

export default BookmarkAddTagDialog;
