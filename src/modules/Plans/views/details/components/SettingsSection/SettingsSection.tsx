import React from 'react';
import { ModalHOC } from 'src/modules/Providers/modals/ModalHOC/ModalHOC';
import { ProvidersPermissionStatus } from 'src/modules/Providers/utils/types/ProvidersPermissionStatus';

import { ProviderModelGroupVersionKind, V1beta1Plan, V1beta1Provider } from '@kubev2v/types';
import { useK8sWatchResource } from '@openshift-console/dynamic-plugin-sdk';
import { DescriptionList } from '@patternfly/react-core';

import NetworkNameTemplateDetailsItem from './components/NetworkNameTemplate/NetworkNameTemplateDetailsItem';
import { PreserveClusterCpuModelDetailsItem } from './components/PreserveClusterCpuModelDetailsItem';
import { PreserveStaticIPsDetailsItem } from './components/PreserveStaticIPsDetailsItem';
import PVCNameTemplateDetailsItem from './components/PVCNameTemplate/PVCNameTemplateDetailsItem';
import { RootDiskDetailsItem } from './components/RootDiskDetailsItem';
import { SetLUKSEncryptionPasswordsDetailsItem } from './components/SetLUKSEncryptionPasswordsDetailsItem';
import SharedDisksDetailsItem from './components/SharedDisksDetailsItem/SharedDisksDetailsItem';
import { TargetNamespaceDetailsItem } from './components/TargetNamespaceDetailsItem';
import { TransferNetworkDetailsItem } from './components/TransferNetworkDetailsItem';
import VolumeNameTemplateDetailsItem from './components/VolumeNameTemplate/VolumeNameTemplateDetailsItem';
import { WarmDetailsItem } from './components/WarmDetailsItem';

export const SettingsSection: React.FC<SettingsSectionProps> = (props) => (
  <ModalHOC>
    <SettingsSectionInternal {...props} />
  </ModalHOC>
);

export type SettingsSectionProps = {
  obj: V1beta1Plan;
  permissions: ProvidersPermissionStatus;
};

export const SettingsSectionInternal: React.FC<SettingsSectionProps> = ({ obj, permissions }) => {
  const [sourceProvider] = useK8sWatchResource<V1beta1Provider>({
    groupVersionKind: ProviderModelGroupVersionKind,
    namespaced: true,
    name: obj?.spec?.provider?.source?.name,
    namespace: obj?.spec?.provider?.source?.namespace,
  });

  const [destinationProvider] = useK8sWatchResource<V1beta1Provider>({
    groupVersionKind: ProviderModelGroupVersionKind,
    namespaced: true,
    name: obj?.spec?.provider?.destination?.name,
    namespace: obj?.spec?.provider?.destination?.namespace,
  });

  const isVsphere = sourceProvider?.spec?.type === 'vsphere';
  return (
    <>
      <DescriptionList
        columnModifier={{
          default: '2Col',
        }}
      >
        {['vsphere', 'ovirt'].includes(sourceProvider?.spec?.type) && (
          <WarmDetailsItem resource={obj} canPatch={permissions.canPatch} />
        )}

        <TransferNetworkDetailsItem
          resource={obj}
          canPatch={permissions.canPatch}
          destinationProvider={destinationProvider}
        />

        <TargetNamespaceDetailsItem
          resource={obj}
          canPatch={permissions.canPatch}
          destinationProvider={destinationProvider}
        />

        {['ovirt'].includes(sourceProvider?.spec?.type) && (
          <PreserveClusterCpuModelDetailsItem resource={obj} canPatch={permissions.canPatch} />
        )}

        {isVsphere && (
          <PreserveStaticIPsDetailsItem resource={obj} canPatch={permissions.canPatch} />
        )}

        {isVsphere && (
          <SetLUKSEncryptionPasswordsDetailsItem resource={obj} canPatch={permissions.canPatch} />
        )}

        {isVsphere && <RootDiskDetailsItem resource={obj} canPatch={permissions.canPatch} />}

        {isVsphere && <SharedDisksDetailsItem resource={obj} canPatch={permissions.canPatch} />}

        {isVsphere && <PVCNameTemplateDetailsItem resource={obj} canPatch={permissions.canPatch} />}

        {isVsphere && (
          <VolumeNameTemplateDetailsItem resource={obj} canPatch={permissions.canPatch} />
        )}

        {isVsphere && (
          <NetworkNameTemplateDetailsItem resource={obj} canPatch={permissions.canPatch} />
        )}
      </DescriptionList>
    </>
  );
};
