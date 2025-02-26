import { useTranslation } from "@/components/i18n-context";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import type { BookmarkTreeNode } from "@/types/bookmark";
import React from "react";

interface DeleteBookmarkDialogProps {
  open: boolean;
  bookmark?: BookmarkTreeNode;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<void>;
}

const BookmarkDeleteDialog: React.FC<DeleteBookmarkDialogProps> = ({ open, bookmark, onOpenChange, onConfirm }) => {
  const { t, format } = useTranslation();

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("bookmark_delete_dialog_title")}</AlertDialogTitle>
          <AlertDialogDescription>{bookmark?.title && format("bookmark_delete_dialog_confirm_message", bookmark.title)}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t("button_cancel")}</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>{t("button_delete")}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

BookmarkDeleteDialog.displayName = "BookmarkDeleteDialog";

export default BookmarkDeleteDialog;
