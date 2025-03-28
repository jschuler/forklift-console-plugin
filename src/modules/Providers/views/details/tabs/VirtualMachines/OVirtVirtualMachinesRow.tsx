import React from 'react';
import { RowProps } from 'src/components/common/TableView/types';
import { TableCell } from 'src/modules/Providers/utils';

import { ResourceField } from '@components/common/utils/types';
import { OVirtVM } from '@kubev2v/types';
import { Td } from '@patternfly/react-table';

import { PowerStateCellRenderer } from './components/PowerStateCellRenderer';
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
  cluster: ({ data }) => <TableCell>{(data?.vm as OVirtVM)?.cluster}</TableCell>,
  concerns: VMConcernsCellRenderer,
  description: ({ data }) => <TableCell>{(data?.vm as OVirtVM)?.description}</TableCell>,
  host: ({ data }) => <TableCell>{(data?.vm as OVirtVM)?.host}</TableCell>,
  name: VMNameCellRenderer,
  path: ({ data }) => <TableCell>{(data?.vm as OVirtVM)?.path}</TableCell>,
  status: PowerStateCellRenderer,
};

export const OVirtVirtualMachinesCells: React.FC<RowProps<VmData>> = ({
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
