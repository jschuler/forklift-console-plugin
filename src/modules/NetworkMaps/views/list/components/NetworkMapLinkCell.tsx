import React from 'react';
import { TableLinkCell } from 'src/modules/Providers/utils/components/TableCell/TableLinkCell';

import { NetworkMapModelGroupVersionKind } from '@kubev2v/types';

import { CellProps } from './CellProps';

export const NetworkMapLinkCell: React.FC<CellProps> = ({ data }) => {
  const { obj: networkMap } = data;
  const { name, namespace } = networkMap?.metadata || {};

  return (
    <TableLinkCell
      groupVersionKind={NetworkMapModelGroupVersionKind}
      name={name}
      namespace={namespace}
    />
  );
};
