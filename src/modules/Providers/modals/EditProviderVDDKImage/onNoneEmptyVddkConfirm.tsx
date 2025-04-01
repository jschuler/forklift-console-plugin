import { V1beta1Provider } from '@kubev2v/types';
import { k8sPatch } from '@openshift-console/dynamic-plugin-sdk';

import { OnConfirmHookType } from '../EditModal/types';

/**
 * Handles the confirmation action for editing a resource annotations.
 * Adds or updates the vddkInitImage settings in the resource's spec.
 *
 * @param {Object} options - Options for the confirmation action.
 * @param {Object} options.resource - The resource to be modified.
 * @param {Object} options.model - The model associated with the resource.
 * @param {any} options.newValue - The new value for the 'vddkInitImage' spec settings.
 * @returns {Promise<Object>} - The modified resource.
 */
export const onNoneEmptyVddkConfirm: OnConfirmHookType = async ({
  resource,
  model,
  newValue: value,
}) => {
  const provider = resource as V1beta1Provider;
  const vddkInitImage: string = value as string;
  let op: string;

  // Patch settings
  const currentSettings = provider?.spec?.settings as object;
  const settings = {
    ...currentSettings,
    vddkInitImage: vddkInitImage?.trim() || undefined,
  };

  op = provider?.spec?.settings ? 'replace' : 'add';

  await k8sPatch({
    model: model,
    resource: resource,
    data: [
      {
        op,
        path: '/spec/settings',
        value: Object.keys(settings).length === 0 ? undefined : settings,
      },
    ],
  });

  // Patch annotations
  const currentAnnotations = provider?.metadata?.annotations as object;
  const annotations = {
    ...currentAnnotations,
    'forklift.konveyor.io/empty-vddk-init-image': undefined,
  };

  op = provider?.spec?.settings ? 'replace' : 'add';

  const obj = await k8sPatch({
    model: model,
    resource: resource,
    data: [
      {
        op,
        path: '/metadata/annotations',
        value: Object.keys(annotations).length === 0 ? undefined : annotations,
      },
    ],
  });

  return obj;
};
