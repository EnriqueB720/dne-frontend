import * as React from 'react';
import _ from 'lodash';
import { Button, Flex, Stack, Text } from '@atoms';
import { PricingCardProps } from '@types';

const PricingCard: React.FC<PricingCardProps> = ({
  planName,
  price,
  priceUnit = '/month',
  currency = '$',
  features,
  ctaLabel = 'Choose Plan',
  onChoose,
  isHighlighted = false,
  containerProps,
  planNameProps,
  priceProps,
  priceUnitProps,
  featureTextProps,
  buttonProps,
}) => {
  return (
    <Flex
      direction="column"
      bg="white"
      borderWidth="1px"
      borderColor={isHighlighted ? 'blue.500' : 'gray.200'}
      borderRadius="lg"
      padding="32px 24px"
      gap="24px"
      width="280px"
      boxShadow={isHighlighted ? 'lg' : 'sm'}
      {...containerProps}
    >
      <Text
        fontSize="xl"
        fontWeight="bold"
        color="gray.800"
        textAlign="center"
        {...planNameProps}
      >
        {planName}
      </Text>

      <Flex align="baseline" justify="center" gap="4px">
        <Text fontSize="2xl" fontWeight="bold" color="gray.800" {...priceProps}>
          {currency}{price}
        </Text>
        <Text fontSize="sm" color="gray.500" {...priceUnitProps}>
          {priceUnit}
        </Text>
      </Flex>

      <Stack gap="8px" flex="1">
        {features.map((feature) => (
          <Text key={feature} fontSize="sm" color="gray.600" {...featureTextProps}>
            • {feature}
          </Text>
        ))}
      </Stack>

      <Button
        colorPalette={isHighlighted ? 'blue' : 'gray'}
        variant={isHighlighted ? 'solid' : 'outline'}
        size="md"
        onClick={onChoose}
        {...buttonProps}
      >
        {ctaLabel}
      </Button>
    </Flex>
  );
};

export default React.memo(PricingCard, (prev, next) => _.isEqual(prev, next));
