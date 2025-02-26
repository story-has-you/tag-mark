import BookmarkItem from "@/components/bookmark/bookmark-item";
import BookmarkDeleteDialog from "@/components/bookmark/dialogs/bookmark-delete-dialog";
import BookmarkEditDialog from "@/components/bookmark/dialogs/bookmark-edit-dialog";
import { useTranslation } from "@/components/i18n-context";
import KeyboardShortcut from "@/components/keyboard-shortcut";
import TagDeleteDialog from "@/components/tag/dialogs/tag-delete-dialog";
import TagEditDialog from "@/components/tag/dialogs/tag-edit-dialog";
import TagItem from "@/components/tag/tag-item";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { useBookmarkDialogs } from "@/hooks/bookmark/use-bookmark-dialogs";
import { useBookmarkOperations } from "@/hooks/bookmark/use-bookmark-operations";
import { useScrollPosition } from "@/hooks/bookmark/use-scroll-position";
import { useTagManagement } from "@/hooks/tag/use-tag-management";
import BookmarkService from "@/services/bookmark-service";
import type { BookmarkTreeNode } from "@/types/bookmark";
import { AnimatePresence, motion } from "framer-motion";
import { Bookmark, Clock, Edit2, ExternalLink, Hash, Route, Tags, Trash2 } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";

import { useKeyboardShortcut } from "@/hooks/use-hotkeys";

