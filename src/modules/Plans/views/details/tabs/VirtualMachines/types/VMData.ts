import {
  type IoK8sApiBatchV1Job,
  type IoK8sApiCoreV1PersistentVolumeClaim,
  type IoK8sApiCoreV1Pod,
  type V1beta1DataVolume,
  type V1beta1PlanSpecVms,
  type V1beta1PlanStatusConditions,
  type V1beta1PlanStatusMigrationVms,
} from '@kubev2v/types';

import { type PlanData } from './PlanData';

export type VMData = {
  specVM: V1beta1PlanSpecVms;
  statusVM?: V1beta1PlanStatusMigrationVms;
  pods: IoK8sApiCoreV1Pod[];
  jobs: IoK8sApiBatchV1Job[];
  pvcs: IoK8sApiCoreV1PersistentVolumeClaim[];
  dvs: V1beta1DataVolume[];
  conditions?: V1beta1PlanStatusConditions[];
  targetNamespace: string;
  planData?: PlanData;
  vmIndex?: number;
};
