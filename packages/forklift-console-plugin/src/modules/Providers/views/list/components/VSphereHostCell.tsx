import React from 'react';
import { Link } from 'react-router-dom-v5-compat';
import { getResourceUrl, TableEmptyCell, TableLabelCell } from 'src/modules/Providers/utils';

import { getResourceFieldValue } from 'src/components/common/FilterGroup/matchers';
import { ProviderModelRef } from '@kubev2v/types';
import { OutlinedHddIcon } from '@patternfly/react-icons';

import { CellProps } from './CellProps';

export const VSphereHostCell: React.FC<CellProps> = ({ data, fieldId, fields }: CellProps) => {
  const { provider, inventory } = data;
  const value = getResourceFieldValue({ ...provider, inventory }, fieldId, fields);
  const providerURL = getResourceUrl({
    reference: ProviderModelRef,
    name: provider?.metadata?.name,
    namespace: provider?.metadata?.namespace,
  });

  if (value === undefined) {
    return <TableEmptyCell />;
  }

  return (
    <TableLabelCell>
      <Link to={`${providerURL}/hosts`}>
        <OutlinedHddIcon /> {value}
      </Link>
    </TableLabelCell>
  );
};
