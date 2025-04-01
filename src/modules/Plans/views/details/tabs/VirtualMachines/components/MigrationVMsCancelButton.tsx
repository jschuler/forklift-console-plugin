import React, { FC } from 'react';
import { useModal } from 'src/modules/Providers/modals/ModalHOC/ModalHOC';
import { useForkliftTranslation } from 'src/utils/i18n';

import { V1beta1Migration } from '@kubev2v/types';
import { ToolbarItem } from '@patternfly/react-core';

import { MigrationVMsCancelModal } from '../modals/MigrationVMsCancelModal';
import { VMsActionButton } from './VMsActionButton';

export const MigrationVMsCancelButton: FC<{
  selectedIds: string[];
  migration: V1beta1Migration;
}> = ({ selectedIds, migration }) => {
  const { t } = useForkliftTranslation();
  const { showModal } = useModal();
  const onClick = () => {
    showModal(<MigrationVMsCancelModal migration={migration} selected={selectedIds} />);
  };

  const reason = selectedIds?.length < 1 && t('Select at least one virtual machine.');

  return (
    <ToolbarItem>
      <VMsActionButton onClick={onClick} disabledReason={reason}>
        {t('Cancel virtual machines')}
      </VMsActionButton>
    </ToolbarItem>
  );
};
