import React, { type FC } from 'react';
import { isPlanEditable } from 'src/modules/Plans/utils';
import { useModal } from 'src/modules/Providers/modals';
import { DetailsItem } from 'src/modules/Providers/utils';
import { useForkliftTranslation } from 'src/utils/i18n';

import { type PlanDetailsItemProps } from '../../../DetailsSection';
import { type EnhancedPlan } from '../../utils/types';

import VolumeNameTemplateModal from './VolumeNameTemplateModal';

const VolumeNameTemplateDetailsItem: FC<PlanDetailsItemProps> = ({ canPatch, resource }) => {
  const { t } = useForkliftTranslation();
  const { showModal } = useModal();

  const plan = resource as EnhancedPlan;

  const content = plan?.spec?.volumeNameTemplate
    ? t('Use custom volume name template')
    : t('Use default volume name template');

  const title = t('Volume name template');
  const pathArray = ['spec', 'volumeNameTemplate'];

  return (
    <DetailsItem
      title={title}
      content={content}
      crumbs={pathArray}
      onEdit={() => {
        showModal(<VolumeNameTemplateModal resource={plan} jsonPath={pathArray} />);
      }}
      canEdit={canPatch && isPlanEditable(resource)}
    />
  );
};

export default VolumeNameTemplateDetailsItem;
