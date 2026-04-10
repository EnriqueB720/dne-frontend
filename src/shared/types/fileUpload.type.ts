export interface FileUploadProps {
  accept?: string[];
  maxFileSize?: number;
  placeholder?: string;
  onFileChange?: (file: File | null) => void;
}
