import { k8sPatch } from '@openshift-console/dynamic-plugin-sdk';

import { OnConfirmHookType } from '../../EditModal/types';

/**
 * Handles the confirmation action for editing a resource annotations.
 * Adds or updates the 'forklift.konveyor.io/providerUI' annotation in the resource's metadata.
 *
 * @param {Object} options - Options for the confirmation action.
 * @param {Object} options.resource - The resource to be modified.
 * @param {Object} options.model - The model associated with the resource.
 * @param {any} options.newValue - The new value for the 'forklift.konveyor.io/providerUI' annotation.
 * @returns {Promise<Object>} - The modified resource.
 */
export const patchProviderUI: OnConfirmHookType = async ({ resource, model, newValue: value }) => {
  const currentAnnotations = resource?.metadata?.annotations;
  const newAnnotations = {
    ...currentAnnotations,
    'forklift.konveyor.io/providerUI': value || undefined,
  };

  const op = resource?.metadata?.annotations ? 'replace' : 'add';

  const obj = await k8sPatch({
    model: model,
    resource: resource,
    data: [
      {
        op,
        path: '/metadata/annotations',
        value: newAnnotations,
      },
    ],
  });

  return obj;
};
