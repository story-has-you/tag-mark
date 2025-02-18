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
}

const TagDeleteDialog: React.FC<TagDeleteDialogProps> = ({ open, tag, onOpenChange, onConfirm }) => {
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
            <p>确定要删除标签 "{tag.name}" 吗？</p>
            {hasChildren && <p className="text-destructive">警告：该标签下有 {childTags.length} 个子标签，删除后子标签将变为顶级标签。</p>}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            删除
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

TagDeleteDialog.displayName = "TagDeleteDialog";

export default TagDeleteDialog;
