import { useTranslation } from "@/components/i18n-context";
import TagSuggestions from "@/components/tag/tag-suggestions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import TagBookmarkRelationService from "@/services/tag-bookmark-relation-service";
import TagService from "@/services/tag-service";
import type { BookmarkTreeNode } from "@/types/bookmark";
import type { Tag } from "@/types/tag";
import { Tag as TagIcon } from "lucide-react";
import React, { useEffect, useState } from "react";

interface BookmarkBatchTagDialogProps {
  open: boolean;
  bookmarks: BookmarkTreeNode[];
  folderName: string;
  onOpenChange: (open: boolean) => void;
}

const BookmarkBatchAddTagDialog: React.FC<BookmarkBatchTagDialogProps> = ({ open, bookmarks, folderName, onOpenChange }) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState("");
  const [tags, setTags] = useState<Tag[]>([]);
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);

  // 加载所有标签
  useEffect(() => {
    const loadAllTags = async () => {
      try {
        const tagService = TagService.getInstance();
        const tags = await tagService.getAllTags();
        setAllTags(tags);
      } catch (error) {
        console.error("加载标签失败:", error);
      }
    };

    if (open) {
      loadAllTags();
      setSelectedTags([]);
      setInput("");
    }
  }, [open]);

  // 根据输入过滤标签
  useEffect(() => {
    if (!input || !input.trim()) {
      setTags([]);
      return;
    }

    const filtered = allTags.filter((tag) => tag.name.toLowerCase().includes(input.toLowerCase()) || (tag.fullPath && tag.fullPath.toLowerCase().includes(input.toLowerCase())));
    setTags(filtered);
  }, [input, allTags]);

  // 处理添加标签
  const handleAddTag = async (tagPath: string) => {
    if (!tagPath || typeof tagPath !== "string") {
      console.error("无效的标签路径", tagPath);
      return;
    }

    try {
      setLoading(true);

      // 处理标签路径
      const normalizedPath = tagPath.replace(/^#/, "");

      if (!normalizedPath.trim()) {
        toast({
          variant: "destructive",
          title: "添加失败",
          description: "标签名称不能为空"
        });
        return;
      }

      // 查找或创建标签
      let tagToAdd: Tag | null = null;

      // 先尝试查找完全匹配的标签
      const exactMatch = allTags.find((tag) => tag.fullPath === `#${normalizedPath}` || tag.fullPath === normalizedPath || tag.name === normalizedPath);

      if (exactMatch) {
        tagToAdd = exactMatch;
      } else {
        // 如果没有完全匹配，创建新标签
        const tagService = TagService.getInstance();
        tagToAdd = await tagService.createTag({
          name: normalizedPath
        });

        // 添加到本地标签列表中
        setAllTags((prev) => [...prev, tagToAdd!]);
      }

      // 检查标签是否已经被选择
      if (selectedTags.some((tag) => tag.id === tagToAdd.id)) {
        toast({
          title: "标签已存在",
          description: `标签 "${tagToAdd.name}" 已经被添加`
        });
        return;
      }

      // 添加到已选择的标签中
      setSelectedTags((prev) => [...prev, tagToAdd!]);
      setInput("");
    } catch (error) {
      console.error("添加标签失败:", error);
      toast({
        variant: "destructive",
        title: "添加失败",
        description: "添加标签时发生错误"
      });
    } finally {
      setLoading(false);
    }
  };

  // 删除已选择的标签
  const handleDeleteTag = (tagId: string) => {
    setSelectedTags((prev) => prev.filter((tag) => tag.id !== tagId));
  };

  // 确认添加标签到所有书签
  const handleConfirm = async () => {
    if (selectedTags.length === 0 || bookmarks.length === 0) return;

    setLoading(true);
    try {
      const relationService = TagBookmarkRelationService.getInstance();
      let successCount = 0;

      // 为每个书签添加每个选定的标签
      for (const bookmark of bookmarks) {
        for (const tag of selectedTags) {
          try {
            await relationService.createRelation(tag.id, bookmark.id);
            successCount++;
          } catch (error) {
            console.error(`给书签 ${bookmark.id} 添加标签 ${tag.id} 失败:`, error);
            // 继续处理其他书签和标签
          }
        }
      }

      toast({
        title: "批量添加成功",
        description: `已成功添加 ${successCount} 个标签关联`
      });

      onOpenChange(false);
    } catch (error) {
      console.error("批量添加标签失败:", error);
      toast({
        variant: "destructive",
        title: "操作失败",
        description: "批量添加标签时发生错误"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <TagIcon className="h-5 w-5" />
            批量添加标签
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col space-y-6 py-4">
          {/* 文件夹信息 */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">文件夹信息</h3>
            <div className="rounded-lg border bg-card p-4">
              <h4 className="font-medium">{folderName}</h4>
              <p className="text-sm text-muted-foreground">共 {bookmarks.length} 个书签</p>
            </div>
          </div>

          {/* 标签输入区域 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-muted-foreground">{t("bookmark_add_tag_dialog_add_tags")}</h3>
              <span className="text-xs text-muted-foreground">已选择 {selectedTags.length} 个标签</span>
            </div>
            <TagSuggestions
              value={input || ""}
              suggestions={tags}
              onValueChange={setInput}
              onEnter={(value) => handleAddTag(value || "")}
              disabled={loading}
              allTags={allTags}
              tags={selectedTags}
            />
          </div>

          {/* 已选标签展示区域 */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">已选择的标签</h3>
            <div className="min-h-[100px] rounded-lg border bg-card p-4">
              <div className="flex flex-wrap gap-2">
                {selectedTags.map((tag) => (
                  <Badge key={tag.id} variant="secondary" className={cn("flex items-center gap-1 px-3 py-1", "hover:bg-secondary/80 transition-colors")}>
                    {tag.fullPath || `#${tag.name}`}
                    <Button variant="ghost" size="icon" className="h-4 w-4 p-0 hover:bg-transparent" onClick={() => handleDeleteTag(tag.id)}>
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

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("button_cancel")}
          </Button>
          <Button onClick={handleConfirm} disabled={loading || selectedTags.length === 0}>
            {loading ? "处理中..." : "应用到所有书签"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookmarkBatchAddTagDialog;
