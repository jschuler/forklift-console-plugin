import React, { FC } from 'react';
import { useHistory } from 'react-router';
import { getResourceUrl } from 'src/modules/Providers/utils/helpers/getResourceUrl';
import { useCreateVmMigrationData } from 'src/modules/Providers/views/migrate/ProvidersCreateVmMigrationContext';
import { useHasSufficientProviders } from 'src/utils/fetch';
import { useForkliftTranslation } from 'src/utils/i18n';

import { PlanModelRef } from '@kubev2v/types';
import { Button, Tooltip } from '@patternfly/react-core';

type PlansAddButtonProps = {
  namespace?: string;
  dataTestId?: string;
};

export const PlansAddButton: FC<PlansAddButtonProps> = ({ namespace, dataTestId }) => {
  const { t } = useForkliftTranslation();
  const history = useHistory();
  const { setData } = useCreateVmMigrationData();
  const hasSufficientProviders = useHasSufficientProviders(namespace);

  const plansListURL = getResourceUrl({
    reference: PlanModelRef,
    namespace,
    namespaced: namespace !== undefined,
  });

  const onClick = () => {
    setData({
      selectedVms: [],
    });
    history.push(`${plansListURL}/~new`);
  };

  const button = (
    <Button
      data-testid={dataTestId}
      variant="primary"
      isAriaDisabled={!hasSufficientProviders}
      onClick={onClick}
    >
      {t('Create Plan')}
    </Button>
  );

  return !hasSufficientProviders ? (
    <Tooltip
      content={
        namespace
          ? t(
              'At least one source and one target provider in the {{name}} project must be available.',
              { name: namespace },
            )
          : t('At least one source and one target provider must be available.')
      }
    >
      {button}
    </Tooltip>
  ) : (
    button
  );
};

export default PlansAddButton;
