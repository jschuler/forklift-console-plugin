import React from 'react';

import { ResourceField, RowProps } from '@kubev2v/common';
import { Td } from '@patternfly/react-table';

import { ConditionsCellRenderer, PlanVMsCellProps } from '../components';
import { NameCellRenderer } from '../components/NameCellRenderer';
import { VMData } from '../types';

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
};

interface RenderTdProps {
  resourceData: VMData;
  resourceFieldId: string;
  resourceFields: ResourceField[];
}
