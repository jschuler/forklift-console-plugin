import { type ReactNode } from 'react';

import { type V1beta1Plan, type V1beta1Provider } from '@kubev2v/types';

export interface PlanDetailsItemProps {
  resource: V1beta1Plan;
  canPatch?: boolean;
  moreInfoLink?: string;
  helpContent?: ReactNode;
  destinationProvider?: V1beta1Provider;
  sourceProvider?: V1beta1Provider;
}
