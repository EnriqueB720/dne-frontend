import * as React from 'react';
import _ from 'lodash';
import { Avatar, Button, Flex, Input, Stack, Text } from '@atoms';
import { ProfileCardField, ProfileCardProps } from '@types';

const ProfileCard: React.FC<ProfileCardProps> = ({
  name,
  email,
  phone,
  avatarSrc,
  avatarSize = '2xl',
  nameLabel = 'Name',
  emailLabel = 'Email',
  phoneLabel = 'Phone',
  editLabel = 'Edit',
  onEdit,
  extraFields = [],
  containerProps,
  labelProps,
  inputProps,
  buttonProps,
}) => {
  const fields: ProfileCardField[] = [
    { label: nameLabel, value: name },
    { label: emailLabel, value: email },
    { label: phoneLabel, value: phone },
    ...extraFields,
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
      width="400px"
      align="center"
      {...containerProps}
    >
      <Avatar size={avatarSize} src={avatarSrc} name={name} />

      <Stack gap="16px" width="100%">
        {fields.map((field) => (
          <Flex key={field.label} direction="column" gap="6px">
            <Text fontSize="sm" fontWeight="medium" color="gray.600" {...labelProps}>
              {field.label}
            </Text>
            <Input
              value={field.value}
              readOnly
              variant="subtle"
              size="md"
              {...inputProps}
            />
          </Flex>
        ))}
      </Stack>

      <Button
        colorPalette="blue"
        variant="solid"
        size="md"
        width="100%"
        onClick={onEdit}
        {...buttonProps}
      >
        {editLabel}
      </Button>
    </Flex>
  );
};

export default React.memo(ProfileCard, (prev, next) => _.isEqual(prev, next));
