import * as React from 'react';
import _ from 'lodash';
import {
  Combobox as CKCombobox,
  Portal,
  useFilter,
  useListCollection,
} from '@chakra-ui/react';
import { ComboboxProps } from '@types';

const ComboboxBase: React.FC<ComboboxProps> = ({
  items,
  label,
  placeholder,
  emptyText,
  ...props
}) => {
  const { contains } = useFilter({ sensitivity: 'base' });

  const { collection, filter } = useListCollection({
    initialItems: items,
    filter: contains,
  });

  return (
    <CKCombobox.Root
      collection={collection}
      onInputValueChange={(e) => filter(e.inputValue)}
      {...props}
    >
      {label && <CKCombobox.Label>{label}</CKCombobox.Label>}
      <CKCombobox.Control>
        <CKCombobox.Input placeholder={placeholder} />
        <CKCombobox.IndicatorGroup>
          <CKCombobox.ClearTrigger />
          <CKCombobox.Trigger />
        </CKCombobox.IndicatorGroup>
      </CKCombobox.Control>
      <Portal>
        <CKCombobox.Positioner>
          <CKCombobox.Content>
            {emptyText && <CKCombobox.Empty>{emptyText}</CKCombobox.Empty>}
            {collection.items.map((item) => (
              <CKCombobox.Item key={item.value} item={item}>
                {item.label}
                <CKCombobox.ItemIndicator />
              </CKCombobox.Item>
            ))}
          </CKCombobox.Content>
        </CKCombobox.Positioner>
      </Portal>
    </CKCombobox.Root>
  );
};

const Combobox = React.memo(ComboboxBase, (prev, next) => _.isEqual(prev, next));

export default Combobox;
