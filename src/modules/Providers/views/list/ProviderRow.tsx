import React from 'react';
import { RowProps } from 'src/components/common/TableView/types';
import { ProviderData } from 'src/modules/Providers/utils/types/ProviderData';

import { ResourceField } from '@components/common/utils/types';
import { DatabaseIcon, NetworkIcon, OutlinedHddIcon } from '@patternfly/react-icons';
import { Td, Tr } from '@patternfly/react-table';

import { CellProps } from './components/CellProps';
import { InventoryCellFactory } from './components/InventoryCellFactory';
import { NamespaceCell } from './components/NamespaceCell';
import { ProviderLinkCell } from './components/ProviderLinkCell';
import { StatusCell } from './components/StatusCell';
import { TypeCell } from './components/TypeCell';
import { URLCell } from './components/URLCell';
import { VirtualMachinesCell } from './components/VirtualMachinesCell';
import { ProviderActionsDropdown } from '../../actions/ProviderActionsDropdown';
import { TableEmptyCell } from '../../utils/components/TableCell/TableEmptyCell';

/**
 * Function component to render a table row (Tr) for a provider with inventory.
 * Each cell (Td) in the row is rendered by the `renderTd` function.
 *
 * @param {RowProps<ProviderData>} props - The properties passed to the component.
 * @param {ResourceField[]} props.resourceFields - The fields to be displayed in the table row.
 * @param {ProviderData} props.resourceData - The data for the provider, including its inventory.
 *
 * @returns {ReactNode - A React table row (Tr) component.
 */
export const ProviderRow: React.FC<RowProps<ProviderData>> = ({ resourceFields, resourceData }) => {
  return (
    <Tr>
      {resourceFields.map(({ resourceFieldId }) =>
        renderTd({ resourceData, resourceFieldId, resourceFields }),
      )}
    </Tr>
  );
};

/**
 * Function to render a table cell (Td).
 * If the cell is an inventory cell (NETWORK_COUNT, STORAGE_COUNT, VM_COUNT, or HOST_COUNT)
 * and there's no inventory data, it won't render the cell.
 *
 * @param {RenderTdProps} props - An object holding all the parameters.
 * @param {ProviderData} props.resourceData - The data for the resource.
 * @param {string} props.resourceFieldId - The field ID for the resource.
 * @param {ResourceField[]} props.resourceFields - Array of resource fields
 *
 * @returns {ReactNode | undefined} - A React table cell (Td) component or undefined.
 */
const renderTd = ({ resourceData, resourceFieldId, resourceFields }: RenderTdProps) => {
  const fieldId = resourceFieldId;
  const hasInventory = resourceData?.inventory !== undefined;
  const inventoryCells = ['networkCount', 'storageCount', 'vmCount', 'hostCount'];

  // If the current cell is an inventory cell and there's no inventory data,
  // don't render the cell
  if (inventoryCells.includes(fieldId) && !hasInventory) {
    return <TableEmptyCell />;
  }

  const CellRenderer = cellRenderers?.[fieldId] ?? (() => <></>);
  return (
    <Td key={fieldId} dataLabel={fieldId}>
      <CellRenderer data={resourceData} fieldId={fieldId} fields={resourceFields} />
    </Td>
  );
};

const cellRenderers: Record<string, React.FC<CellProps>> = {
  ['name']: ProviderLinkCell,
  ['phase']: StatusCell,
  ['url']: URLCell,
  ['type']: TypeCell,
  ['namespace']: NamespaceCell,
  ['networkCount']: InventoryCellFactory({ icon: <NetworkIcon /> }),
  ['storageCount']: InventoryCellFactory({ icon: <DatabaseIcon /> }),
  ['vmCount']: VirtualMachinesCell,
  ['hostCount']: InventoryCellFactory({ icon: <OutlinedHddIcon /> }),
  ['actions']: (props) => ProviderActionsDropdown({ isKebab: true, ...props }),
};

interface RenderTdProps {
  resourceData: ProviderData;
  resourceFieldId: string;
  resourceFields: ResourceField[];
}

export default ProviderRow;
