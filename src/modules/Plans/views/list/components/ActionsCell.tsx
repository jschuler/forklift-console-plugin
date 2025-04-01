import React from 'react';
import { PlanActionsDropdown } from 'src/modules/Plans/actions/PlanActionsDropdown';

import { Flex, FlexItem } from '@patternfly/react-core';

import { CellProps } from './CellProps';

export const ActionsCell = ({ data }: CellProps) => (
  <Flex flex={{ default: 'flex_3' }} flexWrap={{ default: 'nowrap' }}>
    <FlexItem grow={{ default: 'grow' }} />

    <FlexItem align={{ default: 'alignRight' }}>
      <PlanActionsDropdown isKebab data={data} fieldId={'actions'} fields={[]} />
    </FlexItem>
  </Flex>
);

ActionsCell.displayName = 'ActionsCell';