const TagDetail: React.FC = () => {
  const { t, format } = useTranslation();
  const { selectedTag, setSelectedTag } = useTagManagement();
  const { loading, getChildTags, getTagBookmarks, deleteTag, updateTag } = useTagManagement();

  const [bookmarks, setBookmarks] = useState<BookmarkTreeNode[]>([]);
  const [loadingBookmarks, setLoadingBookmarks] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { editDialog, deleteDialog, handleEditDialogChange, handleDeleteDialogChange } = useBookmarkDialogs();
  const { saveScrollPosition, restoreScrollPosition } = useScrollPosition();
  const updateLocalBookmark = useCallback((updatedBookmark: BookmarkTreeNode) => {
    setBookmarks((prev) => prev.map((bookmark) => (bookmark.id === updatedBookmark.id ? updatedBookmark : bookmark)));
  }, []);

  const deleteLocalBookmark = useCallback((bookmarkId: string) => {
    setBookmarks((prev) => prev.filter((bookmark) => bookmark.id !== bookmarkId));
  }, []);

  const { handleEdit, handleDelete } = useBookmarkOperations(updateLocalBookmark, deleteLocalBookmark, saveScrollPosition, restoreScrollPosition);

  useKeyboardShortcut({ onOpenAll: () => handleOpenAll(), onEdit: () => setEditDialogOpen(true), onDelete: () => setDeleteDialogOpen(true) });

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

  const handleEditTag = async (name: string, parentId?: string) => {
    if (!selectedTag) return;

    try {
      const updatedTag = await updateTag(selectedTag.id, {
        id: selectedTag.id,
        name,
        parentId
      });
      // 更新 context 中的选中标签
      setSelectedTag(updatedTag);
      setEditDialogOpen(false);
    } catch (error) {
      console.error("Failed to update tag:", error);
    }
  };

  const handleDeleteTag = async (deleteWithBookmarks: boolean) => {
    if (!selectedTag) return;

    try {
      await deleteTag(selectedTag.id, deleteWithBookmarks);
      setSelectedTag(null);
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error("Failed to delete tag:", error);
    }
  };

  const handleOpenAll = async () => {
    try {
      const bookmarkService = BookmarkService.getInstance();
      await bookmarkService.openBookmarksInGroup(bookmarks, selectedTag.name);
    } catch (error) {
      console.error("Failed to open all bookmarks:", error);
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
    return <div className="flex items-center justify-center h-full text-muted-foreground">{t("tag_tree_select_tag")}</div>;
  }

  const renderBookmarkList = () => {
    if (loadingBookmarks) {
      return (
        <div className="space-y-3">
          <Skeleton className="h-20 w-full rounded-lg" />
          <Skeleton className="h-20 w-full rounded-lg" />
          <Skeleton className="h-20 w-full rounded-lg" />
        </div>
      );
    }

    if (bookmarks.length === 0) {
      return (
        <Alert variant="default" className="bg-muted/50 border-none">
          <AlertDescription className="flex items-center justify-center h-24 text-muted-foreground">{t("tag_detail_no_bookmarks")}</AlertDescription>
        </Alert>
      );
    }

    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid gap-3">
        <AnimatePresence mode="popLayout">
          {bookmarks.map((bookmark, index) => (
            <motion.div
              key={bookmark.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}>
              <BookmarkItem bookmark={bookmark} onEdit={editDialog.openDialog} onDelete={deleteDialog.openDialog} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    );
  };

  return (
    <ScrollArea className="h-full">
      <div className="p-6 space-y-8">
        {/* 标签头部信息 */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-none shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Hash className="h-5 w-5 text-primary/80" />
                    <h2 className="text-2xl font-semibold">{selectedTag.name}</h2>
                  </div>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Route className="h-4 w-4" />
                      <span>
                        {t("tag_detail_path")}: {selectedTag.fullPath || selectedTag.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <div className="space-x-4">
                        <span>
                          {t("tag_detail_created")}: {new Date(selectedTag.createdAt).toLocaleString()}
                        </span>
                        <span>
                          {t("tag_detail_updated")}: {new Date(selectedTag.updatedAt).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="hover:bg-primary/10" onClick={handleOpenAll}>
                    <ExternalLink className="h-4 w-4" />
                    {t("button_open_all")}
                    <KeyboardShortcut command keys={["O"]} />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setEditDialogOpen(true)} className="hover:bg-primary/10">
                    <Edit2 className="h-4 w-4" />
                    {t("button_edit")}
                    <KeyboardShortcut command keys={["E"]} />
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => setDeleteDialogOpen(true)} className="hover:bg-destructive/90">
                    <Trash2 className="h-4 w-4" />
                    {t("button_delete")}
                    <KeyboardShortcut command keys={["Del"]} />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 子标签列表 */}
          {childTags.length > 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <div className="flex items-center gap-2 px-2">
                <Tags className="h-4 w-4 text-muted-foreground" />
                <h3 className="text-sm font-medium">
                  {t("tag_detail_sub_tags")} ({childTags.length})
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {childTags.map((tag, index) => (
                  <motion.div key={tag.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }}>
                    <TagItem tag={tag} onSelect={setSelectedTag} />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* 书签列表 */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 px-2">
              <Bookmark className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-medium">
                {t("tag_detail_related_bookmarks")} ({bookmarks.length})
              </h3>
            </div>
            {renderBookmarkList()}
          </div>
        </motion.div>
      </div>

      {/* 对话框组件 */}
      <TagEditDialog open={editDialogOpen} tag={selectedTag} onOpenChange={setEditDialogOpen} onConfirm={handleEditTag} />
      <TagDeleteDialog
        open={deleteDialogOpen}
        tag={selectedTag}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={() => handleDeleteTag(false)}
        onConfirmWithBookmarks={() => handleDeleteTag(true)}
      />

      <BookmarkEditDialog
        open={editDialog.dialog.isOpen}
        bookmark={editDialog.dialog.bookmark}
        onOpenChange={handleEditDialogChange}
        onConfirm={(title, url) => handleEdit(editDialog.dialog.bookmark, title, url, editDialog.closeDialog)}
      />

      <BookmarkDeleteDialog
        open={deleteDialog.dialog.isOpen}
        bookmark={deleteDialog.dialog.bookmark}
        onOpenChange={handleDeleteDialogChange}
        onConfirm={() => handleDelete(deleteDialog.dialog.bookmark, deleteDialog.closeDialog)}
      />
    </ScrollArea>
  );
};

TagDetail.displayName = "TagDetail";

export default TagDetail;
