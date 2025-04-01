import React from 'react';
import { RowProps } from 'src/components/common/TableView/types';

import { ResourceField } from '@components/common/utils/types';
import { Td } from '@patternfly/react-table';

import { ConditionsCellRenderer } from '../components/ConditionsCellRenderer';
import { NameCellRenderer } from '../components/NameCellRenderer';
import { PlanVMsCellProps } from '../components/PlanVMsCellProps';
import { VMData } from '../types/VMData';
import ActionsCell from './ActionsCell';

export const PlanVirtualMachinesRow: React.FC<RowProps<VMData>> = ({
  resourceFields,
  resourceData,
}) => {
  return (
    <>
      {resourceFields?.map(({ resourceFieldId }) =>
        renderTd({ resourceData, resourceFieldId, resourceFields }),
      )}
    </>
  );
};

const renderTd = ({ resourceData, resourceFieldId, resourceFields }: RenderTdProps) => {
  const fieldId = resourceFieldId;

  const CellRenderer = cellRenderers?.[fieldId] ?? (() => <></>);
  return (
    <Td key={fieldId} dataLabel={fieldId}>
      <CellRenderer data={resourceData} fieldId={fieldId} fields={resourceFields} />
    </Td>
  );
};

const cellRenderers: Record<string, React.FC<PlanVMsCellProps>> = {
  name: NameCellRenderer,
  conditions: ConditionsCellRenderer,
  actions: ActionsCell,
};

interface RenderTdProps {
  resourceData: VMData;
  resourceFieldId: string;
  resourceFields: ResourceField[];
}
