import React from 'react';

import { V1beta1ForkliftController } from '@kubev2v/types';

import { PodsCard } from './cards';

interface ForkliftControllerDetailsTabProps {
  obj: V1beta1ForkliftController;
  ns?: string;
  name?: string;
  loaded?: boolean;
  loadError?: unknown;
}

export const ForkliftControllerDetailsTab: React.FC<ForkliftControllerDetailsTabProps> = ({
  obj,
}) => {
  return (
    <div className="co-dashboard-body forklift-overview__pods-tab">
      <PodsCard obj={obj} />
    </div>
  );
};

export default ForkliftControllerDetailsTab;
