import { useTranslation } from "@/components/i18n-context";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { isValidUrl } from "@/lib/url-utils";
import type { BookmarkTreeNode } from "@/types/bookmark";
import React, { useEffect, useState } from "react";

interface EditBookmarkDialogProps {
  open: boolean;
  bookmark?: BookmarkTreeNode;
  onOpenChange: (open: boolean) => void;
  onConfirm: (title: string, url: string) => Promise<void>;
}

const BookmarkEditDialog: React.FC<EditBookmarkDialogProps> = ({ open, bookmark, onOpenChange, onConfirm }) => {
  const { t } = useTranslation();
  const [title, setTitle] = useState(bookmark?.title || "");
  const [url, setUrl] = useState(bookmark?.url || "");
  const [urlError, setUrlError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 在组件内部的验证URL函数中
  const validateUrl = (value: string) => {
    if (!value) {
      setUrlError("");
      return;
    }

    if (!isValidUrl(value)) {
      setUrlError(t("bookmark_edit_dialog_url_error"));
    } else {
      setUrlError("");
    }
  };

  // 处理 URL 输入变化
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value;
    setUrl(newUrl);
    validateUrl(newUrl);
  };

  // 处理表单提交
  const handleSubmit = async () => {
    if (!title.trim()) {
      return;
    }

    if (url && !isValidUrl(url)) {
      validateUrl(url);
      return;
    }

    setIsSubmitting(true);
    try {
      await onConfirm(title, url);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (bookmark) {
      setTitle(bookmark.title);
      setUrl(bookmark.url || "");
      setUrlError("");
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
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} className={!title.trim() ? "border-red-500" : ""} />
            {!title.trim() && <p className="text-xs text-red-500">{t("bookmark_edit_dialog_title_empty")}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="url">{t("bookmark_edit_dialog_url")}</Label>
            <Input id="url" value={url} onChange={handleUrlChange} className={urlError ? "border-red-500" : ""} />
            {urlError && <p className="text-xs text-red-500">{urlError}</p>}
          </div>
        </div>
        <DialogDescription></DialogDescription>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("button_cancel")}
          </Button>
          <Button onClick={handleSubmit} disabled={!title.trim() || (url && !!urlError) || isSubmitting}>
            {isSubmitting ? t("button_saving") : t("button_save")}
          </Button>
        </DialogFooter>
      </DialogContent>
      <DialogDescription></DialogDescription>
    </Dialog>
  );
};

BookmarkEditDialog.displayName = "BookmarkEditDialog";

export default BookmarkEditDialog;
