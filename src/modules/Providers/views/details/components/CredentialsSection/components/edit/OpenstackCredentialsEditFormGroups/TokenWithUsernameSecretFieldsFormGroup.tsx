import { type FC, type FormEvent, useCallback, useReducer } from 'react';
import { Base64 } from 'js-base64';
import { FormGroupWithHelpText } from 'src/components/common/FormGroupWithHelpText/FormGroupWithHelpText';
import { safeBase64Decode } from 'src/modules/Providers/utils/helpers/safeBase64Decode';
import { openstackSecretFieldValidator } from 'src/modules/Providers/utils/validators/provider/openstack/openstackSecretFieldValidator';
import { useForkliftTranslation } from 'src/utils/i18n';

import { Button, InputGroup, TextInput } from '@patternfly/react-core';
import EyeIcon from '@patternfly/react-icons/dist/esm/icons/eye-icon';
import EyeSlashIcon from '@patternfly/react-icons/dist/esm/icons/eye-slash-icon';

import type { EditComponentProps } from '../../BaseCredentialsSection';

import { OpenstackSecretFieldId } from './constants';

export const TokenWithUsernameSecretFieldsFormGroup: FC<EditComponentProps> = ({
  onChange,
  secret,
}) => {
  const { t } = useForkliftTranslation();

  const token = safeBase64Decode(secret?.data?.token);
  const username = safeBase64Decode(secret?.data?.username);
  const regionName = safeBase64Decode(secret?.data?.regionName);
  const projectName = safeBase64Decode(secret?.data?.projectName);
  const domainName = safeBase64Decode(secret?.data?.domainName);

  const initialState = {
    passwordHidden: true,
    validation: {
      domainName: openstackSecretFieldValidator(OpenstackSecretFieldId.DomainName, domainName),
      projectName: openstackSecretFieldValidator(OpenstackSecretFieldId.ProjectName, projectName),
      regionName: openstackSecretFieldValidator(OpenstackSecretFieldId.RegionName, regionName),
      token: openstackSecretFieldValidator(OpenstackSecretFieldId.Token, token),
      username: openstackSecretFieldValidator(OpenstackSecretFieldId.Username, username),
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
      const validationState = openstackSecretFieldValidator(id, value);
      dispatch({ payload: { field: id, validationState }, type: 'SET_FIELD_VALIDATED' });

      const encodedValue = Base64.encode(value?.trim() || '');
      onChange({ ...secret, data: { ...secret.data, [id]: encodedValue } });
    },
    [secret, onChange],
  );

  const togglePasswordHidden = () => {
    dispatch({ type: 'TOGGLE_PASSWORD_HIDDEN' });
  };

  type onChangeFactoryType = (
    changedField: string,
  ) => (value: string, event: FormEvent<HTMLInputElement>) => void;

  const onChangeFactory: onChangeFactoryType = (changedField) => (value) => {
    handleChange(changedField, value);
  };

  return (
    <>
      <FormGroupWithHelpText
        label={t('Token')}
        isRequired
        fieldId={OpenstackSecretFieldId.Token}
        helperText={state.validation.token.msg}
        helperTextInvalid={state.validation.token.msg}
        validated={state.validation.token.type}
      >
        <InputGroup>
          <TextInput
            spellCheck="false"
            className="pf-u-w-75"
            isRequired
            type={state.passwordHidden ? 'password' : 'text'}
            id={OpenstackSecretFieldId.Token}
            name={OpenstackSecretFieldId.Token}
            value={token}
            onChange={(event, value) => {
              onChangeFactory(OpenstackSecretFieldId.Token)(value, event);
            }}
            validated={state.validation.token.type}
          />
          <Button
            variant="control"
            onClick={togglePasswordHidden}
            aria-label={state.passwordHidden ? 'Show password' : 'Hide password'}
          >
            {state.passwordHidden ? <EyeIcon /> : <EyeSlashIcon />}
          </Button>
        </InputGroup>
      </FormGroupWithHelpText>

      <FormGroupWithHelpText
        label={t('Username')}
        isRequired
        fieldId={OpenstackSecretFieldId.Username}
        helperText={state.validation.username.msg}
        helperTextInvalid={state.validation.username.msg}
        validated={state.validation.username.type}
      >
        <TextInput
          spellCheck="false"
          isRequired
          type="text"
          id={OpenstackSecretFieldId.Username}
          name={OpenstackSecretFieldId.Username}
          value={username}
          onChange={(e, value) => {
            onChangeFactory(OpenstackSecretFieldId.Username)(value, e);
          }}
          validated={state.validation.username.type}
        />
      </FormGroupWithHelpText>

      <FormGroupWithHelpText
        label={t('Region')}
        isRequired
        fieldId={OpenstackSecretFieldId.RegionName}
        helperText={state.validation.regionName.msg}
        helperTextInvalid={state.validation.regionName.msg}
        validated={state.validation.regionName.type}
      >
        <TextInput
          spellCheck="false"
          isRequired
          type="text"
          id={OpenstackSecretFieldId.RegionName}
          name={OpenstackSecretFieldId.RegionName}
          value={regionName}
          onChange={(event, value) => {
            onChangeFactory(OpenstackSecretFieldId.RegionName)(value, event);
          }}
          validated={state.validation.regionName.type}
        />
      </FormGroupWithHelpText>

      <FormGroupWithHelpText
        label={t('Project')}
        isRequired
        fieldId={OpenstackSecretFieldId.ProjectName}
        helperText={state.validation.projectName.msg}
        helperTextInvalid={state.validation.projectName.msg}
        validated={state.validation.projectName.type}
      >
        <TextInput
          spellCheck="false"
          isRequired
          type="text"
          id={OpenstackSecretFieldId.ProjectName}
          name={OpenstackSecretFieldId.ProjectName}
          value={projectName}
          onChange={(event, value) => {
            onChangeFactory(OpenstackSecretFieldId.ProjectName)(value, event);
          }}
          validated={state.validation.projectName.type}
        />
      </FormGroupWithHelpText>

      <FormGroupWithHelpText
        label={t('Domain name')}
        isRequired
        fieldId={OpenstackSecretFieldId.DomainName}
        helperText={state.validation.domainName.msg}
        helperTextInvalid={state.validation.domainName.msg}
        validated={state.validation.domainName.type}
      >
        <TextInput
          spellCheck="false"
          isRequired
          type="text"
          id={OpenstackSecretFieldId.DomainName}
          name={OpenstackSecretFieldId.DomainName}
          value={domainName}
          onChange={(event, value) => {
            onChangeFactory(OpenstackSecretFieldId.DomainName)(value, event);
          }}
          validated={state.validation.domainName.type}
        />
      </FormGroupWithHelpText>
    </>
  );
};
