import type { FC } from 'react';
import { isPlanEditable } from 'src/modules/Plans/utils/helpers/getPlanPhase';
import { useModal } from 'src/modules/Providers/modals/ModalHOC/ModalHOC';
import { DetailsItem } from 'src/modules/Providers/utils/components/DetailsPage/DetailItem';
import { useForkliftTranslation } from 'src/utils/i18n';

import type { PlanDetailsItemProps } from '../../../DetailsSection/components/PlanDetailsItemProps';
import type { EnhancedPlan } from '../../utils/types';

import NetworkNameTemplateModal from './NetworkNameTemplateModal';

const NetworkNameTemplateDetailsItem: FC<PlanDetailsItemProps> = ({ canPatch, resource }) => {
  const { t } = useForkliftTranslation();
  const { showModal } = useModal();

  const plan = resource as EnhancedPlan;

  const content = plan?.spec?.networkNameTemplate
    ? t('Use custom network name template')
    : t('Use default network name template');

  const title = t('Network name template');
  const pathArray = ['spec', 'networkNameTemplate'];

  return (
    <DetailsItem
      title={title}
      content={content}
      crumbs={pathArray}
      onEdit={() => {
        showModal(<NetworkNameTemplateModal resource={resource} jsonPath={pathArray} />);
      }}
      canEdit={canPatch && isPlanEditable(resource)}
    />
  );
};

export default NetworkNameTemplateDetailsItem;
