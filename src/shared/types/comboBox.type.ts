import {
  ComboboxRootProps as ComboboxRootProperties,
} from '@chakra-ui/react';
import { CollectionItem } from '@ark-ui/react';

export interface ComboboxItem {
  label: string;
  value: string;
}

export interface ComboboxProps extends Omit<ComboboxRootProperties<CollectionItem>, 'collection'> {
  items: ComboboxItem[];
  label?: string;
  placeholder?: string;
  emptyText?: string;
}
