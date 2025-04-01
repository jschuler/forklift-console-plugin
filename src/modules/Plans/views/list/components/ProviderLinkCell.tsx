import React from 'react';
import { TableLinkCell } from 'src/modules/Providers/utils/components/TableCell/TableLinkCell';

import { ProviderModelGroupVersionKind } from '@kubev2v/types';

import { CellProps } from './CellProps';

export const ProviderLinkCell: React.FC<CellProps> = ({ data, fieldId }) => {
  const provider = data.plan?.spec?.provider?.[fieldId];
  const { name, namespace } = provider || {};

  if (!provider) {
    return <>-</>;
  }

  return (
    <TableLinkCell
      groupVersionKind={ProviderModelGroupVersionKind}
      name={name}
      namespace={namespace}
    />
  );
};
