import React, { ReactNode } from 'react';
import { FormGroupWithHelpText } from 'src/components/common/FormGroupWithHelpText/FormGroupWithHelpText';
import { DetailsItem } from 'src/modules/Providers/utils/components/DetailsPage/DetailItem';

import { ProviderModelGroupVersionKind, V1beta1Provider } from '@kubev2v/types';
import { ResourceLink } from '@openshift-console/dynamic-plugin-sdk';
import { Form, FormSelect, FormSelectOption } from '@patternfly/react-core';

export const ProvidersEdit: React.FC<ProvidersEditProps> = ({
  providers,
  selectedProviderName,
  onChange,
  label,
  placeHolderLabel,
  invalidLabel,
  helpContent,
  mode,
  setMode,
}) => {
  const ProviderOption = (provider, index) => (
    <FormSelectOption
      key={provider?.metadata?.name || index}
      value={provider?.metadata?.name}
      label={provider?.metadata?.name}
    />
  );

  const targetProvider = fineProvider({ providers, name: selectedProviderName });

  const validated = targetProvider !== undefined ? 'success' : 'error';
  const hasProviders = providers?.length > 0;

  if (mode === 'edit') {
    return (
      <Form isWidthLimited>
        <FormGroupWithHelpText
          label={label}
          isRequired
          fieldId="targetProvider"
          validated={validated}
          helperTextInvalid={invalidLabel}
        >
          <FormSelect
            value={selectedProviderName}
            onChange={(e, v) => onChange(v, e)}
            id="targetProvider"
            isDisabled={!hasProviders}
            validated={validated}
          >
            {[
              <FormSelectOption
                key="placeholder"
                value={''}
                label={placeHolderLabel}
                isPlaceholder
                isDisabled
              />,
              ...providers.map(ProviderOption),
            ]}
          </FormSelect>
        </FormGroupWithHelpText>
      </Form>
    );
  } else {
    return (
      <DetailsItem
        title={label}
        content={
          <ResourceLink
            inline
            name={selectedProviderName}
            namespace={targetProvider?.metadata?.namespace}
            groupVersionKind={ProviderModelGroupVersionKind}
            linkTo={targetProvider !== undefined}
          />
        }
        onEdit={hasProviders ? () => setMode('edit') : undefined}
        helpContent={helpContent}
        crumbs={['spec', 'providers']}
      />
    );
  }
};

export type ProvidersEditProps = {
  providers: V1beta1Provider[];
  selectedProviderName: string;
  onChange: (value: string, event: React.FormEvent<HTMLSelectElement>) => void;
  label: string;
  placeHolderLabel: string;
  invalidLabel: string;
  helpContent: ReactNode;
  mode: 'edit' | 'view';
  setMode: (mode: 'edit' | 'view') => void;
};

type FindProviderFunction = (args: {
  providers: V1beta1Provider[];
  name: string;
}) => V1beta1Provider;

const fineProvider: FindProviderFunction = ({ providers, name }) =>
  providers.find((p) => p.metadata.name === name);
