import React from 'react';
import { useHistory } from 'react-router';
import { getResourceUrl } from 'src/modules/Providers/utils';
import { useForkliftTranslation } from 'src/utils/i18n';

import { NetworkMapModelRef } from '@kubev2v/types';
import { Button } from '@patternfly/react-core';

export const NetworkMapsAddButton: React.FC<{ namespace: string; dataTestId?: string }> = ({
  dataTestId,
  namespace,
}) => {
  const { t } = useForkliftTranslation();
  const history = useHistory();

  const NetworkMapsListURL = getResourceUrl({
    namespace: namespace,
    namespaced: namespace !== undefined,
    reference: NetworkMapModelRef,
  });

  const onClick = () => {
    history.push(`${NetworkMapsListURL}/~new`);
  };

  return (
    <Button data-testid={dataTestId} variant="primary" onClick={onClick}>
      {t('Create NetworkMap')}
    </Button>
  );
};

export default NetworkMapsAddButton;
