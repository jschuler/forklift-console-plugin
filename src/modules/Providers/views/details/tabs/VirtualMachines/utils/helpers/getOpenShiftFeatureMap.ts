import { type VmFeatures } from 'src/utils/types';

import { type ProviderVirtualMachine, type V1DomainSpec } from '@kubev2v/types';

export const getOpenShiftFeatureMap = (vm: ProviderVirtualMachine): VmFeatures => {
  if (vm.providerType !== 'openshift') {
    return {};
  }
  const domain: V1DomainSpec = vm.object?.spec?.template?.spec?.domain;
  if (!domain) {
    return {};
  }

  return {
    dedicatedCpu: !!domain?.cpu?.dedicatedCpuPlacement,
    gpusHostDevices: !!domain.devices?.gpus?.length || !!domain?.devices?.hostDevices?.length,
    numa: !!domain.cpu?.numa,
    persistentTpmEfi:
      !!domain?.devices?.tpm?.persistent || domain?.firmware?.bootloader?.efi?.persistent,
  };
};
