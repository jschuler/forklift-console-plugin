import React from 'react';
import { TableLinkCell } from 'src/modules/Providers/utils';

import { CellProps } from './CellProps';

/**
 * NamespaceCell component, used for displaying a link cell with information about the namespace.
 * @param {CellProps} props - The props for the component.
 * @returns {JSX.Element} - The rendered component.
 */
export const NamespaceCell: React.FC<CellProps> = ({ data }) => {
  const { obj } = data;
  const { namespace } = obj?.metadata || {};

  return (
    <TableLinkCell
      groupVersionKind={{ kind: 'Namespace', version: 'v1' }}
      name={namespace}
      namespace={namespace}
    />
  );
};
