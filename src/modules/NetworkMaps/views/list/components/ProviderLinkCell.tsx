import React from 'react';
import { TableLinkCell } from 'src/modules/Providers/utils';

import { ProviderModelGroupVersionKind } from '@kubev2v/types';

import type { CellProps } from './CellProps';

export const ProviderLinkCell: React.FC<CellProps> = ({ data, fieldId }) => {
  const provider = data.obj?.spec?.provider?.[fieldId];
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
