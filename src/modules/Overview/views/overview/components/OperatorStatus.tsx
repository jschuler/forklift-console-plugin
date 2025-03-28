import React from 'react';

import { Flex, FlexItem } from '@patternfly/react-core';
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
} from '@patternfly/react-icons';

interface OperatorStatusProps {
  status: string;
}

export const statusIcons = {
  Failure: <ExclamationCircleIcon color="#C9190B" />,
  Running: <ExclamationTriangleIcon color="#F0AB00" />,
  Successful: <CheckCircleIcon color="#3E8635" />,
};

const statusLabels = {
  Failure: 'Failure',
  Running: 'Running',
  Successful: 'Successful',
};

const OperatorStatus: React.FC<OperatorStatusProps> = ({ status }) => {
  const Icon = statusIcons[status];
  const label = statusLabels[status] || 'Unknown';

  return (
    <Flex
      spaceItems={{ default: 'spaceItemsXs' }}
      display={{ default: 'inlineFlex' }}
      flexWrap={{ default: 'nowrap' }}
    >
      {Icon && <FlexItem>{Icon}</FlexItem>}
      <FlexItem>{label}</FlexItem>
    </Flex>
  );
};

export default OperatorStatus;
