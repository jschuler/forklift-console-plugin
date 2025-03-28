import React, { useReducer } from 'react';
import { useHistory } from 'react-router';
import { Base64 } from 'js-base64';
import SectionHeading from 'src/components/headers/SectionHeading';
import { Namespace } from 'src/utils/constants';
import { useForkliftTranslation } from 'src/utils/i18n';
import { getDefaultNamespace } from 'src/utils/namespaces';

import { type IoK8sApiCoreV1Secret, ProviderModelRef, type V1beta1Provider } from '@kubev2v/types';
import { useActiveNamespace } from '@openshift-console/dynamic-plugin-sdk';
import {
  Alert,
  Button,
  Divider,
  Flex,
  FlexItem,
  HelperText,
  HelperTextItem,
  PageSection,
} from '@patternfly/react-core';

import { useK8sWatchProviderNames, useToggle } from '../../hooks';
import { getResourceUrl, type ValidationMsg } from '../../utils';
import { providerAndSecretValidator } from '../../utils/validators/provider/providerAndSecretValidator';

import { ProvidersCreateForm } from './components';
import { providerTemplate, secretTemplate } from './templates';
import { createProvider, createProviderSecret, patchProviderSecretOwner } from './utils';

import './ProvidersCreatePage.style.css';

type ProvidersCreatePageState = {
  newSecret: IoK8sApiCoreV1Secret;
  newProvider: V1beta1Provider;
  projectName: string;
  validationError: ValidationMsg;
  apiError: Error | null;
};

