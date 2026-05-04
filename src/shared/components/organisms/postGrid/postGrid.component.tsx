import * as React from 'react';
import _ from 'lodash';
import { Button, Flex, Text } from '@atoms';
import { PostItem } from '@molecules';
import { PostGridProps } from '@types';

const PostGrid: React.FC<PostGridProps> = ({
  posts,
  title = 'Posts',
  ctaLabel = 'Create new post',
  layout = 'grid',
  onCreate,
  onPostClick,
  showCreateButton = true,
  emptyText = 'No posts yet.',
  gridColumns = 3,
  containerProps,
  headerProps,
  titleProps,
  buttonProps,
  itemsContainerProps,
}) => {
  const isGrid = layout === 'grid';
  const itemVariant = isGrid ? 'card' : 'row';

  return (
    <Flex
      direction="column"
      gap="20px"
      width="100%"
      {...containerProps}
    >
      <Flex
        direction="row"
        justify="space-between"
        align="center"
        {...headerProps}
      >
        <Text fontSize="2xl" fontWeight="bold" color="gray.800" {...titleProps}>
          {title}
        </Text>

        {showCreateButton && (
          <Button
            colorPalette="blue"
            variant="solid"
            size="md"
            onClick={onCreate}
            {...buttonProps}
          >
            {ctaLabel}
          </Button>
        )}
      </Flex>

      {posts.length === 0 ? (
        <Text fontSize="sm" color="gray.500" textAlign="center" padding="32px">
          {emptyText}
        </Text>
      ) : (
        <Flex
          direction={isGrid ? 'row' : 'column'}
          wrap={isGrid ? 'wrap' : 'nowrap'}
          gap="16px"
          {...itemsContainerProps}
        >
          {posts.map((post) => (
            <Flex
              key={post.id}
              width={isGrid ? `calc(${100 / gridColumns}% - 16px)` : '100%'}
              flexShrink={0}
            >
              <PostItem
                {...post}
                variant={itemVariant}
                onClick={onPostClick ? () => onPostClick(post) : undefined}
              />
            </Flex>
          ))}
        </Flex>
      )}
    </Flex>
  );
};

export default React.memo(PostGrid, (prev, next) => _.isEqual(prev, next));
