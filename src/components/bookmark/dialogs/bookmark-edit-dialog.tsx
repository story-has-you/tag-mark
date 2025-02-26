import { useTranslation } from "@/components/i18n-context";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { BookmarkTreeNode } from "@/types/bookmark";
import React from "react";

interface EditBookmarkDialogProps {
  open: boolean;
  bookmark?: BookmarkTreeNode;
  onOpenChange: (open: boolean) => void;
  onConfirm: (title: string, url: string) => Promise<void>;
}

const BookmarkEditDialog: React.FC<EditBookmarkDialogProps> = ({ open, bookmark, onOpenChange, onConfirm }) => {
  const { t } = useTranslation();
  const [title, setTitle] = React.useState(bookmark?.title || "");
  const [url, setUrl] = React.useState(bookmark?.url || "");

  React.useEffect(() => {
    if (bookmark) {
      setTitle(bookmark.title);
      setUrl(bookmark.url || "");
    }
  }, [bookmark]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("bookmark_edit_dialog_title")}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">{t("bookmark_edit_dialog_bookmark_title")}</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="url">{t("bookmark_edit_dialog_url")}</Label>
            <Input id="url" value={url} onChange={(e) => setUrl(e.target.value)} />
          </div>
        </div>
        <DialogDescription></DialogDescription>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("button_cancel")}
          </Button>
          <Button onClick={() => onConfirm(title, url)}>{t("button_save")}</Button>
        </DialogFooter>
      </DialogContent>
      <DialogDescription></DialogDescription>
    </Dialog>
  );
};

BookmarkEditDialog.displayName = "BookmarkEditDialog";

export default BookmarkEditDialog;
