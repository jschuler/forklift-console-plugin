import React from 'react';
import { FilterableSelect } from 'src/components/FilterableSelect/FilterableSelect';
import { EditModal } from 'src/modules/Providers/modals/EditModal/EditModal';
import {
  EditModalProps,
  ModalInputComponentType,
  OnConfirmHookType,
} from 'src/modules/Providers/modals/EditModal/types';
import { useForkliftTranslation } from 'src/utils/i18n';

import { Modify, PlanModel, V1beta1Plan } from '@kubev2v/types';
import { K8sModel, k8sPatch } from '@openshift-console/dynamic-plugin-sdk';
import { HelperText, HelperTextItem, Text } from '@patternfly/react-core';

import { editRootDiskModalAlert } from './editRootDiskModalAlert';
import { editRootDiskModalBody } from './editRootDiskModalBody';
import { diskOptions, getRootDiskLabelByKey } from './getRootDiskLabelByKey';

const onConfirm: OnConfirmHookType = async ({ resource, model, newValue }) => {
  const plan = resource as V1beta1Plan;

  const resourceValue = plan?.spec?.vms;
  const op = resourceValue ? 'replace' : 'add';
  const newVMs = resourceValue.map((vm) => ({
    ...vm,
    rootDisk: newValue || undefined,
  }));

  const obj = await k8sPatch({
    model: model,
    resource: resource,
    data: [
      {
        op,
        path: '/spec/vms',
        value: newVMs || undefined,
      },
    ],
  });

  return obj;
};

interface DropdownRendererProps {
  value: string | number;
  onChange: (string) => void;
}

const RootDiskInputFactory: () => ModalInputComponentType = () => {
  const DropdownRenderer: React.FC<DropdownRendererProps> = ({ value, onChange }) => {
    const { t } = useForkliftTranslation();
    const options = diskOptions(t);

    const dropdownItems = options.map((option) => ({
      itemId: option.key,
      children: (
        <>
          <Text>{getRootDiskLabelByKey(option.key)}</Text>
          {option.description && (
            <HelperText>
              <HelperTextItem variant="indeterminate">{option.description}</HelperTextItem>
            </HelperText>
          )}
        </>
      ),
    }));

    return (
      <FilterableSelect
        selectOptions={dropdownItems}
        value={value as string}
        onSelect={onChange}
        canCreate
        placeholder={t('First root device')}
        createNewOptionLabel={t('Custom path:')}
      ></FilterableSelect>
    );
  };

  return DropdownRenderer;
};

export const EditRootDisk: React.FC<EditRootDiskProps> = (props) => {
  const { t } = useForkliftTranslation();

  const plan = props.resource;
  const rootDisk = plan.spec.vms?.[0]?.rootDisk;
  const allVMsHasMatchingRootDisk = plan.spec.vms.every((vm) => vm?.rootDisk === rootDisk);

  return (
    <EditModal
      {...props}
      jsonPath={(obj: V1beta1Plan) => obj?.spec?.vms?.[0]?.rootDisk}
      title={props?.title || t('Edit root device')}
      label={props?.label || t('Root device')}
      model={PlanModel}
      onConfirmHook={onConfirm}
      body={
        <>
          {editRootDiskModalBody}
          {!allVMsHasMatchingRootDisk && editRootDiskModalAlert}
        </>
      }
      InputComponent={RootDiskInputFactory()}
    />
  );
};

export type EditRootDiskProps = Modify<
  EditModalProps,
  {
    resource: V1beta1Plan;
    title?: string;
    label?: string;
    model?: K8sModel;
    jsonPath?: string | string[];
  }
>;
