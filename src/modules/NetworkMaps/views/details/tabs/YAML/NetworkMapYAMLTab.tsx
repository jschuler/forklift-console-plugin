import React from 'react';
import { Suspend } from 'src/modules/Plans/views/details/components/Suspend';
import { useForkliftTranslation } from 'src/utils/i18n';

import { NetworkMapModelGroupVersionKind, V1beta1NetworkMap } from '@kubev2v/types';
import { ResourceYAMLEditor, useK8sWatchResource } from '@openshift-console/dynamic-plugin-sdk';

interface NetworkMapYAMLTabProps {
  name: string;
  namespace: string;
}

export const NetworkMapYAMLTab: React.FC<NetworkMapYAMLTabProps> = ({ name, namespace }) => {
  const { t } = useForkliftTranslation();

  const [obj, loaded, loadError] = useK8sWatchResource<V1beta1NetworkMap>({
    groupVersionKind: NetworkMapModelGroupVersionKind,
    namespaced: true,
    isList: false,
    namespace,
    name,
  });

  return (
    <Suspend obj={obj} loaded={loaded} loadError={loadError}>
      <ResourceYAMLEditor header={t('NetworkMap YAML')} initialResource={obj} />
    </Suspend>
  );
};

export default NetworkMapYAMLTab;
