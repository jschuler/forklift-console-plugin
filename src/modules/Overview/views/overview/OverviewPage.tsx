import React from 'react';
import { InventoryNotReachable } from 'src/modules/Providers/views/list/components';
import { useForkliftTranslation } from 'src/utils/i18n';

import { HorizontalNav, type K8sModel } from '@openshift-console/dynamic-plugin-sdk';
import { PageSection } from '@patternfly/react-core';

import OperatorStatus from './components/OperatorStatus';
import { ShowWelcomeCardButton } from './components/ShowWelcomeCardButton';
import { useK8sWatchForkliftController, useProvidersInventoryIsLive } from '../../hooks';
import { getOperatorPhase } from '../../utils/helpers/getOperatorPhase';
import { HeaderTitle } from './components';
import {
  ForkliftControllerDetailsTab,
  ForkliftControllerMetricsTab,
  ForkliftControllerYAMLTab,
} from './tabs';

import './OverviewPage.style.css';

export const OverviewPage: React.FC<OverviewPageProps> = () => {
  const { t } = useForkliftTranslation();

  const pages = [
    {
      component: ForkliftControllerDetailsTabWrapper,
      href: '',
      name: t('Overview'),
    },
    {
      component: ForkliftControllerYAMLTabWrapper,
      href: 'yaml',
      name: t('YAML'),
    },
    {
      component: ForkliftControllerMetricsTabWrapper,
      href: 'metrics',
      name: t('Metrics'),
    },
  ];

  return (
    <>
      <HeaderTitleWrapper />
      <HorizontalNav pages={pages.filter((p) => p)} />
    </>
  );
};
OverviewPage.displayName = 'OverviewPage';

type OverviewPageProps = {
  kind: string;
  kindObj: K8sModel;
  match: { path: string; url: string; isExact: boolean; params: unknown };
  name: string;
  namespace?: string;
};

const HeaderTitleWrapper: React.FC = () => {
  const [forkliftController] = useK8sWatchForkliftController();
  const { loadError: inventoryLivelinessError } = useProvidersInventoryIsLive({});

  const { t } = useForkliftTranslation();

  const phaseObj = getOperatorPhase(forkliftController);

  return (
    <>
      <HeaderTitle
        title={t('Migration Toolkit for Virtualization')}
        status={<OperatorStatus status={phaseObj.phase} />}
        badge={<ShowWelcomeCardButton />}
      />
      {inventoryLivelinessError && (
        <PageSection variant="light">
          {[<InventoryNotReachable key={'inventoryNotReachable'} />]}
        </PageSection>
      )}
    </>
  );
};

const ForkliftControllerDetailsTabWrapper: React.FC = () => {
  const [forkliftController, loaded, loadError] = useK8sWatchForkliftController();

  return (
    <ForkliftControllerDetailsTab obj={forkliftController} loaded={loaded} loadError={loadError} />
  );
};

const ForkliftControllerYAMLTabWrapper: React.FC = () => {
  const [forkliftController, loaded, loadError] = useK8sWatchForkliftController();

  return (
    <ForkliftControllerYAMLTab obj={forkliftController} loaded={loaded} loadError={loadError} />
  );
};

const ForkliftControllerMetricsTabWrapper: React.FC = () => {
  const [forkliftController, loaded, loadError] = useK8sWatchForkliftController();

  return (
    <ForkliftControllerMetricsTab obj={forkliftController} loaded={loaded} loadError={loadError} />
  );
};

export default OverviewPage;
