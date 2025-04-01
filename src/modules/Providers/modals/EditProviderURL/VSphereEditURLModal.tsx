import React from 'react';
import { ForkliftTrans, useForkliftTranslation } from 'src/utils/i18n';

import { ProviderModel } from '@kubev2v/types';
import { ModalVariant } from '@patternfly/react-core';

import { patchProviderURL } from './utils/patchProviderURL';
import { validateEsxiURL } from '../../utils/validators/provider/vsphere/validateEsxiURL';
import { validateVCenterURL } from '../../utils/validators/provider/vsphere/validateVCenterURL';
import { EditModal } from '../EditModal/EditModal';
import { ValidationHookType } from '../EditModal/types';
import { EditProviderURLModalProps } from './EditProviderURLModal';

export const VSphereEditURLModal: React.FC<EditProviderURLModalProps> = ({
  title,
  label,
  resource: provider,
  insecureSkipVerify,
  ...props
}) => {
  const { t } = useForkliftTranslation();
  let validationHook: ValidationHookType;

  // VCenter of ESXi
  const sdkEndpoint = provider?.spec?.settings?.['sdkEndpoint'] || '';
  if (sdkEndpoint === 'esxi') {
    validationHook = validateEsxiURL;
  } else {
    validationHook = (url) => validateVCenterURL(url, insecureSkipVerify);
  }

  const ModalBody = (
    <ForkliftTrans>
      <p>URL of the vCenter API endpoint.</p>
      <br />
      <p>
        The format of the URL of the vCenter API endpoint should include a scheme, a domain name,
        path, and optionally a port. Usually the path will end with /sdk, for example:{' '}
        <strong>https://vCenter-host-example.com/sdk</strong>.
      </p>
    </ForkliftTrans>
  );

  return (
    <EditModal
      {...props}
      resource={provider}
      jsonPath={'spec.url'}
      title={title || t('Edit URL')}
      label={label || t('URL')}
      model={ProviderModel}
      variant={ModalVariant.large}
      body={ModalBody}
      helperText={t(
        'The URL of the vCenter API endpoint, for example: https://vCenter-host-example.com/sdk.',
      )}
      onConfirmHook={patchProviderURL}
      validationHook={validationHook}
    />
  );
};
