import { IoK8sApiCoreV1Secret, V1beta1Provider } from '@kubev2v/types';

import { openshiftSecretValidator } from './openshift/openshiftSecretValidator';
import { openstackSecretValidator } from './openstack/openstackSecretValidator';
import { ovirtSecretValidator } from './ovirt/ovirtSecretValidator';
import { esxiSecretValidator } from './vsphere/esxiSecretValidator';
import { vcenterSecretValidator } from './vsphere/vcenterSecretValidator';
import { ValidationMsg } from '../common';

export type SecretSubType = 'esxi' | 'vcenter';

export function secretValidator(
  provider: V1beta1Provider,
  type: string,
  subType: SecretSubType,
  secret: IoK8sApiCoreV1Secret,
): ValidationMsg {
  let validationError: ValidationMsg;

  switch (type) {
    case 'openshift':
      validationError = openshiftSecretValidator(provider, secret);
      break;
    case 'openstack':
      validationError = openstackSecretValidator(secret);
      break;
    case 'ovirt':
      validationError = ovirtSecretValidator(secret);
      break;
    case 'vsphere':
      if (subType === 'esxi') {
        validationError = esxiSecretValidator(secret);
      } else {
        validationError = vcenterSecretValidator(secret);
      }
      break;
    case 'ova':
      validationError = { type: 'default' };
      break;
    default:
      validationError = { type: 'error', msg: 'bad provider type' };
  }

  return validationError;
}
