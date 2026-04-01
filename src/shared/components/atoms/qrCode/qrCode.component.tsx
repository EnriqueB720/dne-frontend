import * as React from 'react';
import _ from 'lodash';
import { QrCode as CKQRCode } from '@chakra-ui/react';
import { QRCodeProps } from '@types';

const QRCodeBase: React.FC<QRCodeProps> = ({ ...props }) => (
  <CKQRCode.Root {...props}>
    <CKQRCode.Frame>
      <CKQRCode.Pattern />
    </CKQRCode.Frame>
  </CKQRCode.Root>
);

const QRCode = React.memo(QRCodeBase, (prev, next) => _.isEqual(prev, next));

export default QRCode;
