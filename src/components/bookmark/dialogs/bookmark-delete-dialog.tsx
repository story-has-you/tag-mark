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
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>确认删除</AlertDialogTitle>
          <AlertDialogDescription>你确定要删除书签 "{bookmark?.title}" 吗？此操作无法撤销。</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>取消</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>删除</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

BookmarkDeleteDialog.displayName = "BookmarkDeleteDialog";

export default BookmarkDeleteDialog;
