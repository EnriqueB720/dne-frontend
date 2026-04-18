import * as React from 'react';
import _ from 'lodash';
import { Flex, Image, Text } from '@atoms';
import { FooterProps } from '@types';

const Footer: React.FC<FooterProps> = ({
  logoSrc = '/favicon.png',
  logoAlt = 'D&E Logo',
  logoHeight = '100px',
  copyrightText = `© ${new Date().getFullYear()}`,
  links = [],
  containerProps,
  linkTextProps,
  copyrightTextProps,
}) => {
  return (
    <Flex
      as="footer"
      width="100%"
      justify="space-between"
      align="center"
      padding="16px 24px"
      {...containerProps}
    >
      <Flex align="center" gap="12px">
        <Image src={logoSrc} alt={logoAlt} height={logoHeight} />
        <Text fontSize="sm" color="gray.500" {...copyrightTextProps}>
          {copyrightText}
        </Text>
      </Flex>

      {links.length > 0 && (
        <Flex gap="16px" align="center">
          {links.map((link) => (
            <a key={link.href} href={link.href}>
              <Text fontSize="sm" color="gray.500" {...linkTextProps}>
                {link.label}
              </Text>
            </a>
          ))}
        </Flex>
      )}
    </Flex>
  );
};

export default React.memo(Footer, (prev, next) => _.isEqual(prev, next));
