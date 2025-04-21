import { type FC, type FormEvent, useCallback, useReducer } from 'react';
import { FormGroupWithHelpText } from 'src/components/common/FormGroupWithHelpText/FormGroupWithHelpText';
import { validateOpenshiftURL } from 'src/modules/Providers/utils/validators/provider/openshift/validateOpenshiftURL';
import { useForkliftTranslation } from 'src/utils/i18n';

import type { V1beta1Provider } from '@kubev2v/types';
import { Form, TextInput } from '@patternfly/react-core';

type OpenshiftProviderCreateFormProps = {
  provider: V1beta1Provider;
  onChange: (newValue: V1beta1Provider) => void;
};

export const OpenshiftProviderFormCreate: FC<OpenshiftProviderCreateFormProps> = ({
  onChange,
  provider,
}) => {
  const { t } = useForkliftTranslation();

  const url = provider?.spec?.url;

  const initialState = {
    validation: {
      url: validateOpenshiftURL(url),
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

      const trimmedUrl: string = value?.toString().trim();
      const validationState = validateOpenshiftURL(trimmedUrl);

      dispatch({
        payload: { field: 'url', validationState },
        type: 'SET_FIELD_VALIDATED',
      });

      onChange({ ...provider, spec: { ...provider.spec, url: trimmedUrl } });
    },
    [provider],
  );

  const onChangeUrl: (value: string, event: FormEvent<HTMLInputElement>) => void = (value) => {
    handleChange('url', value);
  };

  return (
    <Form isWidthLimited className="forklift-section-provider-edit">
      <FormGroupWithHelpText
        label={t('URL')}
        fieldId="url"
        validated={state.validation.url.type}
        helperText={state.validation.url.msg}
        helperTextInvalid={state.validation.url.msg}
      >
        <TextInput
          spellCheck="false"
          type="text"
          id="url"
          name="url"
          value={url}
          validated={state.validation.url.type}
          onChange={(e, value) => {
            onChangeUrl(value, e);
          }}
        />
      </FormGroupWithHelpText>
    </Form>
  );
};
