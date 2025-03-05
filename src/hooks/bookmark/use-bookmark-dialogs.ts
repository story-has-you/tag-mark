import { useBookmarkDialog } from "@/hooks/bookmark/use-bookmark-dialog";

export const useBookmarkDialogs = () => {
  const editDialog = useBookmarkDialog();
  const deleteDialog = useBookmarkDialog();

  const handleEditDialogChange = (isOpen: boolean) => {
    editDialog.setDialog((prev) => ({ ...prev, isOpen }));
  };

  const handleDeleteDialogChange = (isOpen: boolean) => {
    deleteDialog.setDialog((prev) => ({ ...prev, isOpen }));
  };

  return {
    editDialog,
    deleteDialog,
    handleEditDialogChange,
    handleDeleteDialogChange
  };
};
