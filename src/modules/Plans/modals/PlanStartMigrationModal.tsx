import { type FC, type MouseEvent, type ReactNode, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom-v5-compat';
import useToggle from 'src/modules/Providers/hooks/useToggle';
import { AlertMessageForModals } from 'src/modules/Providers/modals/components/AlertMessageForModals';
import { useModal } from 'src/modules/Providers/modals/ModalHOC/ModalHOC';
import { ForkliftTrans, useForkliftTranslation } from 'src/utils/i18n';

import { MigrationModel, type V1beta1Migration, type V1beta1Plan } from '@kubev2v/types';
import { k8sCreate, type K8sModel } from '@openshift-console/dynamic-plugin-sdk';
import { Button, Modal, ModalVariant } from '@patternfly/react-core';

import { usePlanMigration } from '../hooks/usePlanMigration';

/**
 * Props for the DeleteModal component
 * @typedef PlanStartMigrationModalProps
 * @property {string} title - The title to display in the modal
 * @property {V1beta1Plan} resource - The resource object to delete
 * @property {K8sModel} model - The model used for deletion
 * @property {string} [redirectTo] - Optional redirect URL after deletion
 */
type PlanStartMigrationModalProps = {
  resource: V1beta1Plan;
  model: K8sModel;
  title?: string;
  redirectTo?: string;
  setButtonEnabledOnChange: (enableStartButton: boolean) => void;
};

/**
 * A generic delete modal component
 * @component
 * @param {DeleteModalProps} props - Props for DeleteModal
 * @returns {Element} The DeleteModal component
 */
export const PlanStartMigrationModal: FC<PlanStartMigrationModalProps> = ({
  redirectTo,
  resource,
  setButtonEnabledOnChange,
  title,
}) => {
  const { t } = useForkliftTranslation();
  const { toggleModal } = useModal();
  const [isLoading, toggleIsLoading] = useToggle();
  const navigate = useNavigate();
  const [alertMessage, setAlertMessage] = useState<ReactNode>(null);
  const [lastMigration] = usePlanMigration(resource);
  const [startButtonEnabled, setStartButtonEnabled] = useState(true);

  const isRunningMigrationExist =
    lastMigration !== undefined && lastMigration?.status?.completed === undefined;
  const title_ = title || t('Start migration');
  const { name, namespace, uid } = resource?.metadata || {};
  const { warm } = resource?.spec || {};

  const onStart = useCallback(async () => {
    toggleIsLoading();
    setButtonEnabledOnChange(false);
    setStartButtonEnabled(false);

    try {
      if (isRunningMigrationExist) {
        toggleModal();
        return;
      }

      const migration: V1beta1Migration = {
        apiVersion: 'forklift.konveyor.io/v1beta1',
        kind: 'Migration',
        metadata: {
          generateName: `${name}-`,
          namespace,
          ownerReferences: [
            {
              apiVersion: 'forklift.konveyor.io/v1beta1',
              kind: 'Plan',
              name,
              uid,
            },
          ],
        },
        spec: {
          plan: {
            name,
            namespace,
            uid,
          },
        },
      };

      await k8sCreate({ data: migration, model: MigrationModel });
      if (redirectTo) {
        navigate(redirectTo);
      }

      toggleModal();
    } catch (err) {
      toggleIsLoading();

      setAlertMessage(<AlertMessageForModals title={t('Error')} message={err.toString()} />);
    }
  }, [resource, lastMigration]);

  const onClickToggleModal: (event: MouseEvent<HTMLButtonElement>) => void = (_event) => {
    toggleModal();
    setButtonEnabledOnChange(true);
  };

  const actions = [
    <Button key="confirm" onClick={onStart} isLoading={isLoading} isDisabled={!startButtonEnabled}>
      {t('Start')}
    </Button>,
    <Button key="cancel" variant="secondary" onClick={onClickToggleModal}>
      {t('Cancel')}
    </Button>,
  ];

  return (
    <Modal
      title={title_}
      position="top"
      showClose={false}
      variant={ModalVariant.small}
      isOpen={true}
      onClose={toggleModal}
      actions={actions}
    >
      {warm ? (
        <ForkliftTrans>
          <p>
            Start the warm migration for plan <strong className="co-break-word">{name}</strong>?
          </p>
          <br />
          <p>VMs included in warm migrations migrate with minimal downtime.</p>
        </ForkliftTrans>
      ) : (
        <ForkliftTrans>
          <p>
            Start the cold migration for plan <strong className="co-break-word">{name}</strong>?
          </p>
          <br />
          <p>VMs included in cold migrations are shut down during migration.</p>
        </ForkliftTrans>
      )}
      {alertMessage}
    </Modal>
  );
};
