export interface FileUploadProps {
  accept?: string[];
  maxFileSize?: number;
  placeholder?: string;
  /** How many files one drop/selection may carry. Defaults to 1. */
  maxFiles?: number;
  /**
   * Clear the picker as soon as the callback fires, instead of holding the
   * selection as a preview. Use when the consumer uploads immediately and
   * renders its own result (e.g. a gallery).
   */
  resetOnChange?: boolean;
  /** Disable the dropzone while an upload is in flight. */
  disabled?: boolean;
  onFileChange?: (file: File | null) => void;
  /** Fires alongside `onFileChange` when `maxFiles > 1`. */
  onFilesChange?: (files: File[]) => void;
  /**
   * Files the dropzone refused (wrong type, over `maxFileSize`). Without a
   * handler these vanish silently and the drop looks like it did nothing.
   */
  onFilesRejected?: (names: string[]) => void;
}
