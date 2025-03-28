import React from 'react';
import { TableCell } from 'src/modules/Providers/utils';

import type { VMCellProps } from './VMCellProps';

export const VMNameCellRenderer: React.FC<VMCellProps> = ({ data }) => (
  <TableCell>{data.name}</TableCell>
);
