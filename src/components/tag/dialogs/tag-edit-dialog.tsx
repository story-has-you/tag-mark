import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTagManagement } from "@/hooks/tag/use-tag-management";
import type { Tag } from "@/types/tag";
import React, { useEffect } from "react";

interface TagEditDialogProps {
  open: boolean;
  tag: Tag | null;
  onOpenChange: (open: boolean) => void;
  onConfirm: (name: string, parentId?: string) => void;
}

const TagEditDialog: React.FC<TagEditDialogProps> = ({ open, tag, onOpenChange, onConfirm }) => {
  const [name, setName] = React.useState("");
  const [parentId, setParentId] = React.useState<string | undefined>();
  const [error, setError] = React.useState<string | null>(null);
  const { tags } = useTagManagement();

  // 获取可选的父标签列表（排除自身及其子标签）
  const getAvailableParentTags = () => {
    if (!tag) return tags;

    const getChildTagIds = (tagId: string): string[] => {
      const childTags = tags.filter((t) => t.parentId === tagId);
      return [tagId, ...childTags.flatMap((child) => getChildTagIds(child.id))];
    };

    const excludeIds = getChildTagIds(tag.id);
    return tags.filter((t) => !excludeIds.includes(t.id));
  };

  useEffect(() => {
    if (open && tag) {
      setName(tag.name);
      setParentId(tag.parentId);
    } else if (open) {
      setName("");
      setParentId(undefined);
    }
    setError(null);
  }, [open, tag]);

  const handleConfirm = () => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      setError("标签名称不能为空");
      return;
    }

    // 检查同级标签名称是否重复
    const siblingTags = tags.filter((t) => t.parentId === parentId);
    const isNameDuplicated = siblingTags.some((t) => t.name.toLowerCase() === trimmedName.toLowerCase() && t.id !== tag?.id);

    if (isNameDuplicated) {
      setError("同级标签名称不能重复");
      return;
    }

    onConfirm(trimmedName, parentId);
  };

  const availableParentTags = getAvailableParentTags();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{tag ? "编辑标签" : "新建标签"}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">标签名称</label>
            <Input
              placeholder="请输入标签名称"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError(null);
              }}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">父标签</label>
            <Select
              value={parentId || "none"}
              onValueChange={(value) => {
                setParentId(value === "none" ? undefined : value);
                setError(null);
              }}>
              <SelectTrigger>
                <SelectValue placeholder="选择父标签" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">无</SelectItem>
                {availableParentTags.map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.fullPath || t.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button onClick={handleConfirm} disabled={!name.trim()}>
            确认
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

TagEditDialog.displayName = "TagEditDialog";

export default TagEditDialog;
