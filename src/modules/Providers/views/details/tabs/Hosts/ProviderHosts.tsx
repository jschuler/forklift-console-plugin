import React from 'react';
import { useGetDeleteAndEditAccessReview } from 'src/modules/Providers/hooks';
import { ModalHOC } from 'src/modules/Providers/modals';
import { type ProviderData } from 'src/modules/Providers/utils';

import { ProviderModel, ProviderModelGroupVersionKind, type V1beta1Provider } from '@kubev2v/types';
import { useK8sWatchResource } from '@openshift-console/dynamic-plugin-sdk';

import { VSphereHostsList } from './VSphereHostsList';

export type ProviderHostsProps = {
  obj: ProviderData;
  ns?: string;
  name?: string;
  loaded?: boolean;
  loadError?: unknown;
}

const ProviderHosts_: React.FC<ProviderHostsProps> = (props) => {
  const { provider } = props.obj;

  switch (provider?.spec?.type) {
    case 'vsphere':
      return <VSphereHostsList {...props} />;
    default:
      return <></>;
  }
};

export const ProviderHosts: React.FC<ProviderHostsProps> = (props) => (
  <ModalHOC>
    <ProviderHosts_ {...props} />
  </ModalHOC>
);

export const ProviderHostsWrapper: React.FC<{ name: string; namespace: string }> = ({
  name,
  namespace,
}) => {
  const [provider, providerLoaded, providerLoadError] = useK8sWatchResource<V1beta1Provider>({
    groupVersionKind: ProviderModelGroupVersionKind,
    name,
    namespace,
    namespaced: true,
  });

  const permissions = useGetDeleteAndEditAccessReview({ model: ProviderModel, namespace });

  const data = { permissions, provider };

  return <ProviderHosts obj={data} loaded={providerLoaded} loadError={providerLoadError} />;
};
