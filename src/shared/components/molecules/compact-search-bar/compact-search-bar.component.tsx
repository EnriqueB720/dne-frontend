import React, { useState } from 'react';
import _ from 'lodash';
import { useRouter } from 'next/router';
import { CompactSearchBarProps } from '@types';
import { Flex, Input, IconButton } from '@components';

const CompactSearchBar: React.FC<CompactSearchBarProps> = ({
  inputPlaceholder = 'Search',
  searchRoute = '/search',
  queryParamName = 'query',
  defaultValue = '',
  containerProps,
  inputProps,
  buttonProps,
}) => {
  const [searchValue, setSearchValue] = useState(defaultValue);
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
    <Flex align="center" gap="8px" {...containerProps}>
      <Input
        name="search"
        placeholder={inputPlaceholder}
        value={searchValue}
        size="sm"
        width="280px"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setSearchValue(e.target.value)
        }
        onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
          if (e.key === 'Enter') handleSearch();
        }}
        {...inputProps}
      />
      <IconButton
        icon="search"
        aria-label="Search"
        size="sm"
        variant="subtle"
        onClick={handleSearch}
        {...buttonProps}
      />
    </Flex>
  );
};

export default React.memo(CompactSearchBar, (prevProps, nextProps) =>
  _.isEqual(prevProps, nextProps),
);
