import React, { useCallback, useReducer } from 'react';
import { Trans } from 'react-i18next';
import { validateURL, Validation } from 'src/modules/Providers/utils';
import { useForkliftTranslation } from 'src/utils/i18n';

import { ExternalLink } from '@kubev2v/common';
import { V1beta1Provider } from '@kubev2v/types';
import { Form, FormGroup, TextInput } from '@patternfly/react-core';

export interface OpenshiftProviderCreateFormProps {
  provider: V1beta1Provider;
  onChange: (newValue: V1beta1Provider) => void;
}

export const OpenshiftProviderFormCreate: React.FC<OpenshiftProviderCreateFormProps> = ({
  provider,
  onChange,
}) => {
  const { t } = useForkliftTranslation();

  const url = provider?.spec?.url || '';

  const helperTextMsgs = {
    error: (
      <span className="forklift--create-provider-field-error-validation">
        <Trans t={t} ns="plugin__forklift-console-plugin">
          {
            'Error: The format of the provided URL is invalid. Ensure the URL includes a scheme, a domain name, and optionally a port. For example: '
          }
          <ExternalLink href="https://api.<your-openshift-domain>:6443" isInline hideIcon>
            https://api.&#8249;your-openshift-domain&#8250;:6443
          </ExternalLink>
          {' .'}
        </Trans>
      </span>
    ),
    success: (
      <span className="forklift--create-provider-field-success-validation">
        <Trans t={t} ns="plugin__forklift-console-plugin">
          {
            'URL of the Openshift Virtualization API endpoint.<br>If both <strong>URL</strong> and <strong>Service account bearer token</strong> are left blank, the local OpenShift cluster is used.'
          }
        </Trans>
      </span>
    ),
    default: (
      <span className="forklift--create-provider-field-default-validation">
        <Trans t={t} ns="plugin__forklift-console-plugin">
          {
            'URL of the Openshift Virtualization API endpoint.<br>If both <strong>URL</strong> and <strong>Service account bearer token</strong> are left blank, the local OpenShift cluster is used.'
          }
        </Trans>
      </span>
    ),
  };

  const initialState = {
    validation: {
      url: 'default' as Validation,
      urlHelperText: helperTextMsgs.default,
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

      const trimmedValue: string = value.trim();
      const validationState = getURLValidationState(trimmedValue);

      dispatch({
        type: 'SET_FIELD_VALIDATED',
        payload: { field: 'url', validationState },
      });

      dispatch({
        type: 'SET_FIELD_VALIDATED',
        payload: {
          field: 'urlHelperText',
          validationState: helperTextMsgs[validationState],
        },
      });

      onChange({ ...provider, spec: { ...provider.spec, url: trimmedValue } });
    },
    [provider],
  );

  const getURLValidationState = (url: string): Validation => {
    if (url.length !== 0 && !validateURL(url)) return 'error';
    return 'success';
  };

  return (
    <Form isWidthLimited className="forklift-section-provider-edit">
      <FormGroup
        label={t('URL')}
        fieldId="url"
        validated={state.validation.url}
        helperText={state.validation.urlHelperText}
        helperTextInvalid={state.validation.urlHelperText}
      >
        <TextInput
          type="text"
          id="url"
          name="url"
          value={url}
          validated={state.validation.url}
          onChange={(value) => handleChange('url', value)}
        />
      </FormGroup>
    </Form>
  );
};
