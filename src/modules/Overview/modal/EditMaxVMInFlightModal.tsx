import React from 'react';
import { EditModal } from 'src/modules/Providers/modals/EditModal/EditModal';
import { ModalInputComponentType } from 'src/modules/Providers/modals/EditModal/types';
import { defaultOnConfirmWithIntValue } from 'src/modules/Providers/modals/EditModal/utils/defaultOnConfirm';
import { useForkliftTranslation } from 'src/utils/i18n';

import { ForkliftControllerModel } from '@kubev2v/types';
import { ModalVariant } from '@patternfly/react-core';

import { EditSettingsModalProps } from './EditSettingsModalProps';
import SettingsNumberInput from './SettingsNumberInput';

/**
 * MaxVMInFlightNumberInput component.
 * Wraps the SettingsNumberInput component with pre-defined default value.
 *
 * @param {ModalInputComponentProps} props - Properties passed to the component
 * @returns {JSX.Element}
 */
const MaxVMInFlightNumberInput: ModalInputComponentType = (props) => {
  return <SettingsNumberInput {...props} />;
};

export const EditMaxVMInFlightModal: React.FC<EditSettingsModalProps> = (props) => {
  const { t } = useForkliftTranslation();

  // Set default value to 20
  const resource = props.resource;
  resource.spec['controller_max_vm_inflight'] = resource.spec['controller_max_vm_inflight'] || 20;

  return (
    <EditModal
      {...props}
      resource={resource}
      jsonPath={'spec.controller_max_vm_inflight'}
      title={props?.title || t('Edit Maximum concurrent VM migrations')}
      label={props?.label || t('Maximum concurrent VM or disk migrations')}
      model={ForkliftControllerModel}
      variant={ModalVariant.small}
      body={t('Maximum number of concurrent VM or disk migrations. Default value is 20.')}
      helperText={t(
        'Please enter the maximum number of concurrent VM or disk migrations, if empty default value will be used.',
      )}
      InputComponent={MaxVMInFlightNumberInput}
      onConfirmHook={defaultOnConfirmWithIntValue}
    />
  );
};
