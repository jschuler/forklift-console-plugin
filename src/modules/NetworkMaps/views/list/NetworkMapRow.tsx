import React from 'react';
import { RowProps } from 'src/components/common/TableView/types';

import { ResourceField } from '@components/common/utils/types';
import { Td, Tr } from '@patternfly/react-table';

import { NetworkMapActionsDropdown } from '../../actions';
import { NetworkMapData } from '../../utils';
import {
  CellProps,
  NamespaceCell,
  NetworkMapLinkCell,
  PlanCell,
  ProviderLinkCell,
  StatusCell,
} from './components';

export const ProviderRow: React.FC<RowProps<NetworkMapData>> = ({
  resourceData,
  resourceFields,
}) => {
  return (
    <Tr>
      {resourceFields.map(({ resourceFieldId }) =>
        renderTd({ resourceData, resourceFieldId, resourceFields }),
      )}
    </Tr>
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

const cellRenderers: Record<string, React.FC<CellProps>> = {
  ['actions']: (props) => NetworkMapActionsDropdown({ isKebab: true, ...props }),
  ['destination']: ProviderLinkCell,
  ['name']: NetworkMapLinkCell,
  ['namespace']: NamespaceCell,
  ['owner']: PlanCell,
  ['phase']: StatusCell,
  ['source']: ProviderLinkCell,
};

interface RenderTdProps {
  resourceData: NetworkMapData;
  resourceFieldId: string;
  resourceFields: ResourceField[];
}

export default ProviderRow;
