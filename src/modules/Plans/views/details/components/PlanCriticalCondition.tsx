import type { FC, PropsWithChildren, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import Linkify from 'react-linkify';
import { useHistory } from 'react-router';
import { PlanConditionType } from 'src/modules/Plans/utils/types/PlanCondition';
import { getResourceUrl } from 'src/modules/Providers/utils/helpers/getResourceUrl';
import { EMPTY_MSG } from 'src/utils/constants';
import { ForkliftTrans } from 'src/utils/i18n';

import { PlanModelRef, type V1beta1Plan, type V1beta1PlanStatusConditions } from '@kubev2v/types';
import {
  Alert,
  AlertVariant,
  Button,
  Stack,
  StackItem,
  Text,
  TextContent,
  TextVariants,
} from '@patternfly/react-core';

type PlanCriticalConditionProps = PropsWithChildren & {
  plan: V1beta1Plan;
  condition: V1beta1PlanStatusConditions;
};

const PlanCriticalCondition: FC<PlanCriticalConditionProps> = ({ children, condition, plan }) => {
  const { t } = useTranslation();
  const history = useHistory();

  const { message: conditionMessage, type } = condition;
  let troubleshootMessage: ReactNode = t(
    'To troubleshoot, check the Forklift controller pod logs.',
  );

  if (
    type === PlanConditionType.VMNetworksNotMapped ||
    type === PlanConditionType.VMStorageNotMapped ||
    type === PlanConditionType.VMMultiplePodNetworkMappings
  ) {
    const planURL = getResourceUrl({
      name: plan?.metadata?.name,
      namespace: plan?.metadata?.namespace,
      reference: PlanModelRef,
    });

    troubleshootMessage = (
      <ForkliftTrans>
        To troubleshoot, check and edit your plan{' '}
        <Button
          isInline
          variant="link"
          onClick={() => {
            history.push(`${planURL}/mappings`);
          }}
        >
          mappings
        </Button>
        .
      </ForkliftTrans>
    );
  }

  return (
    <Alert
      title={`${t('The plan is not ready')} - ${type}`}
      variant={AlertVariant.danger}
      isExpandable={
        type === PlanConditionType.VMNetworksNotMapped ||
        type === PlanConditionType.VMStorageNotMapped
      }
    >
      <Stack hasGutter>
        <TextContent className="forklift-providers-list-header__alert">
          <Text component={TextVariants.p}>
            <Linkify>{conditionMessage || EMPTY_MSG}</Linkify>
            {`${!conditionMessage.endsWith('.') ? '.' : ''} `}
            {troubleshootMessage}
          </Text>
        </TextContent>

        <StackItem>{children}</StackItem>
      </Stack>
    </Alert>
  );
};

export default PlanCriticalCondition;
