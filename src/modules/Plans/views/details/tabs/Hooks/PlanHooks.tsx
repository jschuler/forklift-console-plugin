import React, { useEffect, useReducer } from 'react';
import { Base64 } from 'js-base64';
import { FormGroupWithHelpText } from 'src/components/common/FormGroupWithHelpText/FormGroupWithHelpText';
import SectionHeading from 'src/components/headers/SectionHeading';
import { isPlanEditable } from 'src/modules/Plans/utils/helpers/getPlanPhase';
import { AlertMessageForModals } from 'src/modules/Providers/modals/components/AlertMessageForModals';
import { useForkliftTranslation } from 'src/utils/i18n';

import { CodeEditor } from '@openshift-console/dynamic-plugin-sdk';
import {
  Button,
  Divider,
  Flex,
  FlexItem,
  Form,
  HelperText,
  HelperTextItem,
  PageSection,
  Switch,
  TextInput,
} from '@patternfly/react-core';

import { usePlanHooks } from './hooks/usePlanHooks';
import { initialState } from './state/initialState';
import { formReducer } from './state/reducer';
import { onUpdatePlanHooks } from './utils/onUpdatePlanHooks';
import { Suspend } from '../../components/Suspend';

export const PlanHooks: React.FC<{ name: string; namespace: string }> = ({ name, namespace }) => {
  const { t } = useForkliftTranslation();

  const [plan, preHookResource, postHookResource, loaded, loadError, warning] = usePlanHooks(
    name,
    namespace,
  );

  const [state, dispatch] = useReducer(
    formReducer,
    initialState(plan, preHookResource, postHookResource),
  );

  // Init state on outside changes
  useEffect(() => {
    dispatch({
      type: 'INIT',
      payload: initialState(plan, preHookResource, postHookResource),
    });
  }, [plan, preHookResource, postHookResource]);

  // Handle user clicking "save"
  async function onUpdate() {
    onUpdatePlanHooks({ plan, preHookResource, postHookResource, dispatch, state });
  }

  const onClick = () => {
    dispatch({
      type: 'INIT',
      payload: initialState(plan, preHookResource, postHookResource),
    });
  };

  const buttonHelperMsg = () => {
    let updateButtonDisabledMsg = '';

    if (!isPlanEditable(plan))
      updateButtonDisabledMsg = t(
        'Button is disabled since the plan status does not enable editing.',
      );
    else if (!state.hasChanges)
      updateButtonDisabledMsg = t('Button is disabled until a change is detected.');

    return t('Click the update hooks button to save your changes.') + ' ' + updateButtonDisabledMsg;
  };

  const HooksTabAction = (
    <>
      <Flex>
        <FlexItem>
          <Button
            variant="primary"
            onClick={onUpdate}
            isDisabled={!state.hasChanges || !isPlanEditable(plan)}
            isLoading={state.isLoading}
          >
            {t('Update hooks')}
          </Button>
        </FlexItem>

        <FlexItem>
          <Button variant="secondary" isDisabled={!state.hasChanges} onClick={onClick}>
            {t('Cancel')}
          </Button>
        </FlexItem>
      </Flex>
      <HelperText className="forklift-section-plan-helper-text">
        <HelperTextItem variant="indeterminate">{buttonHelperMsg()}</HelperTextItem>
      </HelperText>

      <Divider />
    </>
  );

  const onChangePreHookSet: (checked: boolean, event: React.FormEvent<HTMLInputElement>) => void = (
    checked,
  ) => {
    dispatch({ type: 'PRE_HOOK_SET', payload: checked });
  };

  const onChangePostHookSet: (
    checked: boolean,
    event: React.FormEvent<HTMLInputElement>,
  ) => void = (checked) => {
    dispatch({ type: 'POST_HOOK_SET', payload: checked });
  };

  const onChangePreHookImage: (value: string, event: React.FormEvent<HTMLInputElement>) => void = (
    value,
  ) => {
    dispatch({ type: 'PRE_HOOK_IMAGE', payload: value });
  };

  const onChangePreHookPlaybook: (
    value: string,
    event: React.FormEvent<HTMLInputElement>,
  ) => void = (value) => {
    dispatch({ type: 'PRE_HOOK_PLAYBOOK', payload: value });
  };

  const onChangePostHookImage: (value: string, event: React.FormEvent<HTMLInputElement>) => void = (
    value,
  ) => {
    dispatch({ type: 'POST_HOOK_IMAGE', payload: value });
  };

  const onChangePostHookPlaybook: (
    value: string,
    event: React.FormEvent<HTMLInputElement>,
  ) => void = (value) => {
    dispatch({ type: 'POST_HOOK_PLAYBOOK', payload: value });
  };

  return (
    <Suspend obj={plan} loaded={loaded} loadError={loadError}>
      {state.alertMessage && <PageSection variant="light">{state.alertMessage}</PageSection>}

      {warning && (
        <PageSection
          variant="light"
          className="forklift-page-plan-details-vm-status__section-actions"
        >
          <AlertMessageForModals
            variant="warning"
            title={'The plan hooks were manually configured'}
            message={
              <>
                <p>Warning: {warning},</p>
                <p>updating the hooks will override the current configuration.</p>
              </>
            }
          />
        </PageSection>
      )}

      <PageSection
        variant="light"
        className="forklift-page-plan-details-vm-status__section-actions"
      >
        <SectionHeading text={t('Migration hook')} />
        {HooksTabAction}
      </PageSection>

      <PageSection variant="light">
        <SectionHeading text={t('Pre migration hook')} />
        <Form>
          <FormGroupWithHelpText label="Enable hook" isRequired fieldId="pre-hook-set">
            <Switch
              id="pre-hook-set"
              label="Enable pre migration hook"
              labelOff="Do not enable a pre migration hook"
              isChecked={state.preHookSet}
              isDisabled={!isPlanEditable(plan)}
              onChange={(e, v) => onChangePreHookSet(v, e)}
            />
          </FormGroupWithHelpText>

          {state.preHookSet && (
            <>
              <FormGroupWithHelpText label="Hook runner image" isRequired fieldId="pre-hook-image">
                <TextInput
                  spellCheck="false"
                  value={state.preHook?.spec?.image}
                  type="url"
                  onChange={(e, v) => onChangePreHookImage(v, e)}
                  isDisabled={!isPlanEditable(plan)}
                  aria-label="pre hook image"
                />
                <HelperText>
                  <HelperTextItem>
                    You can use a custom hook-runner image or specify a custom image, for example
                    quay.io/konveyor/hook-runner .
                  </HelperTextItem>
                </HelperText>
              </FormGroupWithHelpText>
              <FormGroupWithHelpText label="Ansible playbook" fieldId="pre-hook-image">
                <CodeEditor
                  language="yaml"
                  value={Base64.decode(state.preHook?.spec?.playbook || '')}
                  onChange={onChangePreHookPlaybook}
                  minHeight="400px"
                  showMiniMap={false}
                />
                <HelperText>
                  <HelperTextItem>
                    Optional: Ansible playbook. If you specify a playbook, the image must be
                    hook-runner.
                  </HelperTextItem>
                </HelperText>
              </FormGroupWithHelpText>
            </>
          )}
        </Form>
      </PageSection>

      <PageSection variant="light">
        <SectionHeading text={t('Post migration hook')} />
        <Form>
          <FormGroupWithHelpText label="Enable hook" isRequired fieldId="post-hook-set">
            <Switch
              id="post-hook-set"
              label="Enable post migration hook"
              labelOff="Do not enable a post migration hook"
              isChecked={state.postHookSet}
              isDisabled={!isPlanEditable(plan)}
              onChange={(e, v) => onChangePostHookSet(v, e)}
            />
          </FormGroupWithHelpText>

          {state.postHookSet && (
            <>
              <FormGroupWithHelpText label="Hook runner image" isRequired fieldId="post-hook-image">
                <TextInput
                  spellCheck="false"
                  value={state.postHook?.spec?.image}
                  type="url"
                  onChange={(e, v) => onChangePostHookImage(v, e)}
                  aria-label="post hook image"
                />
                <HelperText>
                  <HelperTextItem>
                    You can use a custom hook-runner image or specify a custom image, for example
                    quay.io/konveyor/hook-runner .
                  </HelperTextItem>
                </HelperText>
              </FormGroupWithHelpText>
              <FormGroupWithHelpText label="Ansible playbook" fieldId="post-hook-image">
                <CodeEditor
                  language="yaml"
                  value={Base64.decode(state.postHook?.spec?.playbook || '')}
                  onChange={onChangePostHookPlaybook}
                  minHeight="400px"
                  showMiniMap={false}
                />
                <HelperText>
                  <HelperTextItem>
                    Optional: Ansible playbook. If you specify a playbook, the image must be
                    hook-runner.
                  </HelperTextItem>
                </HelperText>
              </FormGroupWithHelpText>
            </>
          )}
        </Form>
      </PageSection>
    </Suspend>
  );
};
