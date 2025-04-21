import { type FC, type FormEvent, type MouseEvent, useCallback, useReducer } from 'react';
import { FormGroupWithHelpText } from 'src/components/common/FormGroupWithHelpText/FormGroupWithHelpText';
import {
  VDDKHelperText,
  VDDKHelperTextShort,
} from 'src/modules/Providers/utils/components/VDDKHelperText/VDDKHelperText';
import { validateEsxiURL } from 'src/modules/Providers/utils/validators/provider/vsphere/validateEsxiURL';
import { validateVDDKImage } from 'src/modules/Providers/utils/validators/provider/vsphere/validateVDDKImage';
import { useForkliftTranslation } from 'src/utils/i18n';

import type { V1beta1Provider } from '@kubev2v/types';
import { Alert, Checkbox, Form, Popover, Radio, TextInput } from '@patternfly/react-core';
import HelpIcon from '@patternfly/react-icons/dist/esm/icons/help-icon';
type EsxiProviderCreateFormProps = {
  provider: V1beta1Provider;
  onChange: (newValue: V1beta1Provider) => void;
};

export const EsxiProviderCreateForm: FC<EsxiProviderCreateFormProps> = ({ onChange, provider }) => {
  const { t } = useForkliftTranslation();

  const url = provider?.spec?.url;
  const emptyVddkInitImage =
    provider?.metadata?.annotations?.['forklift.konveyor.io/empty-vddk-init-image'];
  const vddkInitImage = provider?.spec?.settings?.vddkInitImage;
  const sdkEndpoint = provider?.spec?.settings?.sdkEndpoint;

  const initialState = {
    validation: {
      url: validateEsxiURL(url),
      vddkInitImage: validateVDDKImage(vddkInitImage),
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
      const trimmedValue = value?.trim();

      if (id === 'emptyVddkInitImage') {
        const validationState = validateVDDKImage(undefined);

        dispatch({
          payload: { field: 'vddkInitImage', validationState },
          type: 'SET_FIELD_VALIDATED',
        });

        onChange({
          ...provider,
          metadata: {
            ...provider?.metadata,
            annotations: {
              ...(provider?.metadata?.annotations as object),
              'forklift.konveyor.io/empty-vddk-init-image': trimmedValue || undefined,
            },
          },
          spec: {
            ...provider?.spec,
            settings: {
              ...provider?.spec?.settings,
              vddkInitImage: '',
            },
          },
        });
      }

      if (id === 'vddkInitImage') {
        const validationState = validateVDDKImage(trimmedValue);

        dispatch({
          payload: { field: 'vddkInitImage', validationState },
          type: 'SET_FIELD_VALIDATED',
        });

        onChange({
          ...provider,
          spec: {
            ...provider?.spec,
            settings: {
              ...(provider?.spec?.settings as object),
              vddkInitImage: trimmedValue,
            },
          },
        });
      }

      if (id === 'sdkEndpoint') {
        const sdkEndpoint = trimmedValue || undefined;

        onChange({
          ...provider,
          spec: {
            ...provider?.spec,
            settings: {
              ...(provider?.spec?.settings as object),
              sdkEndpoint,
            },
          },
        });
      }

      if (id === 'url') {
        // Validate URL - VCenter of ESXi
        const validationState = validateEsxiURL(trimmedValue);

        dispatch({ payload: { field: 'url', validationState }, type: 'SET_FIELD_VALIDATED' });

        onChange({ ...provider, spec: { ...provider.spec, url: trimmedValue } });
      }
    },
    [provider],
  );

  const onClick: (event: MouseEvent<HTMLButtonElement>) => void = (event) => {
    event.preventDefault();
  };

  const onChangeUrl: (value: string, event: FormEvent<HTMLInputElement>) => void = (value) => {
    handleChange('url', value);
  };

  const onChangEmptyVddk: (checked: boolean, event: FormEvent<HTMLInputElement>) => void = (
    checked,
  ) => {
    handleChange('emptyVddkInitImage', checked ? 'yes' : undefined);
  };

  const onChangeVddk: (value: string, event: FormEvent<HTMLInputElement>) => void = (value) => {
    handleChange('vddkInitImage', value);
  };

  return (
    <Form isWidthLimited className="forklift-section-provider-edit">
      <FormGroupWithHelpText
        role="radiogroup"
        fieldId="sdkEndpoint"
        label={t('Endpoint type')}
        helperText={t('Select vSphere provider endpoint type.')}
      >
        <Radio
          name="sdkEndpoint"
          label="vCenter"
          id="sdkEndpoint-vcenter"
          isChecked={!sdkEndpoint || sdkEndpoint === 'vcenter'}
          onChange={() => {
            handleChange('sdkEndpoint', 'vcenter');
          }}
        />
        <Radio
          name="sdkEndpoint"
          label="ESXi"
          id="sdkEndpoint-esxi"
          isChecked={sdkEndpoint === 'esxi'}
          onChange={() => {
            handleChange('sdkEndpoint', 'esxi');
          }}
        />
      </FormGroupWithHelpText>

      <FormGroupWithHelpText
        label={t('URL')}
        isRequired
        fieldId="url"
        helperText={state.validation.url.msg}
        helperTextInvalid={state.validation.url.msg}
        validated={state.validation.url.type}
      >
        <TextInput
          spellCheck="false"
          isRequired
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

      <FormGroupWithHelpText
        label={t('VDDK init image')}
        fieldId="vddkInitImage"
        helperText={state.validation.vddkInitImage.msg}
        helperTextInvalid={state.validation.vddkInitImage.msg}
        validated={emptyVddkInitImage === 'yes' ? 'default' : state.validation.vddkInitImage.type}
        labelIcon={
          <Popover
            headerContent={t('VDDK init image')}
            bodyContent={VDDKHelperText}
            alertSeverityVariant="info"
          >
            <button type="button" onClick={onClick} className="pf-c-form__group-label-help">
              <HelpIcon />
            </button>
          </Popover>
        }
      >
        <Alert variant="warning" isInline title={<VDDKHelperTextShort />}>
          <Checkbox
            className="forklift-section-provider-edit-vddk-checkbox"
            label={t(
              'Skip VMware Virtual Disk Development Kit (VDDK) SDK acceleration (not recommended).',
            )}
            isChecked={emptyVddkInitImage === 'yes'}
            onChange={(e, value) => {
              onChangEmptyVddk(value, e);
            }}
            id="emptyVddkInitImage"
            name="emptyVddkInitImage"
          />
        </Alert>
        <div className="forklift-section-provider-edit-vddk-input">
          <TextInput
            spellCheck="false"
            type="text"
            id="vddkInitImage"
            name="vddkInitImage"
            isDisabled={emptyVddkInitImage === 'yes'}
            value={emptyVddkInitImage === 'yes' ? '' : vddkInitImage}
            validated={
              emptyVddkInitImage === 'yes' ? 'default' : state.validation.vddkInitImage.type
            }
            onChange={(e, value) => {
              onChangeVddk(value, e);
            }}
          />
        </div>
      </FormGroupWithHelpText>
    </Form>
  );
};
