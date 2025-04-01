import React from 'react';
import { DetailsItem } from 'src/modules/Providers/utils/components/DetailsPage/DetailItem';
import { useForkliftTranslation } from 'src/utils/i18n';

import { DescriptionListDescription } from '@patternfly/react-core';

import { ProviderDetailsItemProps } from './ProviderDetailsItem';

/**
 * Component for displaying the provider name details item.
 *
 * @component
 * @param {DetailsItemProps} props - The props of the details item.
 */
export const NameDetailsItem: React.FC<ProviderDetailsItemProps> = ({
  resource: provider,
  moreInfoLink,
  helpContent,
}) => {
  const { t } = useForkliftTranslation();

  const defaultMoreInfoLink =
    'https://kubernetes.io/docs/concepts/overview/working-with-objects/names';

  const defaultHelpContent = `Name is a client-provided string that refers to an object in a resource URL.
    Only one object of a given kind can have a given name at a time.
    However, if you delete the object, you can make a new object with the same name.`;

  const nameContent = provider?.metadata?.name;

  return (
    <DescriptionListDescription>
      <DetailsItem
        title={t('Name')}
        moreInfoLink={moreInfoLink ?? defaultMoreInfoLink}
        helpContent={helpContent ?? defaultHelpContent}
        crumbs={['Provider', 'metadata', 'name']}
        content={nameContent}
      />
    </DescriptionListDescription>
  );
};
