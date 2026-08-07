import * as React from 'react';
import _ from 'lodash';
import {
  FileUpload as ChakraFileUpload,
  Icon,
} from '@chakra-ui/react';
import { FileUploadProps } from '@types';
import { LuUpload } from 'react-icons/lu';

const CKFileUpload: any = ChakraFileUpload;

const FileUpload: React.FC<FileUploadProps> = ({
  accept = ['image/png', 'image/jpeg', 'image/webp'],
  maxFileSize = 1024 * 1024,
  placeholder = 'Drag and drop an image here, or click to select',
  maxFiles = 1,
  resetOnChange = false,
  disabled = false,
  onFileChange,
  onFilesChange,
  onFilesRejected,
}) => {
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const previewUrl = React.useMemo(
    () => (selectedFile ? URL.createObjectURL(selectedFile) : null),
    [selectedFile]
  );

  React.useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const acceptLabel = accept
    .map((t) => `.${t.split('/')[1]?.replace('jpeg', 'jpg')}`)
    .join(', ');

  /**
   * Bumping this remounts the picker, which is the only reliable way to
   * empty its internal file list.
   *
   * It has to be emptied: `onFileChange` reports the WHOLE accepted list,
   * not the delta, and the list survives across drops. Without a reset,
   * drop #2 hands back [first, second] and a `resetOnChange` consumer
   * re-uploads the first file — one photo in, three rows out.
   */
  const [pickerGeneration, setPickerGeneration] = React.useState(0);

  return (
    <CKFileUpload.Root
      key={pickerGeneration}
      accept={accept}
      maxFileSize={maxFileSize}
      maxFiles={maxFiles}
      disabled={disabled}
      onFileChange={(details) => {
        const files: File[] = details.acceptedFiles ?? [];
        const rejected = (details.rejectedFiles ?? [])
          .map((r: any) => r?.file?.name)
          .filter(Boolean) as string[];

        // Nothing to hand off — this is the remount's own reset event.
        if (files.length === 0 && rejected.length === 0) return;

        // `resetOnChange` consumers upload straight away and render their
        // own result, so holding a preview here would just be stale.
        setSelectedFile(resetOnChange ? null : files[0] || null);
        onFileChange?.(files[0] || null);
        if (files.length > 0) onFilesChange?.(files);
        if (rejected.length > 0) onFilesRejected?.(rejected);

        if (resetOnChange) setPickerGeneration((g) => g + 1);
      }}
    >
      <CKFileUpload.HiddenInput />
      {selectedFile && previewUrl ? (
        <CKFileUpload.ItemGroup>
          <CKFileUpload.Item file={selectedFile}>
            <CKFileUpload.ItemPreview type="image/*">
              <CKFileUpload.ItemPreviewImage />
            </CKFileUpload.ItemPreview>
            <CKFileUpload.ItemContent>
              <CKFileUpload.ItemName />
              <CKFileUpload.ItemSizeText />
            </CKFileUpload.ItemContent>
            <CKFileUpload.ItemDeleteTrigger
              onClick={() => {
                setSelectedFile(null);
                onFileChange?.(null);
              }}
            />
          </CKFileUpload.Item>
        </CKFileUpload.ItemGroup>
      ) : (
        <CKFileUpload.Dropzone style={{ flexDirection: 'row', paddingBlock: '1rem' }}>
          <Icon size="md" color="fg.muted">
            <LuUpload />
          </Icon>
          <CKFileUpload.DropzoneContent>
            <div>{placeholder}</div>
            <div style={{ color: 'var(--chakra-colors-fg-muted)', fontSize: '0.8em' }}>
              {acceptLabel} up to {Math.round(maxFileSize / (1024 * 1024))}MB
            </div>
          </CKFileUpload.DropzoneContent>
        </CKFileUpload.Dropzone>
      )}
    </CKFileUpload.Root>
  );
};

export default React.memo(FileUpload, (prevProps, nextProps) => {
  return _.isEqual(prevProps, nextProps);
});
