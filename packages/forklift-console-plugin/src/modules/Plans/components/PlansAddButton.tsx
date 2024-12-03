import React from 'react';
import { useHistory } from 'react-router';
import { getResourceUrl } from 'src/modules/Providers/utils';
import { useCreateVmMigrationData } from 'src/modules/Providers/views/migrate';
import { useHasSufficientProviders } from 'src/utils/fetch';
import { ForkliftTrans, useForkliftTranslation } from 'src/utils/i18n';

import { PlanModelRef } from '@kubev2v/types';
import { Alert, Button } from '@patternfly/react-core';

export const PlansAddButton: React.FC<{ namespace: string; dataTestId?: string }> = ({
  namespace,
  dataTestId,
}) => {
  const { t } = useForkliftTranslation();
  const history = useHistory();
  const { setData } = useCreateVmMigrationData();
  const hasSufficientProviders = useHasSufficientProviders(namespace);

  const PlansListURL = getResourceUrl({
    reference: PlanModelRef,
    namespace: namespace,
    namespaced: namespace !== undefined,
  });

  const onClick = () => {
    setData({
      selectedVms: [],
    });
    history.push(`${PlansListURL}/~new`);
  };

  return (
    <>
      <Button
        data-testid={dataTestId}
        variant="primary"
        isAriaDisabled={!hasSufficientProviders}
        onClick={onClick}
      >
        {t('Create Plan')}
      </Button>
      {!hasSufficientProviders && (
        <Alert
          className="co-alert"
          isInline
          variant="warning"
          title={'Provider not found in namespace'}
        >
          <ForkliftTrans>No providers were found in the selected namespace.</ForkliftTrans>
        </Alert>
      )}
    </>
  );
};

export default PlansAddButton;
