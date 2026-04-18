import * as React from 'react';
import _ from 'lodash';
import {
  FileUpload as CKFileUpload,
  Icon,
} from '@chakra-ui/react';
import { FileUploadProps } from '@types';
import { LuUpload } from 'react-icons/lu';

const FileUpload: React.FC<FileUploadProps> = ({
  accept = ['image/png', 'image/jpeg', 'image/webp'],
  maxFileSize = 1024 * 1024,
  placeholder = 'Drag and drop an image here, or click to select',
  onFileChange,
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

  return (
    <CKFileUpload.Root
      accept={accept}
      maxFileSize={maxFileSize}
      maxFiles={1}
      onFileChange={(details) => {
        const file = details.acceptedFiles[0] || null;
        setSelectedFile(file);
        onFileChange?.(file);
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
              .png, .jpg, .webp up to {Math.round(maxFileSize / (1024 * 1024))}MB
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
