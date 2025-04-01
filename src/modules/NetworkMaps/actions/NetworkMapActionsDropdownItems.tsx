import React from 'react';
import { DropdownItemLink } from 'src/components/actions/DropdownItemLink';
import { DeleteModal } from 'src/modules/Providers/modals/DeleteModal/DeleteModal';
import { useModal } from 'src/modules/Providers/modals/ModalHOC/ModalHOC';
import { getResourceUrl } from 'src/modules/Providers/utils/helpers/getResourceUrl';
import { useForkliftTranslation } from 'src/utils/i18n';

import { NetworkMapModel, NetworkMapModelRef } from '@kubev2v/types';
import { DropdownItem } from '@patternfly/react-core';

import { NetworkMapData } from '../utils/types/NetworkMapData';

export const NetworkMapActionsDropdownItems = ({ data }: NetworkMapActionsDropdownItemsProps) => {
  const { t } = useForkliftTranslation();
  const { showModal } = useModal();

  const { obj: networkMap } = data;

  const networkMapURL = getResourceUrl({
    reference: NetworkMapModelRef,
    name: networkMap?.metadata?.name,
    namespace: networkMap?.metadata?.namespace,
  });

  const onClick = () => {
    showModal(<DeleteModal resource={networkMap} model={NetworkMapModel} />);
  };

  return [
    <DropdownItemLink
      value={0}
      key="EditNetworkMapping"
      href={networkMapURL}
      description={t('Edit NetworkMap')}
    />,

    <DropdownItem
      value={1}
      key="delete"
      isDisabled={!data?.permissions?.canDelete}
      onClick={onClick}
    >
      {t('Delete NetworkMap')}
    </DropdownItem>,
  ];
};

interface NetworkMapActionsDropdownItemsProps {
  data: NetworkMapData;
}
