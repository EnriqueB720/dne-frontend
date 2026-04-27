import * as React from 'react';
import _ from 'lodash';
import { Button, Flex, Image, Text } from '@atoms';
import { ResultCardProps } from '@types';

const ResultCard: React.FC<ResultCardProps> = ({
  title,
  price,
  description,
  currency = '$',
  ctaLabel = 'Visit',
  href,
  onVisit,
  imageUrl,
  imageAlt = '',
  containerProps,
  titleProps,
  priceProps,
  descriptionProps,
  buttonProps,
}) => {
  const handleVisit = () => {
    if (onVisit) onVisit();
    if (href) window.location.href = href;
  };

  return (
    <Flex
      direction="row"
      align="center"
      gap="20px"
      bg="white"
      borderWidth="1px"
      borderColor="gray.200"
      borderRadius="md"
      padding="16px 20px"
      width="100%"
      height="140px"
      cursor={href || onVisit ? 'pointer' : 'default'}
      _hover={
        href || onVisit
          ? { boxShadow: 'md', borderColor: 'gray.300' }
          : undefined
      }
      onClick={handleVisit}
      {...containerProps}
    >
      {imageUrl && (
        <Image
          src={imageUrl}
          alt={imageAlt}
          width="100px"
          height="100px"
          objectFit="cover"
          borderRadius="md"
          flexShrink={0}
        />
      )}

      <Flex direction="column" flex="1" gap="6px" minWidth="0">
        <Text
          fontSize="lg"
          fontWeight="bold"
          color="gray.800"
          truncate
          {...titleProps}
        >
          {title}
        </Text>

        <Text fontSize="sm" color="gray.600" lineClamp={2} {...descriptionProps}>
          {description}
        </Text>
      </Flex>

      <Flex direction="row" align="center" gap="16px" flexShrink={0}>
        <Text fontSize="xl" fontWeight="bold" color="gray.800" {...priceProps}>
          {currency}{price}
        </Text>

        <Button
          colorPalette="blue"
          variant="solid"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            handleVisit();
          }}
          {...buttonProps}
        >
          {ctaLabel}
        </Button>
      </Flex>
    </Flex>
  );
};

export default React.memo(ResultCard, (prev, next) => _.isEqual(prev, next));
