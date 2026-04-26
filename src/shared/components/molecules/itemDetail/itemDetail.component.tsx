import * as React from 'react';
import _ from 'lodash';
import { Flex, Image, Stack, Text, Textarea } from '@atoms';
import { ItemDetailProps } from '@types';

const ItemDetail: React.FC<ItemDetailProps> = ({
  itemNumber,
  description,
  contactEmail,
  contactPhone,
  contactAddress,
  images = [],
  imageAlt = 'Item image',
  imageSize = '220px',
  itemNumberPrefix = 'Item #',
  emailLabel = 'Email',
  phoneLabel = 'Phone',
  addressLabel = 'Address',
  logoSrc = '/assets/logos/logo.png',
  logoAlt = 'D&E Logo',
  logoHeight = '60px',
  containerProps,
  galleryProps,
  imageProps,
  headingProps,
  descriptionProps,
  contactLabelProps,
  contactValueProps,
  logoProps,
}) => {
  const contactRows = [
    { label: emailLabel, value: contactEmail },
    { label: phoneLabel, value: contactPhone },
    { label: addressLabel, value: contactAddress },
  ];

  return (
    <Flex
      direction="column"
      bg="white"
      borderWidth="1px"
      borderColor="gray.200"
      borderRadius="lg"
      padding="32px 24px"
      gap="24px"
      width="100%"
      maxWidth="720px"
      {...containerProps}
    >
      <Text fontSize="2xl" fontWeight="bold" color="gray.800" {...headingProps}>
        {itemNumberPrefix}{itemNumber}
      </Text>

      {images.length > 0 && (
        <Flex
          direction="row"
          gap="12px"
          overflowX="auto"
          paddingBottom="4px"
          {...galleryProps}
        >
          {images.map((src, index) => (
            <Image
              key={src}
              src={src}
              alt={`${imageAlt} ${index + 1}`}
              width={imageSize}
              height={imageSize}
              objectFit="cover"
              borderRadius="md"
              flexShrink={0}
              {...imageProps}
            />
          ))}
        </Flex>
      )}

      <Textarea
        value={description}
        readOnly
        rows={6}
        resize="none"
        variant="subtle"
        {...descriptionProps}
      />

      <Stack gap="8px">
        {contactRows.map((row) => (
          <Flex key={row.label} gap="8px" align="baseline">
            <Text
              fontSize="sm"
              fontWeight="medium"
              color="gray.600"
              minWidth="80px"
              {...contactLabelProps}
            >
              {row.label}:
            </Text>
            <Text fontSize="sm" color="gray.800" {...contactValueProps}>
              {row.value}
            </Text>
          </Flex>
        ))}
      </Stack>

      <Flex justify="center" paddingTop="8px">
        <Image src={logoSrc} alt={logoAlt} height={logoHeight} {...logoProps} />
      </Flex>
    </Flex>
  );
};

export default React.memo(ItemDetail, (prev, next) => _.isEqual(prev, next));
