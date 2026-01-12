import BannerWrapper from "../BannerWrapper";

interface DeleteFolderBannerProps {
  folderId: string;
  isOpen: boolean;
  onDelete: (id: string) => void;
  onCancel: () => void;
}

export default function DeleteFolderBanner({
  folderId,
  isOpen,
  onDelete,
  onCancel,
}: DeleteFolderBannerProps) {
  return (
    <BannerWrapper>
      <div className="flex flex-col gap-4">
        <div className="space-y-1">
          <h3 className="font-sans font-semibold text-foreground">
            Delete Folder
          </h3>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete this folder and all its content?{" "}
            <br></br>This action is irreversible.
          </p>
        </div>

        <div className="flex justify-end gap-3">
          {/* Cancel is focused by default for safety */}
          <button
            autoFocus
            onClick={onCancel}
            className="px-3 py-2 text-sm font-medium rounded-md hover:bg-secondary transition-colors"
          >
            Cancel
          </button>

          <button
            onClick={() => onDelete(folderId)}
            className="px-3 py-2 text-sm font-medium rounded-md bg-destructive text-destructive-foreground hover:opacity-90 transition-opacity"
          >
            OK
          </button>
        </div>
      </div>
    </BannerWrapper>
  );
}
