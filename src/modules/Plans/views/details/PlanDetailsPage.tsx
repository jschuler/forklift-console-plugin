import React, { memo } from 'react';
import { ModalHOC } from 'src/modules/Providers/modals/ModalHOC/ModalHOC';
import { useForkliftTranslation } from 'src/utils/i18n';

import { HorizontalNav, K8sModel } from '@openshift-console/dynamic-plugin-sdk';

import { PlanPageHeadings } from './components/PlanPageHeadings';
import { PlanDetails } from './tabs/Details/PlanDetails';
import { PlanHooks } from './tabs/Hooks/PlanHooks';
import { PlanMappings } from './tabs/Mappings/PlanMappings';
import { PlanResources } from './tabs/Resources/PlanResources';
import { PlanVirtualMachines } from './tabs/VirtualMachines/PlanVirtualMachines';
import { PlanYAML } from './tabs/YAML/PlanYAML';

import './PlanDetailsPage.style.css';

export type PlanDetailsPageProps = {
  kind: string;
  kindObj: K8sModel;
  match: { path: string; url: string; isExact: boolean; params: unknown };
  name: string;
  namespace?: string;
};

const PlanDetailsPage_: React.FC<{ name: string; namespace: string }> = ({ name, namespace }) => {
  const { t } = useForkliftTranslation();

  const pages = [
    {
      href: '',
      name: t('Details'),
      component: () => <PlanDetails name={name} namespace={namespace} />,
    },
    {
      href: 'yaml',
      name: t('YAML'),
      component: () => <PlanYAML name={name} namespace={namespace} />,
    },
    {
      href: 'vms',
      name: t('Virtual Machines'),
      component: () => <PlanVirtualMachines name={name} namespace={namespace} />,
    },
    {
      href: 'resources',
      name: t('Resources'),
      component: () => <PlanResources name={name} namespace={namespace} />,
    },
    {
      href: 'mappings',
      name: t('Mappings'),
      component: () => <PlanMappings name={name} namespace={namespace} />,
    },
    {
      href: 'hooks',
      name: t('Hooks'),
      component: () => <PlanHooks name={name} namespace={namespace} />,
    },
  ];

  return (
    <ModalHOC>
      <PlanPageHeadings name={name} namespace={namespace} />
      <HorizontalNav pages={pages} />
    </ModalHOC>
  );
};

export const PlanDetailsPage = memo(PlanDetailsPage_);

export default PlanDetailsPage;
