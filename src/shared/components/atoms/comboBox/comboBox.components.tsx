import * as React from 'react';
import _ from 'lodash';
import { Combobox as CKCombobox } from '@chakra-ui/react';
import {
  ComboboxRootProps,
  ComboboxLabelProps,
  ComboboxControlProps,
  ComboboxInputProps,
  ComboboxIndicatorGroupProps,
  ComboboxClearTriggerProps,
  ComboboxTriggerProps,
  ComboboxPositionerProps,
  ComboboxContentProps,
  ComboboxEmptyProps,
  ComboboxItemProps,
  ComboboxItemGroupProps,
  ComboboxItemGroupLabelProps,
} from '@types';

const ComboboxRoot: React.FC<ComboboxRootProps> = ({ children, ...props }) => (
  <CKCombobox.Root {...props}>{children}</CKCombobox.Root>
);

const ComboboxLabel: React.FC<ComboboxLabelProps> = ({ children, ...props }) => (
  <CKCombobox.Label {...props}>{children}</CKCombobox.Label>
);

const ComboboxControl: React.FC<ComboboxControlProps> = ({ children, ...props }) => (
  <CKCombobox.Control {...props}>{children}</CKCombobox.Control>
);

const ComboboxInput: React.FC<ComboboxInputProps> = ({ ...props }) => (
  <CKCombobox.Input {...props} />
);

const ComboboxIndicatorGroup: React.FC<ComboboxIndicatorGroupProps> = ({ children, ...props }) => (
  <CKCombobox.IndicatorGroup {...props}>{children}</CKCombobox.IndicatorGroup>
);

const ComboboxClearTrigger: React.FC<ComboboxClearTriggerProps> = ({ children, ...props }) => (
  <CKCombobox.ClearTrigger {...props}>{children}</CKCombobox.ClearTrigger>
);

const ComboboxTrigger: React.FC<ComboboxTriggerProps> = ({ children, ...props }) => (
  <CKCombobox.Trigger {...props}>{children}</CKCombobox.Trigger>
);

const ComboboxPositioner: React.FC<ComboboxPositionerProps> = ({ children, ...props }) => (
  <CKCombobox.Positioner {...props}>{children}</CKCombobox.Positioner>
);

const ComboboxContent: React.FC<ComboboxContentProps> = ({ children, ...props }) => (
  <CKCombobox.Content {...props}>{children}</CKCombobox.Content>
);

const ComboboxEmpty: React.FC<ComboboxEmptyProps> = ({ children, ...props }) => (
  <CKCombobox.Empty {...props}>{children}</CKCombobox.Empty>
);

const ComboboxItem: React.FC<ComboboxItemProps> = ({ children, ...props }) => (
  <CKCombobox.Item {...props}>{children}</CKCombobox.Item>
);

const ComboboxItemGroup: React.FC<ComboboxItemGroupProps> = ({ children, ...props }) => (
  <CKCombobox.ItemGroup {...props}>{children}</CKCombobox.ItemGroup>
);

const ComboboxItemGroupLabel: React.FC<ComboboxItemGroupLabelProps> = ({ children, ...props }) => (
  <CKCombobox.ItemGroupLabel {...props}>{children}</CKCombobox.ItemGroupLabel>
);

const MemoRoot              = React.memo(ComboboxRoot,             (prev, next) => _.isEqual(prev, next));
const MemoLabel             = React.memo(ComboboxLabel,            (prev, next) => _.isEqual(prev, next));
const MemoControl           = React.memo(ComboboxControl,          (prev, next) => _.isEqual(prev, next));
const MemoInput             = React.memo(ComboboxInput,            (prev, next) => _.isEqual(prev, next));
const MemoIndicatorGroup    = React.memo(ComboboxIndicatorGroup,   (prev, next) => _.isEqual(prev, next));
const MemoClearTrigger      = React.memo(ComboboxClearTrigger,     (prev, next) => _.isEqual(prev, next));
const MemoTrigger           = React.memo(ComboboxTrigger,          (prev, next) => _.isEqual(prev, next));
const MemoPositioner        = React.memo(ComboboxPositioner,       (prev, next) => _.isEqual(prev, next));
const MemoContent           = React.memo(ComboboxContent,          (prev, next) => _.isEqual(prev, next));
const MemoEmpty             = React.memo(ComboboxEmpty,            (prev, next) => _.isEqual(prev, next));
const MemoItem              = React.memo(ComboboxItem,             (prev, next) => _.isEqual(prev, next));
const MemoItemGroup         = React.memo(ComboboxItemGroup,        (prev, next) => _.isEqual(prev, next));
const MemoItemGroupLabel    = React.memo(ComboboxItemGroupLabel,   (prev, next) => _.isEqual(prev, next));

const Combobox = Object.assign(MemoRoot, {
  Label:            MemoLabel,
  Control:          MemoControl,
  Input:            MemoInput,
  IndicatorGroup:   MemoIndicatorGroup,
  ClearTrigger:     MemoClearTrigger,
  Trigger:          MemoTrigger,
  Positioner:       MemoPositioner,
  Content:          MemoContent,
  Empty:            MemoEmpty,
  Item:             MemoItem,
  ItemGroup:        MemoItemGroup,
  ItemGroupLabel:   MemoItemGroupLabel,
});

export default Combobox;