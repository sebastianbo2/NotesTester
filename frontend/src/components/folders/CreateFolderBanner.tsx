import React, { useState, useRef, useEffect } from "react";
import BannerWrapper from "../BannerWrapper";

interface CreateFolderBannerProps {
  onCreate: (folderName: string) => void;
  onCancel: () => void;
  isOpen: boolean;
}

export default function CreateFolderBanner({
  onCreate,
  onCancel,
  isOpen,
}: CreateFolderBannerProps) {
  const [folderName, setFolderName] = useState("");
  const cancelBtnRef = useRef<HTMLButtonElement>(null);

  // Focus the cancel button on mount for safety/UX consistency
  useEffect(() => {
    cancelBtnRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (folderName.trim()) {
      onCreate(folderName.trim());
    }
  };

  return (
    <BannerWrapper className="bg-background border-border shadow-elevated">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="space-y-2">
          <h3 className="font-sans font-semibold text-foreground">
            Create New Folder
          </h3>
          <input
            type="text"
            placeholder="Enter folder name..."
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
            className="w-full px-3 py-2 bg-input border border-border rounded-md text-sm text-foreground focus:ring-2 focus:ring-ring focus:outline-none"
          />
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            ref={cancelBtnRef}
            onClick={onCancel}
            className="px-3 py-2 text-sm font-medium rounded-md hover:bg-secondary text-secondary-foreground transition-colors"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={!folderName.trim()}
            className="px-3 py-2 text-sm font-medium rounded-md bg-primary text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Create Folder
          </button>
        </div>
      </form>
    </BannerWrapper>
  );
}
