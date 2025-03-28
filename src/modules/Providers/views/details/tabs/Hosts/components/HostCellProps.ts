import { type ResourceField } from '@components/common/utils/types';

import { type InventoryHostPair } from '../utils';

export interface HostCellProps {
  data: InventoryHostPair;
  fieldId: string;
  fields: ResourceField[];
}
