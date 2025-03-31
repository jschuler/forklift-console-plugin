import React, { FC } from 'react';
import { Suspend } from 'src/modules/Plans/views/details/components';

import { IoK8sApiCoreV1Pod, V1beta1ForkliftController } from '@kubev2v/types';
import { useK8sWatchResource } from '@openshift-console/dynamic-plugin-sdk';

import { PodsTable } from '../../../components';

type PodsCardProps = {
  obj?: V1beta1ForkliftController;
};

export const PodsCard: FC<PodsCardProps> = ({ obj }) => {
  const [pods, loaded, loadError] = useK8sWatchResource<IoK8sApiCoreV1Pod[]>({
    kind: 'Pod',
    namespaced: true,
    isList: true,
    namespace: obj?.metadata?.namespace,
    selector: { matchLabels: { app: 'forklift' } },
  });

  return (
    <Suspend obj={pods} loaded={loaded} loadError={loadError}>
      <PodsTable pods={pods} showOwner />
    </Suspend>
  );
};

export default PodsCard;
