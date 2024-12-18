import React from 'react';
import { usePlanMigration } from 'src/modules/Plans/hooks';
import { PlanStartMigrationModal } from 'src/modules/Plans/modals';
import {
  getMigrationVmsCounts,
  getPlanPhase,
  isPlanArchived,
  isPlanExecuting,
  PlanPhase,
} from 'src/modules/Plans/utils';
import { useModal } from 'src/modules/Providers/modals';
import { getResourceUrl } from 'src/modules/Providers/utils';
import { useForkliftTranslation } from 'src/utils/i18n';

import { PlanModel, PlanModelRef } from '@kubev2v/types';
import { Button, Flex, FlexItem, Label, Spinner, Split, SplitItem } from '@patternfly/react-core';
import StartIcon from '@patternfly/react-icons/dist/esm/icons/play-icon';

import { CellProps } from './CellProps';
import { PlanStatusVmCount } from './PlanStatusVmCount';

type VmPipelineTask = {
  vmName: string;
  task: string;
  status: string;
};

export const PlanStatusCell: React.FC<CellProps> = ({ data }) => {
  const { t } = useForkliftTranslation();
  const { showModal } = useModal();
  const plan = data?.obj;

  const vms = plan?.spec?.vms;
  const vmStatuses = plan?.status?.migration?.vms;
  const [lastMigration] = usePlanMigration(plan);

  const isWarmAndExecuting = plan.spec?.warm && isPlanExecuting(plan);
  const isWaitingForCutover = isWarmAndExecuting && !isPlanArchived(plan);

  const vmPipelineTasks = lastMigration?.status.vms?.reduce(
    (acc: VmPipelineTask[], migrationVm) => {
      migrationVm.pipeline.forEach((pipelineStep) => {
        acc.push({ vmName: migrationVm.name, task: pipelineStep.name, status: pipelineStep.phase });
      });

      return acc;
    },
    [],
  );

  const phase = getPlanPhase(data);
  const isPlanLoading =
    !isWaitingForCutover && (phase === PlanPhase.Running || phase === PlanPhase.Archiving);
  const planURL = getResourceUrl({
    reference: PlanModelRef,
    name: plan?.metadata?.name,
    namespace: plan?.metadata?.namespace,
  });

  // All VM count links point to the same place for now,
  // but will be updated to target only affected VMs in the future.
  // Could possibly use a querystring to dictate a table filter for the list of VMs.
  const vmCountLinkPath = `${planURL}/vms`;

  if (phase === PlanPhase.Ready) {
    return (
      <Button
        variant="secondary"
        icon={<StartIcon />}
        onClick={() =>
          showModal(
            <PlanStartMigrationModal resource={plan} model={PlanModel} title={t('Start')} />,
          )
        }
      >
        {t('Start')}
      </Button>
    );
  }

  const vmCount = getMigrationVmsCounts(vmStatuses);
  const completedVmPipelineTasks = vmPipelineTasks?.filter(
    (pipelineTask) => pipelineTask.status === 'Completed',
  );
  const progressValue = vmPipelineTasks?.length
    ? (100 * completedVmPipelineTasks.length) / vmPipelineTasks.length
    : 0;

  return (
    <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
      {isPlanLoading ? (
        <Spinner size="md" />
      ) : phase === PlanPhase.NotReady ? (
        t('Validating...')
      ) : (
        <Label isCompact>{phase}</Label>
      )}

      {progressValue !== 0 && isPlanLoading && (
        <FlexItem className="pf-v5-u-font-size-sm">{Math.trunc(progressValue)}%</FlexItem>
      )}

      <Split hasGutter>
        {vmCount?.success > 0 && (
          <SplitItem>
            <PlanStatusVmCount
              count={vmCount.success}
              status="success"
              linkPath={vmCountLinkPath}
            />
          </SplitItem>
        )}

        {phase !== PlanPhase.Running &&
          phase !== PlanPhase.NotReady &&
          vms?.length &&
          !vmCount?.error &&
          !vmCount.success && (
            <SplitItem>
              <PlanStatusVmCount count={vms.length} status="warning" linkPath={vmCountLinkPath} />
            </SplitItem>
          )}

        {vmCount?.error > 0 && (
          <SplitItem>
            <PlanStatusVmCount count={vmCount?.error} status="danger" linkPath={vmCountLinkPath} />
          </SplitItem>
        )}
      </Split>
    </Flex>
  );
};
