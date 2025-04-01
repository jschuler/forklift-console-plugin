import React, { useCallback, useReducer } from 'react';
import { FormGroupWithHelpText } from 'src/components/common/FormGroupWithHelpText/FormGroupWithHelpText';
import { validateOvirtURL } from 'src/modules/Providers/utils/validators/provider/ovirt/validateOvirtURL';
import { useForkliftTranslation } from 'src/utils/i18n';

import { V1beta1Provider } from '@kubev2v/types';
import { Form, TextInput } from '@patternfly/react-core';

export interface OvirtProviderCreateFormProps {
  provider: V1beta1Provider;
  onChange: (newValue: V1beta1Provider) => void;
}

export const OvirtProviderCreateForm: React.FC<OvirtProviderCreateFormProps> = ({
  provider,
  onChange,
}) => {
  const { t } = useForkliftTranslation();

  const url = provider?.spec?.url;

  const initialState = {
    validation: {
      url: validateOvirtURL(url),
    },
  };

  const reducer = (state, action) => {
    switch (action.type) {
      case 'SET_FIELD_VALIDATED':
        return {
          ...state,
          validation: {
            ...state.validation,
            [action.payload.field]: action.payload.validationState,
          },
        };
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  const handleChange = useCallback(
    (id, value) => {
      if (id !== 'url') return;

      const trimmedValue: string = value?.trim();
      const validationState = validateOvirtURL(trimmedValue);

      dispatch({
        type: 'SET_FIELD_VALIDATED',
        payload: { field: 'url', validationState },
      });

      onChange({ ...provider, spec: { ...provider.spec, url: trimmedValue } });
    },
    [provider],
  );

  const onChangeUrl: (value: string, event: React.FormEvent<HTMLInputElement>) => void = (
    value,
  ) => {
    handleChange('url', value);
  };

  return (
    <Form isWidthLimited className="forklift-section-provider-edit">
      <FormGroupWithHelpText
        label={t('URL')}
        isRequired
        fieldId="url"
        validated={state.validation.url.type}
        helperText={state.validation.url.msg}
        helperTextInvalid={state.validation.url.msg}
      >
        <TextInput
          spellCheck="false"
          isRequired
          type="text"
          id="url"
          name="url"
          value={url || ''}
          validated={state.validation.url.type}
          onChange={(e, v) => onChangeUrl(v, e)}
        />
      </FormGroupWithHelpText>
    </Form>
  );
};
