import React from 'react';
import { SectionHeading } from 'src/components/headers/SectionHeading';
import { Suspend } from 'src/modules/Plans/views/details/components/Suspend';
import { useForkliftTranslation } from 'src/utils/i18n';

import { NetworkMapModelGroupVersionKind, V1beta1NetworkMap } from '@kubev2v/types';
import { useK8sWatchResource } from '@openshift-console/dynamic-plugin-sdk';
import { PageSection } from '@patternfly/react-core';

import { ConditionsSection } from '../../components/ConditionsSection/ConditionsSection';
import { DetailsSection } from '../../components/DetailsSection/DetailsSection';
import { MapsSection } from '../../components/MapsSection/MapsSection';
import { ProvidersSection } from '../../components/ProvidersSection/ProvidersSection';

interface NetworkMapDetailsTabProps {
  name: string;
  namespace: string;
}

export const NetworkMapDetailsTab: React.FC<NetworkMapDetailsTabProps> = ({ name, namespace }) => {
  const { t } = useForkliftTranslation();

  const [obj, loaded, loadError] = useK8sWatchResource<V1beta1NetworkMap>({
    groupVersionKind: NetworkMapModelGroupVersionKind,
    namespaced: true,
    isList: false,
    namespace,
    name,
  });

  return (
    <Suspend obj={obj} loaded={loaded} loadError={loadError}>
      <PageSection variant="light" className="forklift-page-section--details">
        <SectionHeading text={t('NetworkMap details')} />
        <DetailsSection obj={obj} />
      </PageSection>

      <PageSection variant="light" className="forklift-page-section">
        <SectionHeading text={t('Providers')} />
        <ProvidersSection obj={obj} />
      </PageSection>

      <PageSection variant="light" className="forklift-page-section">
        <SectionHeading text={t('Map')} />
        <MapsSection obj={obj} />
      </PageSection>

      <PageSection variant="light" className="forklift-page-section">
        <SectionHeading text={t('Conditions')} />
        <ConditionsSection conditions={obj?.status?.conditions} />
      </PageSection>
    </Suspend>
  );
};
