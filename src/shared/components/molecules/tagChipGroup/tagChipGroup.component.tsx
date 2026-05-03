import * as React from 'react';
import _ from 'lodash';
import { Badge, Flex } from '@atoms';
import { TagChipGroupProps, TagChipItem } from '@types';

const TagChipGroup: React.FC<TagChipGroupProps> = ({
  tags,
  selectedValue,
  onTagClick,
  containerProps,
  chipProps,
  selectedChipProps,
}) => {
  const handleClick = (tag: TagChipItem) => {
    if (tag.onClick) tag.onClick();
    if (onTagClick) onTagClick(tag);
  };

  return (
    <Flex
      direction="row"
      wrap="wrap"
      gap="8px"
      align="center"
      {...containerProps}
    >
      {tags.map((tag) => {
        const isSelected = selectedValue !== undefined && tag.value === selectedValue;
        const variantProps = isSelected ? selectedChipProps : chipProps;

        return (
          <Badge
            key={tag.value ?? tag.label}
            colorPalette={isSelected ? 'blue' : 'gray'}
            variant={isSelected ? 'solid' : 'subtle'}
            borderRadius="full"
            paddingX="12px"
            paddingY="6px"
            cursor="pointer"
            fontSize="sm"
            fontWeight="medium"
            _hover={{ opacity: 0.8 }}
            onClick={() => handleClick(tag)}
            {...variantProps}
          >
            {tag.label}
          </Badge>
        );
      })}
    </Flex>
  );
};

export default React.memo(TagChipGroup, (prev, next) => _.isEqual(prev, next));
