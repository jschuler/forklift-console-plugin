import React from 'react';
import Linkify from 'react-linkify';

import { Flex, FlexItem } from '@patternfly/react-core';

type TextWithIconProps = {
  label: string;
  icon: React.ReactNode;
  className?: string;
};

export const TextWithIcon: React.FC<TextWithIconProps> = ({ label, icon, className }) => {
  return (
    <Flex
      spaceItems={{ default: 'spaceItemsXs' }}
      display={{ default: 'inlineFlex' }}
      flexWrap={{ default: 'nowrap' }}
    >
      {icon ? <FlexItem>{icon}</FlexItem> : ''}
      <FlexItem className={className}>
        <Linkify>{label}</Linkify>
      </FlexItem>
    </Flex>
  );
};
