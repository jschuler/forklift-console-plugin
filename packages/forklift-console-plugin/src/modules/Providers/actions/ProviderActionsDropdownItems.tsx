import React from 'react';
import { DropdownItemLink } from 'src/components/actions/DropdownItemLink';
import { useForkliftTranslation } from 'src/utils/i18n';

import { ProviderModel, ProviderModelRef } from '@kubev2v/types';
import { DropdownItem } from '@patternfly/react-core';

import { DeleteModal, useModal } from '../modals';
import { getResourceUrl, ProviderData } from '../utils';

export const ProviderActionsDropdownItems = ({ data }: ProviderActionsDropdownItemsProps) => {
  const { t } = useForkliftTranslation();
  const { showModal } = useModal();

  const { provider } = data;

  const providerURL = getResourceUrl({
    reference: ProviderModelRef,
    name: provider?.metadata?.name,
    namespace: provider?.metadata?.namespace,
  });

  const onClick = () => {
    showModal(<DeleteModal resource={provider} model={ProviderModel} />);
  };

  const dropdownItems = [
    <DropdownItemLink
      value={0}
      key="EditProvider"
      href={providerURL}
      description={t('Edit Provider')}
    />,

    <DropdownItemLink
      value={1}
      key="EditCredentials"
      href={`${providerURL}/credentials`}
      description={t('Edit Provider Credentials')}
    />,

    <DropdownItemLink
      value={2}
      key="MigratePlan"
      href={`${providerURL}/vms`}
      description={t('Migrate')}
    />,

    <DropdownItem
      value={3}
      key="delete"
      isDisabled={!data?.permissions?.canDelete}
      onClick={onClick}
    >
      {t('Delete Provider')}
    </DropdownItem>,
  ];

  // excluding the EditCredentials options since not supported for OVA
  const ovaDropdownItems = dropdownItems.filter((item) => item.key !== 'EditCredentials');

  return provider?.spec?.type === 'ova' ? ovaDropdownItems : dropdownItems;
};

interface ProviderActionsDropdownItemsProps {
  data: ProviderData;
}
