import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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

const EditBookmarkDialog: React.FC<EditBookmarkDialogProps> = ({ open, bookmark, onOpenChange, onConfirm }) => {
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
          <DialogTitle>编辑书签</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">标题</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="url">URL</Label>
            <Input id="url" value={url} onChange={(e) => setUrl(e.target.value)} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button onClick={() => onConfirm(title, url)}>保存</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

EditBookmarkDialog.displayName = "EditBookmarkDialog";

export default EditBookmarkDialog;
