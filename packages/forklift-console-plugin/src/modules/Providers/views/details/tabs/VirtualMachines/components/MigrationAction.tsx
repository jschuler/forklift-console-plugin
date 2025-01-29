import React, { FC } from 'react';
import { useHistory } from 'react-router';
import { getResourceUrl } from 'src/modules/Providers/utils';
import { useCreateVmMigrationData } from 'src/modules/Providers/views/migrate';
import { useForkliftTranslation } from 'src/utils/i18n';

import { PlanModelRef, V1beta1Provider } from '@kubev2v/types';
import { Button, ToolbarItem } from '@patternfly/react-core';

import { VmData } from './VMCellProps';

export const MigrationAction: FC<{
  selectedVms: VmData[];
  provider: V1beta1Provider;
  className?: string;
}> = ({ selectedVms, provider, className }) => {
  const { t } = useForkliftTranslation();
  const history = useHistory();
  const planListURL = getResourceUrl({
    reference: PlanModelRef,
    namespaced: false,
  });
  const { setData } = useCreateVmMigrationData();

  const onClick = () => {
    setData({ selectedVms, provider, projectName: provider?.metadata?.namespace });
    history.push(`${planListURL}/~new`);
  };

  return (
    <ToolbarItem className={className}>
      <Button variant="primary" onClick={onClick} isDisabled={!selectedVms?.length}>
        {t('Create migration plan')}
      </Button>
    </ToolbarItem>
  );
};
