/**
 * Forklift API
 * Migration toolkit for virtualization (Forklift) API definitions.
 *
 * The version of the OpenAPI document: 2.4.0
 * Contact Email: kubev2v-dev@redhat.com
 * License: Apache-2.0
 *
 * NOTE: This file is auto generated by crdtotypes (https://github.com/yaacov/crdtoapi/).
 * https://github.com/yaacov/crdtoapi/README.crdtotypes
 */

import { IoK8sApimachineryPkgApisMetaV1ObjectMeta } from './IoK8sApimachineryPkgApisMetaV1ObjectMeta';
import { V1beta1PlanSpec } from './V1beta1PlanSpec';
import { V1beta1PlanStatus } from './V1beta1PlanStatus';

export interface V1beta1Plan {
  /** apiVersion
   * APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources
   *
   * @required {true}
   */
  apiVersion: string;
  /** kind
   * Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds
   *
   * @required {true}
   */
  kind: string;
  /** metadata
   *
   * @required {false}
   * @originalType {V1beta1PlanMetadata}
   */
  metadata?: IoK8sApimachineryPkgApisMetaV1ObjectMeta;
  /** spec
   * PlanSpec defines the desired state of Plan.
   *
   * @required {false}
   */
  spec?: V1beta1PlanSpec;
  /** status
   * PlanStatus defines the observed state of Plan.
   *
   * @required {false}
   */
  status?: V1beta1PlanStatus;
}
