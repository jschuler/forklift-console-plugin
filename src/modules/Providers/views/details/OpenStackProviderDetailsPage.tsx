import React from 'react';
import { useForkliftTranslation } from 'src/utils/i18n';

import { HorizontalNav } from '@openshift-console/dynamic-plugin-sdk';

import { ProviderPageHeadings } from './components';
import {
  ProviderCredentialsWrapper,
  ProviderDetailsWrapper,
  ProviderVirtualMachines,
  ProviderYAMLPageWrapper,
} from './tabs';

// OpenStackProviderDetailsPage
export const OpenStackProviderDetailsPage: React.FC<{ name: string; namespace: string }> = ({
  name,
  namespace,
}) => {
  const { t } = useForkliftTranslation();

  const pages = [
    {
      component: () => <ProviderDetailsWrapper name={name} namespace={namespace} />,
      href: '',
      name: t('Details'),
    },
    {
      component: () => <ProviderYAMLPageWrapper name={name} namespace={namespace} />,
      href: 'yaml',
      name: t('YAML'),
    },
    {
      component: () => <ProviderCredentialsWrapper name={name} namespace={namespace} />,
      href: 'credentials',
      name: t('Credentials'),
    },
    {
      component: () => <ProviderVirtualMachines name={name} namespace={namespace} />,
      href: 'vms',
      name: t('Virtual Machines'),
    },
  ];

  return (
    <>
      <ProviderPageHeadings name={name} namespace={namespace} />
      <HorizontalNav pages={pages} />
    </>
  );
};
