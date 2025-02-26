import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTagManagement } from "@/hooks/tag/use-tag-management";
import type { Tag } from "@/types/tag";
import React, { useCallback, useEffect, useMemo } from "react";

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

  // 获取所有同名标签
  const sameNameTags = useMemo(() => {
    if (!name.trim()) return [];
    return tags.filter((t) => t.name.toLowerCase() === name.trim().toLowerCase() && t.id !== tag?.id);
  }, [name, tags, tag]);

  // 递归获取标签的所有后代标签ID
  const getAllDescendantIds = useCallback(
    (tagId: string, memo = new Set<string>()): Set<string> => {
      const childTags = tags.filter((t) => t.parentId === tagId);
      childTags.forEach((child) => {
        memo.add(child.id);
        getAllDescendantIds(child.id, memo);
      });
      return memo;
    },
    [tags]
  );

  // 检查标签树中是否包含同名标签
  const hasConflictInTree = useCallback(
    (tagId: string): boolean => {
      // 获取此标签所有后代的ID
      const descendantIds = getAllDescendantIds(tagId);

      // 检查同名标签是否在后代中
      return sameNameTags.some((sameNameTag) => descendantIds.has(sameNameTag.id));
    },
    [sameNameTags, getAllDescendantIds]
  );

  // 获取可选的父标签列表（排除自身、子标签以及包含同名标签的标签树）
  const availableParentTags = useMemo(() => {
    if (!tag) return tags;

    // 获取所有子标签的ID
    const getChildTagIds = (tagId: string): string[] => {
      const childTags = tags.filter((t) => t.parentId === tagId);
      return [tagId, ...childTags.flatMap((child) => getChildTagIds(child.id))];
    };

    // 排除自身和所有子标签
    const excludeIds = getChildTagIds(tag.id);
    let filteredTags = tags.filter((t) => !excludeIds.includes(t.id));

    // 如果标签名不为空，排除所有可能导致冲突的父标签
    if (name.trim()) {
      // 找出所有包含同名标签（作为子标签）的父标签ID
      const conflictParentIds = new Set<string>();

      // 对每个同名标签，将其所有祖先标签都加入到排除列表中
      sameNameTags.forEach((sameNameTag) => {
        // 向上查找所有祖先标签并排除
        let current = sameNameTag;
        while (current.parentId) {
          conflictParentIds.add(current.parentId);
          const parent = tags.find((t) => t.id === current.parentId);
          if (!parent) break;
          current = parent;
        }
      });

      // 对剩余的候选父标签，检查其子树中是否有同名标签
      filteredTags = filteredTags.filter((t) => {
        // 排除已知有冲突的父标签
        if (conflictParentIds.has(t.id)) return false;

        // 检查标签树中是否有同名标签
        return !hasConflictInTree(t.id);
      });
    }

    return filteredTags;
  }, [tag, tags, name, sameNameTags, hasConflictInTree]);

  // 计算是否有父标签因包含同名标签而被过滤掉
  const hasFilteredParentTags = useMemo(() => {
    if (!tag || !name.trim()) return false;

    // 获取所有子标签的ID
    const getChildTagIds = (tagId: string): string[] => {
      const childTags = tags.filter((t) => t.parentId === tagId);
      return [tagId, ...childTags.flatMap((child) => getChildTagIds(child.id))];
    };

    // 排除自身和所有子标签
    const excludeIds = getChildTagIds(tag.id);
    const allAvailableTags = tags.filter((t) => !excludeIds.includes(t.id));

    // 如果过滤前后数量不同，表示有父标签被过滤
    return allAvailableTags.length !== availableParentTags.length;
  }, [tag, tags, name, availableParentTags]);

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

  // 检查当前选择的父标签下是否有同名标签
  useEffect(() => {
    if (parentId && parentId !== "none" && name.trim()) {
      // 检查父标签树中是否包含同名标签
      const isConflict =
        hasConflictInTree(parentId) ||
        // 直接检查兄弟标签是否有冲突
        tags.some((t) => t.parentId === parentId && t.name.toLowerCase() === name.trim().toLowerCase() && t.id !== tag?.id);

      if (isConflict) {
        setParentId(undefined);
      }
    }
  }, [name, parentId, tags, tag, hasConflictInTree]);

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
            {hasFilteredParentTags && <div className="text-xs text-muted-foreground mt-1">注意：已排除包含同名标签 "{name.trim()}" 的父标签及其祖先标签</div>}
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
