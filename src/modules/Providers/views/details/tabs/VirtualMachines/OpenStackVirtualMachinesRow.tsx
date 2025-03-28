import React from 'react';
import { RowProps } from 'src/components/common/TableView/types';
import { TableCell } from 'src/modules/Providers/utils';

import { ResourceField } from '@components/common/utils/types';
import { OpenstackVM } from '@kubev2v/types';
import { Td } from '@patternfly/react-table';

import { VMCellProps, VMConcernsCellRenderer, VmData, VMNameCellRenderer } from './components';

const renderTd = ({ resourceData, resourceFieldId, resourceFields }: RenderTdProps) => {
  const fieldId = resourceFieldId;

  const CellRenderer = cellRenderers?.[fieldId] ?? (() => <></>);
  return (
    <Td key={fieldId} dataLabel={fieldId}>
      <CellRenderer data={resourceData} fieldId={fieldId} fields={resourceFields} />
    </Td>
  );
};

interface RenderTdProps {
  resourceData: VmData;
  resourceFieldId: string;
  resourceFields: ResourceField[];
}

const cellRenderers: Record<string, React.FC<VMCellProps>> = {
  concerns: VMConcernsCellRenderer,
  flavorID: ({ data }) => <TableCell>{(data?.vm as OpenstackVM)?.flavorID}</TableCell>,
  hostID: ({ data }) => <TableCell>{(data?.vm as OpenstackVM)?.hostID}</TableCell>,
  imageID: ({ data }) => <TableCell>{(data?.vm as OpenstackVM)?.imageID}</TableCell>,
  name: VMNameCellRenderer,
  path: ({ data }) => <TableCell>{(data?.vm as OpenstackVM)?.path}</TableCell>,
  status: ({ data }) => <TableCell>{(data?.vm as OpenstackVM)?.status}</TableCell>,
  tenantID: ({ data }) => <TableCell>{(data?.vm as OpenstackVM)?.tenantID}</TableCell>,
};

export const OpenStackVirtualMachinesCells: React.FC<RowProps<VmData>> = ({
  resourceData,
  resourceFields,
}) => {
  return (
    <>
      {resourceFields?.map(({ resourceFieldId }) =>
        renderTd({ resourceData, resourceFieldId, resourceFields }),
      )}
    </>
  );
};
