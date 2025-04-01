import React from 'react';
import { DetailsItem } from 'src/modules/Providers/utils/components/DetailsPage/DetailItem';
import { useForkliftTranslation } from 'src/utils/i18n';

import { DescriptionList } from '@patternfly/react-core';

import { CreatedAtDetailsItem } from './components/CreatedAtDetailsItem';
import { CredentialsDetailsItem } from './components/CredentialsDetailsItem';
import { ExternalManagementLinkDetailsItem } from './components/ExternalManagementLinkDetailsItem';
import { NameDetailsItem } from './components/NamDetailsItem';
import { NamespaceDetailsItem } from './components/NamespaceDetailsItem';
import { OwnerDetailsItem } from './components/OwnerDetailsItem';
import { TransferNetworkDetailsItem } from './components/TransferNetworkDetailsItem';
import { TypeDetailsItem } from './components/TypeDetailsItem';
import { URLDetailsItem } from './components/URLDetailsItem';
import { getOpenshiftProviderWebUILink } from './utils/getOpenshiftProviderWebUILink';
import { DetailsSectionProps } from './DetailsSection';

export const OpenshiftDetailsSection: React.FC<DetailsSectionProps> = ({ data }) => {
  const { t } = useForkliftTranslation();

  const { provider, permissions } = data;
  const webUILink = getOpenshiftProviderWebUILink(provider);

  return (
    <DescriptionList
      columnModifier={{
        default: '2Col',
      }}
    >
      <TypeDetailsItem resource={provider} />

      {/* Avoid displaying the external web ui link for the local cluster */}
      {provider?.spec?.url ? (
        <ExternalManagementLinkDetailsItem
          resource={provider}
          canPatch={permissions.canPatch}
          webUILinkText={t(`OpenShift web console UI`)}
          webUILink={webUILink}
        />
      ) : (
        <DetailsItem title={''} content={''} />
      )}

      <NameDetailsItem resource={provider} />

      <NamespaceDetailsItem resource={provider} />

      <URLDetailsItem
        resource={provider}
        canPatch={permissions.canPatch}
        helpContent={t(
          'URL of the Openshift Virtualization API endpoint. Empty might be used for the host provider.',
        )}
      />

      <CredentialsDetailsItem resource={provider} />

      <CreatedAtDetailsItem resource={provider} />

      <TransferNetworkDetailsItem resource={provider} canPatch={permissions.canPatch} />

      <OwnerDetailsItem resource={provider} />
    </DescriptionList>
  );
};
