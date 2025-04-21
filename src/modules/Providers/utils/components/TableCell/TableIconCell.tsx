import type { FC, ReactNode } from 'react';

import { TableLabelCell, type TableLabelCellProps } from './TableLabelCell';

/**
 * A component that displays a table cell, with an optional icon.
 *
 * @param {TableIconCellProps} props - The props for the component.
 * @returns {ReactElement} The rendered TableLinkCell component.
 */
export const TableIconCell: FC<TableIconCellProps> = ({
  children,
  hasLabel = false,
  icon,
  label,
  labelColor = 'grey',
}) => {
  return (
    <TableLabelCell hasLabel={hasLabel} label={label} labelColor={labelColor}>
      {icon}
      {children}
    </TableLabelCell>
  );
};

type TableIconCellProps = {
  icon?: ReactNode;
} & TableLabelCellProps;
