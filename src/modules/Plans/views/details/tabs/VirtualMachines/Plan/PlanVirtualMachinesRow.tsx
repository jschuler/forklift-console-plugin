import React from 'react';
import { RowProps } from 'src/components/common/TableView/types';

import { ResourceField } from '@components/common/utils/types';
import { Td } from '@patternfly/react-table';

import { ConditionsCellRenderer, PlanVMsCellProps } from '../components';
import { NameCellRenderer } from '../components/NameCellRenderer';
import { VMData } from '../types';
import ActionsCell from './ActionsCell';

export const PlanVirtualMachinesRow: React.FC<RowProps<VMData>> = ({
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
  actions: ActionsCell,
  conditions: ConditionsCellRenderer,
  name: NameCellRenderer,
};

interface RenderTdProps {
  resourceData: VMData;
  resourceFieldId: string;
  resourceFields: ResourceField[];
}
