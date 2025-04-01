import React, { useCallback, useReducer } from 'react';
import { Base64 } from 'js-base64';
import { FormGroupWithHelpText } from 'src/components/common/FormGroupWithHelpText/FormGroupWithHelpText';
import { safeBase64Decode } from 'src/modules/Providers/utils/helpers/safeBase64Decode';
import { openstackSecretFieldValidator } from 'src/modules/Providers/utils/validators/provider/openstack/openstackSecretFieldValidator';
import { useForkliftTranslation } from 'src/utils/i18n';

import { Button, InputGroup, TextInput } from '@patternfly/react-core';
import EyeIcon from '@patternfly/react-icons/dist/esm/icons/eye-icon';
import EyeSlashIcon from '@patternfly/react-icons/dist/esm/icons/eye-slash-icon';

import { EditComponentProps } from '../../BaseCredentialsSection';
import { OpenstackSecretFieldId } from './constants';

export const TokenWithUserIDSecretFieldsFormGroup: React.FC<EditComponentProps> = ({
  secret,
  onChange,
}) => {
  const { t } = useForkliftTranslation();

  const token = safeBase64Decode(secret?.data?.token);
  const userID = safeBase64Decode(secret?.data?.userID);
  const projectID = safeBase64Decode(secret?.data?.projectID);
  const regionName = safeBase64Decode(secret?.data?.regionName);

  const initialState = {
    passwordHidden: true,
    validation: {
      token: openstackSecretFieldValidator(OpenstackSecretFieldId.Token, token),
      userID: openstackSecretFieldValidator(OpenstackSecretFieldId.UserId, userID),
      projectID: openstackSecretFieldValidator(OpenstackSecretFieldId.ProjectId, projectID),
      regionName: openstackSecretFieldValidator(OpenstackSecretFieldId.RegionName, regionName),
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
      dispatch({ type: 'SET_FIELD_VALIDATED', payload: { field: id, validationState } });

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
  ) => (value: string, event: React.FormEvent<HTMLInputElement>) => void;

  const onChangeFactory: onChangeFactoryType = (changedField) => (value) =>
    handleChange(changedField, value);

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
            onChange={(e, v) => onChangeFactory(OpenstackSecretFieldId.Token)(v, e)}
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
        label={t('User ID')}
        isRequired
        fieldId={OpenstackSecretFieldId.UserId}
        helperText={state.validation.userID.msg}
        helperTextInvalid={state.validation.userID.msg}
        validated={state.validation.userID.type}
      >
        <TextInput
          spellCheck="false"
          isRequired
          type="text"
          id={OpenstackSecretFieldId.UserId}
          name={OpenstackSecretFieldId.UserId}
          value={userID}
          onChange={(e, v) => onChangeFactory(OpenstackSecretFieldId.UserId)(v, e)}
          validated={state.validation.userID.type}
        />
      </FormGroupWithHelpText>

      <FormGroupWithHelpText
        label={t('Project ID')}
        isRequired
        fieldId={OpenstackSecretFieldId.ProjectId}
        helperText={state.validation.projectID.msg}
        helperTextInvalid={state.validation.projectID.msg}
        validated={state.validation.projectID.type}
      >
        <TextInput
          spellCheck="false"
          isRequired
          type="text"
          id={OpenstackSecretFieldId.ProjectId}
          name={OpenstackSecretFieldId.ProjectId}
          value={projectID}
          onChange={(e, v) => onChangeFactory(OpenstackSecretFieldId.ProjectId)(v, e)}
          validated={state.validation.projectID.type}
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
          onChange={(e, v) => onChangeFactory(OpenstackSecretFieldId.RegionName)(v, e)}
          validated={state.validation.regionName.type}
        />
      </FormGroupWithHelpText>
    </>
  );
};
