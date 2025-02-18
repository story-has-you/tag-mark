import BookmarkItem from "@/components/bookmark/bookmark-item";
import TagDeleteDialog from "@/components/tag/dialogs/tag-delete-dialog";
import TagEditDialog from "@/components/tag/dialogs/tag-edit-dialog";
import { useTagContext } from "@/components/tag/tag-context";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { useBookmarkDialogs } from "@/hooks/bookmark/use-bookmark-dialogs";
import { useTagManagement } from "@/hooks/tag/use-tag-management";
import type { BookmarkTreeNode } from "@/types/bookmark";
import type { Tag } from "@/types/tag";
import { Edit2, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";

interface TagItemProps {
  tag: Tag;
  onSelect: (tag: Tag) => void;
}

const TagItem: React.FC<TagItemProps> = ({ tag, onSelect }) => {
  return (
    <Card className="hover:bg-accent transition-colors cursor-pointer" onClick={() => onSelect(tag)}>
      <CardContent className="p-3">
        <div className="flex items-center gap-3">
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-medium truncate">{tag.name}</span>
            {tag.fullPath && <span className="text-xs text-muted-foreground truncate">{tag.fullPath}</span>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const TagList: React.FC = () => {
  const { selectedTag, setSelectedTag } = useTagContext();
  const { loading, getChildTags, getTagBookmarks, deleteTag, updateTag, createTag } = useTagManagement();
  const { editDialog, deleteDialog } = useBookmarkDialogs();

  const [bookmarks, setBookmarks] = useState<BookmarkTreeNode[]>([]);
  const [loadingBookmarks, setLoadingBookmarks] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  useEffect(() => {
    const loadBookmarks = async () => {
      if (!selectedTag) return;

      setLoadingBookmarks(true);
      try {
        // 使用新的方法获取直接关联的书签
        const tagBookmarks = await getTagBookmarks(selectedTag.id);
        setBookmarks(tagBookmarks);
      } catch (err) {
        console.error("Failed to load bookmarks:", err);
      } finally {
        setLoadingBookmarks(false);
      }
    };

    loadBookmarks();
  }, [selectedTag]);

  const handleEdit = async (name: string, parentId?: string) => {
    if (!selectedTag) return;

    try {
      await updateTag(selectedTag.id, {
        id: selectedTag.id,
        name,
        parentId
      });
      setEditDialogOpen(false);
    } catch (error) {
      console.error("Failed to update tag:", error);
    }
  };

  const handleDelete = async () => {
    if (!selectedTag) return;

    try {
      await deleteTag(selectedTag.id);
      setSelectedTag(null);
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error("Failed to delete tag:", error);
    }
  };

  const handleCreate = async (name: string, parentId?: string) => {
    try {
      await createTag({
        name,
        parentId: parentId || selectedTag?.id
      });
      setCreateDialogOpen(false);
    } catch (error) {
      console.error("Failed to create tag:", error);
    }
  };

  const childTags = selectedTag ? getChildTags(selectedTag.id) : [];

  if (loading) {
    return (
      <div className="p-4 space-y-4">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  if (!selectedTag) {
    return <div className="flex items-center justify-center h-full text-muted-foreground">请选择一个标签</div>;
  }

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-6">
        {/* 标签信息和操作按钮 */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">{selectedTag.name}</h2>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setEditDialogOpen(true)}>
                <Edit2 className="h-4 w-4 mr-2" />
                编辑
              </Button>
              <Button variant="destructive" size="sm" onClick={() => setDeleteDialogOpen(true)}>
                <Trash2 className="h-4 w-4 mr-2" />
                删除
              </Button>
            </div>
          </div>

          <div className="text-sm text-muted-foreground">
            <p>完整路径: {selectedTag.fullPath || selectedTag.name}</p>
            <p>创建时间: {new Date(selectedTag.createdAt).toLocaleString()}</p>
            <p>更新时间: {new Date(selectedTag.updatedAt).toLocaleString()}</p>
          </div>
        </div>

        {/* 子标签列表 */}
        {childTags.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium">子标签 ({childTags.length})</h3>
            <div className="grid gap-2">
              {childTags.map((tag) => (
                <TagItem key={tag.id} tag={tag} onSelect={setSelectedTag} />
              ))}
            </div>
          </div>
        )}

        {/* 关联书签列表 */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium">直接关联书签 ({bookmarks.length})</h3>
          {loadingBookmarks ? (
            <div className="space-y-2">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          ) : bookmarks.length === 0 ? (
            <Alert>
              <AlertDescription>该标签下没有直接关联的书签</AlertDescription>
            </Alert>
          ) : (
            <div className="grid gap-2">
              {bookmarks.map((bookmark) => (
                <BookmarkItem bookmark={bookmark} onEdit={editDialog.openDialog} onDelete={deleteDialog.openDialog} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 对话框组件 */}
      <TagEditDialog open={editDialogOpen} tag={selectedTag} onOpenChange={setEditDialogOpen} onConfirm={handleEdit} />
      <TagDeleteDialog open={deleteDialogOpen} tag={selectedTag} onOpenChange={setDeleteDialogOpen} onConfirm={handleDelete} />
      <TagEditDialog open={createDialogOpen} tag={null} onOpenChange={setCreateDialogOpen} onConfirm={handleCreate} />
    </ScrollArea>
  );
};

TagList.displayName = "TagList";

export default TagList;
