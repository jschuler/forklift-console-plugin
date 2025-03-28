import React, { FC, useState } from 'react';
import { getValueByJsonPath } from 'src/modules/Providers';
import { EditModal } from 'src/modules/Providers/modals';

import { PlanModel } from '@kubev2v/types';

import { EnhancedPlan, SettingsEditModalProps } from '../../../utils/types';
import NameTemplateInputFactory from '../NameTemplateInput/NameTemplateInput';
import { NameTemplateRadioOptions } from '../utils/constants';
import { onConfirmNameTemplate } from '../utils/utils';

const NameTemplateModal: FC<SettingsEditModalProps> = ({
  body,
  helperText,
  jsonPath,
  resource,
  title,
}) => {
  const plan = resource as EnhancedPlan;
  const nameTemplate = getValueByJsonPath(plan, jsonPath) as string;
  const [selected, setSelected] = useState<NameTemplateRadioOptions>(
    nameTemplate
      ? NameTemplateRadioOptions.customNameTemplate
      : NameTemplateRadioOptions.defaultNameTemplate,
  );

  return (
    <EditModal
      resource={plan}
      jsonPath={jsonPath}
      title={title}
      body={body}
      model={PlanModel}
      helperText={helperText}
      onConfirmHook={onConfirmNameTemplate(selected)}
      InputComponent={NameTemplateInputFactory(selected, setSelected)}
    />
  );
};

export default NameTemplateModal;
