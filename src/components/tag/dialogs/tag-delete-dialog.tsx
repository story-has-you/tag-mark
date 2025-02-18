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
  const { getChildTags } = useTagManagement();

  if (!tag) return null;

  const childTags = getChildTags(tag.id);
  const hasChildren = childTags.length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>删除标签</DialogTitle>
          <DialogDescription className="space-y-2">
            <p>您要如何删除标签 "{tag.name}"？</p>
            {hasChildren && <p className="text-destructive">警告：该标签下有 {childTags.length} 个子标签，删除后子标签将变为顶级标签。</p>}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col gap-2 sm:flex-row">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            仅删除标签
          </Button>
          <Button variant="destructive" onClick={onConfirmWithBookmarks}>
            删除标签和关联书签
          </Button>
        </DialogFooter>
        <DialogDescription></DialogDescription>
      </DialogContent>
    </Dialog>
  );
};

TagDeleteDialog.displayName = "TagDeleteDialog";

export default TagDeleteDialog;
