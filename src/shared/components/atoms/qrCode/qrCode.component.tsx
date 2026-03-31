import * as React from 'react';
import _ from 'lodash';
import { QrCode as CKQRCode } from '@chakra-ui/react';
import { QRCodeRootProps, QRCodePatternProps, QRCodeFrameProps } from '@types';

const QRCodeRoot: React.FC<QRCodeRootProps> = ({ children, ...props }) => (
  <CKQRCode.Root {...props}>
    {children}
  </CKQRCode.Root>
);

const QRCodePattern: React.FC<QRCodePatternProps> = ({ children, ...props }) => (
  <CKQRCode.Pattern {...props}>
    {children}
  </CKQRCode.Pattern>
);

const QRCodeFrame: React.FC<QRCodeFrameProps> = ({ ...props }) => (
  <CKQRCode.Frame {...props} />
);

const MemoQRCodeRoot    = React.memo(QRCodeRoot,    (prev, next) => _.isEqual(prev, next));
const MemoQRCodePattern = React.memo(QRCodePattern, (prev, next) => _.isEqual(prev, next));
const MemoQRCodeFrame   = React.memo(QRCodeFrame,   (prev, next) => _.isEqual(prev, next));

const QRCode = Object.assign(MemoQRCodeRoot, {
  Pattern: MemoQRCodePattern,
  Frame:   MemoQRCodeFrame,
});

export default QRCode;