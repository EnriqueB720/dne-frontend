import React, { useState } from 'react';
import _ from 'lodash';
import { useRouter } from 'next/router';
import { TitleSearchBarProps } from '@types';
import { Box, Flex, Text, Input, Button } from '@components';

const TitleSearchBar: React.FC<TitleSearchBarProps> = ({
  title = 'Search',
  inputPlaceholder = 'Search...',
  buttonText = 'Search',
  searchRoute = '/search',
  queryParamName = 'query',
  containerProps,
  rowProps,
  titleProps,
  inputProps,
  buttonProps,
}) => {
  const [searchValue, setSearchValue] = useState('');
  const router = useRouter();

  const handleSearch = () => {
    const trimmed = searchValue.trim();
    if (!trimmed) return;
    router.push({
      pathname: searchRoute,
      query: { [queryParamName]: trimmed },
    });
  };

  return (
    <Box textAlign="center" {...containerProps}>
      <Text fontSize="50px" mb={2} {...titleProps}>
        {title}
      </Text>
      <Flex justifyContent="space-around" gap="8px" {...rowProps}>
        <Input
          name="search"
          placeholder={inputPlaceholder}
          value={searchValue}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setSearchValue(e.target.value)
          }
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === 'Enter') handleSearch();
          }}
          {...inputProps}
        />
        <Button onClick={handleSearch} {...buttonProps}>
          {buttonText}
        </Button>
      </Flex>
    </Box>
  );
};

export default React.memo(TitleSearchBar, (prevProps, nextProps) =>
  _.isEqual(prevProps, nextProps),
);
