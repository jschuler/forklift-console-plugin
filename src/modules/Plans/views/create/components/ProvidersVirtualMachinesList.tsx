import type { FC } from 'react';
import type { VmData } from 'src/modules/Providers/views/details/tabs/VirtualMachines/components/VMCellProps';
import { ProviderVirtualMachinesListWrapper } from 'src/modules/Providers/views/details/tabs/VirtualMachines/ProviderVirtualMachines';
import { useInventoryVms } from 'src/modules/Providers/views/details/tabs/VirtualMachines/utils/hooks/useInventoryVms';

import { ProviderModelGroupVersionKind, type V1beta1Provider } from '@kubev2v/types';
import { useK8sWatchResource } from '@openshift-console/dynamic-plugin-sdk';

export const ProviderVirtualMachinesList: FC<{
  title: string;
  name: string;
  namespace: string;
  onSelect?: (selectedIds: VmData[]) => void;
  initialSelectedIds?: string[];
  showActions: boolean;
  className?: string;
  selectedCountLabel?: (selectedIdCount: number) => string;
}> = ({
  className,
  initialSelectedIds,
  name,
  namespace,
  onSelect,
  selectedCountLabel,
  showActions,
  title,
}) => {
  const [provider, providerLoaded, providerLoadError] = useK8sWatchResource<V1beta1Provider>({
    groupVersionKind: ProviderModelGroupVersionKind,
    name,
    namespace,
    namespaced: true,
  });

  const [vmData, vmDataLoading] = useInventoryVms({ provider }, providerLoaded, providerLoadError);
  const obj = { provider, vmData, vmDataLoading };

  return (
    <ProviderVirtualMachinesListWrapper
      title={title}
      obj={obj}
      loaded={providerLoaded}
      loadError={providerLoadError}
      onSelect={onSelect}
      initialSelectedIds={initialSelectedIds}
      showActions={showActions}
      className={className}
      selectedCountLabel={selectedCountLabel}
    />
  );
};
