import { ProvidersPermissionStatus } from 'src/modules/Providers/utils';

import { V1beta1Plan } from '@kubev2v/types';

export interface PlanData {
  obj?: V1beta1Plan;
  permissions?: ProvidersPermissionStatus;
}
