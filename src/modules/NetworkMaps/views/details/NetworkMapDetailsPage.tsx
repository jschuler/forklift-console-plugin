import React, { memo } from 'react';
import { useForkliftTranslation } from 'src/utils/i18n';

import { HorizontalNav, K8sModel } from '@openshift-console/dynamic-plugin-sdk';

import { NetworkMapPageHeadings } from './components/DetailsSection/components/NetworkMapPageHeadings';
import { NetworkMapDetailsTab } from './tabs/Details/NetworkMapDetailsTab';
import NetworkMapYAMLTab from './tabs/YAML/NetworkMapYAMLTab';

import './NetworkMapDetailsPage.style.css';

const NetworkMapDetailsPageInternal: React.FC<{
  name: string;
  namespace: string;
}> = ({ name, namespace }) => {
  const { t } = useForkliftTranslation();

  const pages = [
    {
      href: '',
      name: t('Details'),
      component: () => <NetworkMapDetailsTab name={name} namespace={namespace} />,
    },
    {
      href: 'yaml',
      name: t('YAML'),
      component: () => <NetworkMapYAMLTab name={name} namespace={namespace} />,
    },
  ];

  return (
    <>
      <NetworkMapPageHeadings name={name} namespace={namespace} />
      <HorizontalNav pages={pages} />
    </>
  );
};
const NetworkMapDetailsPageInternalMemo = memo(NetworkMapDetailsPageInternal);

export const NetworkMapDetailsPage: React.FC<NetworkMapDetailsPageProps> = ({
  name,
  namespace,
}) => {
  return <NetworkMapDetailsPageInternalMemo name={name} namespace={namespace} />;
};
NetworkMapDetailsPage.displayName = 'NetworkMapDetailsPage';

type NetworkMapDetailsPageProps = {
  kind: string;
  kindObj: K8sModel;
  match: { path: string; url: string; isExact: boolean; params: unknown };
  name: string;
  namespace?: string;
};

export default NetworkMapDetailsPage;
