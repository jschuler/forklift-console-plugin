import React from 'react';

import { Modify, V1beta1Provider } from '@kubev2v/types';
import { K8sModel } from '@openshift-console/dynamic-plugin-sdk/lib/api/core-api';

import { EditModalProps } from '../EditModal/types';
import { OpenshiftEditUIModal } from './OpenshiftEditUIModal';
import { OpenstackEditUIModal } from './OpenstackEditUIModal';
import { OvirtEditUIModal } from './OvirtEditUIModal';
import { VSphereEditUIModal } from './VSphereEditUIModal';

export type EditProviderUIModalProps = Modify<
  EditModalProps,
  {
    resource: V1beta1Provider;
    title?: string;
    label?: string;
    model?: K8sModel;
    jsonPath?: string | string[];
    content?: string;
  }
>;

export const EditProviderUIModal: React.FC<EditProviderUIModalProps> = (props) => {
  switch (props.resource?.spec?.type) {
    case 'vsphere':
      return <VSphereEditUIModal {...props} />;
    case 'ovirt':
      return <OvirtEditUIModal {...props} />;
    case 'openshift':
      return <OpenshiftEditUIModal {...props} />;
    case 'openstack':
      return <OpenstackEditUIModal {...props} />;
    default:
      return <></>;
  }
};
