import { type ProvidersPermissionStatus } from 'src/modules/Providers/utils';

import { type V1beta1Plan } from '@kubev2v/types';

export interface PlanData {
  obj?: V1beta1Plan;
  permissions?: ProvidersPermissionStatus;
}
