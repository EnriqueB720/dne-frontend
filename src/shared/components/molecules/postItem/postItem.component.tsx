import * as React from 'react';
import _ from 'lodash';
import { Flex, Image, Text } from '@atoms';
import { PostItemProps } from '@types';

const PostItem: React.FC<PostItemProps> = ({
  title,
  description,
  imageUrl,
  date,
  variant = 'card',
  onClick,
  containerProps,
  titleProps,
  descriptionProps,
  dateProps,
  imageProps,
}) => {
  const isRow = variant === 'row';

  return (
    <Flex
      direction={isRow ? 'row' : 'column'}
      align={isRow ? 'center' : 'stretch'}
      gap={isRow ? '20px' : '12px'}
      bg="white"
      borderWidth="1px"
      borderColor="gray.200"
      borderRadius="md"
      padding={isRow ? '16px 20px' : '16px'}
      width="100%"
      minHeight={isRow ? '100px' : '160px'}
      cursor={onClick ? 'pointer' : 'default'}
      _hover={onClick ? { boxShadow: 'md', borderColor: 'gray.300' } : undefined}
      onClick={onClick}
      {...containerProps}
    >
      {imageUrl && (
        <Image
          src={imageUrl}
          alt={title}
          width={isRow ? '80px' : '100%'}
          height={isRow ? '80px' : '120px'}
          objectFit="cover"
          borderRadius="md"
          flexShrink={0}
          {...imageProps}
        />
      )}

      <Flex direction="column" flex="1" gap="4px" minWidth="0">
        <Text
          fontSize={isRow ? 'md' : 'sm'}
          fontWeight="bold"
          color="gray.800"
          truncate
          {...titleProps}
        >
          {title}
        </Text>

        {isRow && description && (
          <Text fontSize="sm" color="gray.600" lineClamp={2} {...descriptionProps}>
            {description}
          </Text>
        )}

        {isRow && date && (
          <Text fontSize="xs" color="gray.500" {...dateProps}>
            {date}
          </Text>
        )}
      </Flex>
    </Flex>
  );
};

export default React.memo(PostItem, (prev, next) => _.isEqual(prev, next));
