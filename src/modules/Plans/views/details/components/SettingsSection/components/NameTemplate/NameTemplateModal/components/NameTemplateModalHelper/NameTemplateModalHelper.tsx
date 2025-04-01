import React, { FC } from 'react';
import { useForkliftTranslation } from 'src/utils/i18n';

import { Stack, StackItem } from '@patternfly/react-core';

type NameTemplateModalHelperProps = {
  examples: string[];
};

const NameTemplateModalHelper: FC<NameTemplateModalHelperProps> = ({ examples }) => {
  const { t } = useForkliftTranslation();
  return (
    <Stack>
      <StackItem>{t('Examples:')}</StackItem>
      {examples.map((example) => (
        <StackItem key={example}>{example}</StackItem>
      ))}
    </Stack>
  );
};

export default NameTemplateModalHelper;
