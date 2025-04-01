import React from 'react';
import { ForkliftTrans, useForkliftTranslation } from 'src/utils/i18n';

import { ProviderModel } from '@kubev2v/types';
import { ModalVariant } from '@patternfly/react-core';

import { patchProviderUI } from './utils/patchProviderUI';
import { validateOpenstackUILink } from '../../utils/validators/provider/openstack/validateOpenstackUILink';
import { EditModal } from '../EditModal/EditModal';
import { EditProviderUIModalProps } from './EditProviderUIModal';

export const OpenstackEditUIModal: React.FC<EditProviderUIModalProps> = (props) => {
  const { t } = useForkliftTranslation();

  const ModalBody = (
    <ForkliftTrans>
      <p>Link for the OpenStack dashboard UI.</p>
      <p>
        Use this link to access the user interface for the provider&apos;s virtualization
        management.
      </p>
      <p>If no link value is specify then a default auto calculated or an empty value is set.</p>
    </ForkliftTrans>
  );

  return (
    <EditModal
      {...props}
      jsonPath={['metadata', 'annotations', 'forklift.konveyor.io/providerUI']}
      title={props?.title || t('Edit provider web UI link')}
      label={props?.label || t('Provider web UI link')}
      model={ProviderModel}
      variant={ModalVariant.large}
      body={ModalBody}
      helperText={t(
        'Link for the OpenStack dashboard. For example, https://identity_service.com/dashboard.',
      )}
      onConfirmHook={patchProviderUI}
      validationHook={validateOpenstackUILink}
    />
  );
};