export const ProvidersCreatePage: React.FC<{
  namespace: string;
}> = ({ namespace }) => {
  const { t } = useForkliftTranslation();
  const history = useHistory();
  const [isLoading, toggleIsLoading] = useToggle();
  const [activeNamespace, setActiveNamespace] = useActiveNamespace();
  const [providerNames] = useK8sWatchProviderNames({ namespace });
  const defaultNamespace = getDefaultNamespace();
  const projectName =
    activeNamespace === Namespace.AllProjects ? defaultNamespace : activeNamespace;
  const initialNamespace = namespace || projectName || defaultNamespace;

  const initialState: ProvidersCreatePageState = {
    apiError: null,
    newProvider: {
      ...providerTemplate,
      metadata: {
        ...providerTemplate.metadata,
        namespace: initialNamespace,
      },
    },
    newSecret: {
      ...secretTemplate,
      metadata: {
        ...secretTemplate.metadata,
        namespace: initialNamespace,
      },
    },
    projectName,
    validationError: { msg: 'Missing provider name', type: 'error' },
  };

  function reducer(
    state: ProvidersCreatePageState,
    action: { type: string; payload?: string | IoK8sApiCoreV1Secret | V1beta1Provider },
  ): ProvidersCreatePageState {
    switch (action.type) {
      case 'SET_NEW_SECRET': {
        const value = action.payload as V1beta1Provider;
        let validationError = providerAndSecretValidator(state.newProvider, value);

        if (!state.newProvider?.metadata?.name) {
          validationError = { msg: 'Missing provider name', type: 'error' };
        }

        if (providerNames.includes(state.newProvider?.metadata?.name)) {
          validationError = { msg: 'Provider name is not unique', type: 'error' };
        }

        return {
          ...state,
          apiError: null,
          newSecret: value,
          validationError,
        };
      }
      case 'SET_NEW_PROVIDER': {
        const value = action.payload as V1beta1Provider;
        let validationError = providerAndSecretValidator(value, state.newSecret);

        if (!value?.metadata?.name) {
          validationError = { msg: 'Missing provider name', type: 'error' };
        }

        if (providerNames.includes(value?.metadata?.name)) {
          validationError = { msg: 'Provider name is not unique', type: 'error' };
        }

        // Sync secret with new URL
        const updatedSecret = {
          ...state.newSecret,
          data: { ...state.newSecret.data, url: Base64.encode(value?.spec?.url || '') },
        };

        return {
          ...state,
          apiError: null,
          newProvider: value,
          newSecret: updatedSecret,
          validationError,
        };
      }
      case 'SET_PROJECT_NAME': {
        const value = action.payload;
        let validationError: ValidationMsg = { type: 'default' };

        if (!value) {
          validationError = { msg: 'Missing project name', type: 'error' };
        }

        return {
          ...state,
          apiError: null,
          projectName: String(value),
          validationError,
        };
      }
      case 'SET_API_ERROR': {
        const value = action.payload as Error | null;
        return { ...state, apiError: value };
      }
      default:
        return state;
    }
  }

  const [state, dispatch] = useReducer(reducer, initialState);

  if (!state.newSecret) {
    return <span className="text-muted">{t('No credentials found.')}</span>;
  }

  // Handle user edits
  function onNewSecretChange(newValue: IoK8sApiCoreV1Secret) {
    // Update staged secret with new value
    dispatch({ payload: newValue, type: 'SET_NEW_SECRET' });
  }

  // Handle user edits
  function onNewProviderChange(newValue: V1beta1Provider) {
    // Update staged provider with new value
    dispatch({ payload: newValue, type: 'SET_NEW_PROVIDER' });
  }

  // Handle user clicking "save"
  async function onUpdate() {
    let secret: IoK8sApiCoreV1Secret;
    let provider: V1beta1Provider;

    toggleIsLoading();

    // Try to generate a secret with data
    //
    // Add generateName using provider name as prefix
    // Add createdForProviderType label
    // Add url
    try {
      secret = await createProviderSecret(state.newProvider, state.newSecret);
    } catch (err) {
      dispatch({
        payload: err,
        type: 'SET_API_ERROR',
      });

      toggleIsLoading();
      return;
    }

    // Try to create a provider with secret
    // Add spec.secret
    try {
      provider = await createProvider(
        {
          ...state.newProvider,
          ...(state.projectName && {
            metadata: { ...state.newProvider.metadata, namespace: state.projectName },
          }),
        },
        secret,
      );
    } catch (err) {
      dispatch({
        payload: err,
        type: 'SET_API_ERROR',
      });

      toggleIsLoading();
      return;
    }

    // Set secret ownership using provider uid
    try {
      await patchProviderSecretOwner(provider, secret);
    } catch (err) {
      dispatch({
        payload: err,
        type: 'SET_API_ERROR',
      });

      toggleIsLoading();
      return;
    }

    // Go to providers derails page
    const providerURL = getResourceUrl({
      name: provider.metadata.name,
      namespace: provider.metadata.namespace,
      reference: ProviderModelRef,
    });

    history.push(providerURL);
  }

  const providersListURL = getResourceUrl({
    namespace,
    reference: ProviderModelRef,
  });

  const onClick = () => {
    history.push(providersListURL);
  };

  return (
    <div>
      <PageSection variant="light">
        <SectionHeading text={t('Create Provider')} />

        <HelperText className="forklift-create-subtitle">
          <HelperTextItem variant="default">
            {t(
              'Create Providers by using the form below. Provider CRs store attributes that enable MTV to connect to and interact with the source and target providers.',
            )}
          </HelperTextItem>
        </HelperText>

        {state.apiError && (
          <Alert
            className="co-alert co-alert--margin-top"
            isInline
            variant="danger"
            title={t('Error')}
          >
            {state.apiError.message || state.apiError.toString()}
          </Alert>
        )}

        <ProvidersCreateForm
          newProvider={state.newProvider}
          newSecret={state.newSecret}
          projectName={state.projectName}
          onNewProviderChange={onNewProviderChange}
          onNewSecretChange={onNewSecretChange}
          onProjectNameChange={(value) => {
            dispatch({ payload: value, type: 'SET_PROJECT_NAME' });
          }}
          providerNames={providerNames}
        />

        <Divider className="forklift-section-create-deviser" />

        <Flex>
          <FlexItem>
            <Button
              variant="primary"
              onClick={() => {
                setActiveNamespace(state.projectName);
                onUpdate();
              }}
              isDisabled={state.validationError.type === 'error'}
              isLoading={isLoading}
            >
              {t('Create provider')}
            </Button>
          </FlexItem>
          <FlexItem>
            <Button onClick={onClick} variant="secondary">
              {t('Cancel')}
            </Button>
          </FlexItem>
        </Flex>

        <HelperText className="forklift-create-subtitle-errors">
          {state.validationError.type === 'error' && state?.newProvider?.spec?.type ? (
            <HelperTextItem variant="indeterminate">{state.validationError.msg}</HelperTextItem>
          ) : (
            <HelperTextItem variant="indeterminate">{t('Create new provider')}</HelperTextItem>
          )}
        </HelperText>
      </PageSection>
    </div>
  );
};

export default ProvidersCreatePage;
