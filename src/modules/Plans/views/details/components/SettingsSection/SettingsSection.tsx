import type { FC } from 'react';
import { ModalHOC } from 'src/modules/Providers/modals/ModalHOC/ModalHOC';
import type { ProvidersPermissionStatus } from 'src/modules/Providers/utils/types/ProvidersPermissionStatus';

import {
  ProviderModelGroupVersionKind,
  type V1beta1Plan,
  type V1beta1Provider,
} from '@kubev2v/types';
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

export const SettingsSection: FC<SettingsSectionProps> = (props) => (
  <ModalHOC>
    <SettingsSectionInternal {...props} />
  </ModalHOC>
);

type SettingsSectionProps = {
  obj: V1beta1Plan;
  permissions: ProvidersPermissionStatus;
};

const SettingsSectionInternal: FC<SettingsSectionProps> = ({ obj, permissions }) => {
  const [sourceProvider] = useK8sWatchResource<V1beta1Provider>({
    groupVersionKind: ProviderModelGroupVersionKind,
    name: obj?.spec?.provider?.source?.name,
    namespace: obj?.spec?.provider?.source?.namespace,
    namespaced: true,
  });

  const [destinationProvider] = useK8sWatchResource<V1beta1Provider>({
    groupVersionKind: ProviderModelGroupVersionKind,
    name: obj?.spec?.provider?.destination?.name,
    namespace: obj?.spec?.provider?.destination?.namespace,
    namespaced: true,
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
