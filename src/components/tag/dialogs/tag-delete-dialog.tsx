import { useTranslation } from "@/components/i18n-context";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useTagManagement } from "@/hooks/tag/use-tag-management";
import type { Tag } from "@/types/tag";
import React from "react";

interface TagDeleteDialogProps {
  open: boolean;
  tag: Tag | null;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  onConfirmWithBookmarks: () => void;
}

const TagDeleteDialog: React.FC<TagDeleteDialogProps> = ({ open, tag, onOpenChange, onConfirm, onConfirmWithBookmarks }) => {
  const { t, format } = useTranslation();
  const { getChildTags } = useTagManagement();

  if (!tag) return null;

  const childTags = getChildTags(tag.id);
  const hasChildren = childTags.length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-2xl">
        <DialogHeader>
          <DialogTitle>{t("tag_delete_dialog_title")}</DialogTitle>
          <DialogDescription className="space-y-2">
            <p>{format("tag_delete_dialog_confirm_message", tag.name)}</p>
            {hasChildren && <p className="text-destructive">{format("tag_delete_dialog_warning", childTags.length.toString())}</p>}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col gap-2 sm:flex-row">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("button_cancel")}
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            {t("tag_delete_dialog_delete_tag_only")}
          </Button>
          <Button variant="destructive" onClick={onConfirmWithBookmarks}>
            {t("tag_delete_dialog_delete_with_bookmarks")}
          </Button>
        </DialogFooter>
        <DialogDescription></DialogDescription>
      </DialogContent>
    </Dialog>
  );
};

TagDeleteDialog.displayName = "TagDeleteDialog";

export default TagDeleteDialog;
