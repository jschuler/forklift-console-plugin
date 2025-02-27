import React from 'react';
import { EditProviderUIModal, useModal } from 'src/modules/Providers/modals';
import { ForkliftTrans, useForkliftTranslation } from 'src/utils/i18n';

import { ExternalLink } from '@kubev2v/common';
import { DescriptionListDescription } from '@patternfly/react-core';

import { DetailsItem } from '../../../../../utils';

import { ProviderDetailsItemProps } from './ProviderDetailsItem';

/**
 * @typedef {Object} ExternalManagementLinkDetailsItemProps - extends ProviderDetailsItemProps
 *
 * @property {string} [webUILinkText - A label text to be displayed as a content.
 * @property {string} [webUILink] - provider's management system external link.
 */
interface ExternalManagementLinkDetailsItemProps extends ProviderDetailsItemProps {
  webUILinkText?: string;
  webUILink?: string;
}

/**
 * Component for displaying the provider management system external link.
 *
 * @component
 * @param {DetailsItemProps} props - The props of the details item.
 */
export const ExternalManagementLinkDetailsItem: React.FC<
  ExternalManagementLinkDetailsItemProps
> = ({ resource: provider, moreInfoLink, helpContent, canPatch, webUILinkText, webUILink }) => {
  const { t } = useForkliftTranslation();
  const { showModal } = useModal();

  const defaultHelpContent = (
    <ForkliftTrans>
      <p>Use the external web UI link to access the provider virtual machine management system.</p>
      <p>You can edit and store the link to the management system to customize the link URL.</p>
    </ForkliftTrans>
  );

  const webUILinkContent = webUILink ? (
    <ExternalLink text={webUILinkText} href={webUILink} isInline={true}>
      {webUILink}
    </ExternalLink>
  ) : (
    <span className="text-muted">
      {canPatch && provider?.metadata
        ? t('Click the pencil for setting provider web UI link')
        : t('No value for provider web UI link')}
    </span>
  );

  return (
    <DescriptionListDescription>
      <DetailsItem
        title={t('External web UI link')}
        moreInfoLink={moreInfoLink}
        helpContent={helpContent ?? defaultHelpContent}
        crumbs={['metadata', 'annotations', 'forklift.konveyor.io/providerUI']}
        content={webUILinkContent}
        onEdit={
          canPatch &&
          provider?.metadata &&
          (() => showModal(<EditProviderUIModal resource={provider} content={webUILink} />))
        }
      />
    </DescriptionListDescription>
  );
};
