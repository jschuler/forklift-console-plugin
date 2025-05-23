import React, { useCallback, useReducer } from 'react';
import { Base64 } from 'js-base64';
import { FormGroupWithHelpText } from 'src/components/common/FormGroupWithHelpText/FormGroupWithHelpText';
import { esxiSecretFieldValidator, safeBase64Decode } from 'src/modules/Providers/utils';
import { CertificateUpload } from 'src/modules/Providers/utils/components/CertificateUpload';
import { ForkliftTrans, useForkliftTranslation } from 'src/utils/i18n';

import {
  Button,
  Divider,
  Form,
  InputGroup,
  Popover,
  Switch,
  TextInput,
} from '@patternfly/react-core';
import EyeIcon from '@patternfly/react-icons/dist/esm/icons/eye-icon';
import EyeSlashIcon from '@patternfly/react-icons/dist/esm/icons/eye-slash-icon';
import HelpIcon from '@patternfly/react-icons/dist/esm/icons/help-icon';

import { EditComponentProps } from '../BaseCredentialsSection';

export const EsxiCredentialsEdit: React.FC<EditComponentProps> = ({ secret, onChange }) => {
  const { t } = useForkliftTranslation();

  const user = safeBase64Decode(secret?.data?.user);
  const password = safeBase64Decode(secret?.data?.password);
  const url = safeBase64Decode(secret?.data?.url);
  const cacert = safeBase64Decode(secret?.data?.cacert);
  const insecureSkipVerify = safeBase64Decode(secret?.data?.insecureSkipVerify);

  const insecureSkipVerifyHelperTextPopover = (
    <ForkliftTrans>
      <p>
        Select <strong>Skip certificate validation</strong> to skip certificate verification, which
        proceeds with an insecure migration and then the certificate is not required. Insecure
        migration means that the transferred data is sent over an insecure connection and
        potentially sensitive data could be exposed.
      </p>
    </ForkliftTrans>
  );

  const cacertHelperTextPopover = (
    <ForkliftTrans>
      <p>
        Use the CA certificate of the Manager unless it was replaced by a third-party certificate,
        in which case enter the Manager Apache CA certificate.
      </p>
      <p>When left empty the system CA certificate is used.</p>
      <p>
        The certificate is not verified when <strong>Skip certificate validation</strong> is set.
      </p>
    </ForkliftTrans>
  );

  const initialState = {
    passwordHidden: true,
    validation: {
      user: esxiSecretFieldValidator('user', user),
      password: esxiSecretFieldValidator('password', password),
      insecureSkipVerify: esxiSecretFieldValidator('insecureSkipVerify', insecureSkipVerify),
      cacert: esxiSecretFieldValidator('cacert', cacert),
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
      case 'TOGGLE_PASSWORD_HIDDEN':
        return { ...state, passwordHidden: !state.passwordHidden };
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  const handleChange = useCallback(
    (id, value) => {
      const validationState = esxiSecretFieldValidator(id, value);
      dispatch({ type: 'SET_FIELD_VALIDATED', payload: { field: id, validationState } });

      // don't trim fields that allow spaces
      const encodedValue = ['cacert'].includes(id)
        ? Base64.encode(value || '')
        : Base64.encode(value?.trim() || '');

      onChange({ ...secret, data: { ...secret.data, [id]: encodedValue } });
    },
    [secret, onChange],
  );

  const togglePasswordHidden = () => {
    dispatch({ type: 'TOGGLE_PASSWORD_HIDDEN' });
  };

  const onClickEventPreventDef: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void = (
    event,
  ) => {
    event.preventDefault();
  };

  const onClickTogglePassword = () => {
    togglePasswordHidden();
  };

  const onChangeUser: (value: string, event: React.FormEvent<HTMLInputElement>) => void = (
    value,
  ) => {
    handleChange('user', value);
  };

  const onChangePassword: (value: string, event: React.FormEvent<HTMLInputElement>) => void = (
    value,
  ) => {
    handleChange('password', value);
  };

  const onChangeInsecure: (checked: boolean, event: React.FormEvent<HTMLInputElement>) => void = (
    checked,
  ) => {
    handleChange('insecureSkipVerify', checked ? 'true' : 'false');
  };

  const onDataChange: (data: string) => void = (data) => {
    handleChange('cacert', data);
  };

  const onTextChange: (text: string) => void = (text) => {
    handleChange('cacert', text);
  };

  return (
    <Form isWidthLimited className="forklift-section-secret-edit">
      <FormGroupWithHelpText
        label={t('Username')}
        isRequired
        fieldId="username"
        helperText={state.validation.user.msg}
        helperTextInvalid={state.validation.user.msg}
        validated={state.validation.user.type}
      >
        <TextInput
          spellCheck="false"
          isRequired
          type="text"
          id="username"
          name="username"
          onChange={(e, v) => onChangeUser(v, e)}
          value={user}
          validated={state.validation.user.type}
        />
      </FormGroupWithHelpText>
      <FormGroupWithHelpText
        label={t('Password')}
        isRequired
        fieldId="password"
        helperText={state.validation.password.msg}
        helperTextInvalid={state.validation.password.msg}
        validated={state.validation.password.type}
      >
        <InputGroup>
          <TextInput
            spellCheck="false"
            className="pf-u-w-75"
            isRequired
            type={state.passwordHidden ? 'password' : 'text'}
            aria-label="Password input"
            onChange={(e, v) => onChangePassword(v, e)}
            value={password}
            validated={state.validation.password.type}
          />
          <Button
            variant="control"
            onClick={onClickTogglePassword}
            aria-label={state.passwordHidden ? 'Show password' : 'Hide password'}
          >
            {state.passwordHidden ? <EyeIcon /> : <EyeSlashIcon />}
          </Button>
        </InputGroup>
      </FormGroupWithHelpText>

      <Divider />

      <FormGroupWithHelpText
        label={t('Skip certificate validation')}
        labelIcon={
          <Popover
            headerContent={t('Skip certificate validation')}
            bodyContent={insecureSkipVerifyHelperTextPopover}
            alertSeverityVariant="info"
          >
            <button
              type="button"
              onClick={onClickEventPreventDef}
              className="pf-c-form__group-label-help"
            >
              <HelpIcon />
            </button>
          </Popover>
        }
        fieldId="insecureSkipVerify"
        validated={state.validation.insecureSkipVerify.type}
        helperTextInvalid={state.validation.insecureSkipVerify.msg}
      >
        <Switch
          className="forklift-section-secret-edit-switch"
          id="insecureSkipVerify"
          name="insecureSkipVerify"
          label={t('Skip certificate validation')}
          isChecked={insecureSkipVerify === 'true'}
          hasCheckIcon
          onChange={(e, v) => onChangeInsecure(v, e)}
        />
      </FormGroupWithHelpText>

      <FormGroupWithHelpText
        label={t('CA certificate')}
        labelIcon={
          <Popover
            headerContent={t('CA certificate')}
            bodyContent={cacertHelperTextPopover}
            alertSeverityVariant="info"
          >
            <button
              type="button"
              onClick={onClickEventPreventDef}
              className="pf-c-form__group-label-help"
            >
              <HelpIcon />
            </button>
          </Popover>
        }
        fieldId="cacert"
        helperText={state.validation.cacert.msg}
        helperTextInvalid={state.validation.cacert.msg}
        validated={state.validation.cacert.type}
      >
        <CertificateUpload
          id="cacert"
          url={url}
          value={cacert}
          validated={state.validation.cacert.type}
          onDataChange={(_e, v) => onDataChange(v)}
          onTextChange={(_e, v) => onTextChange(v)}
          onClearClick={() => handleChange('cacert', '')}
          isDisabled={insecureSkipVerify === 'true'}
        />
      </FormGroupWithHelpText>
    </Form>
  );
};
