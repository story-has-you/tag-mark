import BookmarkAddTagDialog from "@/components/bookmark/dialogs/bookmark-add-tag-dialog";
import { useTranslation } from "@/components/i18n-context";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu";
import { useBookmarkDialog } from "@/hooks/bookmark/use-bookmark-dialog";
import BookmarkService from "@/services/bookmark-service";
import type { BookmarkTreeNode } from "@/types/bookmark";
import { ExternalLink, Pencil, Tag, Trash2 } from "lucide-react";
import React from "react";

interface BookmarkContextMenuProps {
  children: React.ReactNode;
  bookmark: BookmarkTreeNode;
  onEdit?: (bookmark: BookmarkTreeNode) => void;
  onDelete?: (bookmark: BookmarkTreeNode) => void;
}

const BookmarkContextMenu: React.FC<BookmarkContextMenuProps> = ({ children, bookmark, onEdit, onDelete }) => {
  const { t } = useTranslation();
  const addTagDialog = useBookmarkDialog();

  const handleOpenInNewTab = () => {
    if (bookmark.url) {
      BookmarkService.getInstance().createTab(bookmark.url);
    }
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
      <ContextMenuContent className="w-52">
        <ContextMenuItem onClick={() => addTagDialog.openDialog(bookmark)}>
          <Tag className="mr-2 h-4 w-4" />
          {t("bookmark_context_menu_add_tag")}
        </ContextMenuItem>
        <ContextMenuItem onClick={handleOpenInNewTab}>
          <ExternalLink className="mr-2 h-4 w-4" />
          {t("bookmark_context_menu_open_bookmark")}
        </ContextMenuItem>
        <ContextMenuItem onClick={() => onEdit?.(bookmark)}>
          <Pencil className="mr-2 h-4 w-4" />
          {t("bookmark_context_menu_edit_bookmark")}
        </ContextMenuItem>
        <ContextMenuItem onClick={() => onDelete?.(bookmark)}>
          <Trash2 className="mr-2 h-4 w-4" />
          {t("bookmark_context_menu_delete_bookmark")}
        </ContextMenuItem>
      </ContextMenuContent>

      <BookmarkAddTagDialog
        open={addTagDialog.dialog.isOpen}
        bookmark={addTagDialog.dialog.bookmark}
        onOpenChange={(isOpen) => addTagDialog.setDialog((prev) => ({ ...prev, isOpen }))}
      />
    </ContextMenu>
  );
};

BookmarkContextMenu.displayName = "BookmarkContextMenu";

export default BookmarkContextMenu;
