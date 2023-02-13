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

import { V1beta1MigrationStatusVmsConditions } from './V1beta1MigrationStatusVmsConditions';
import { V1beta1MigrationStatusVmsError } from './V1beta1MigrationStatusVmsError';
import { V1beta1MigrationStatusVmsHooks } from './V1beta1MigrationStatusVmsHooks';
import { V1beta1MigrationStatusVmsPipeline } from './V1beta1MigrationStatusVmsPipeline';
import { V1beta1MigrationStatusVmsWarm } from './V1beta1MigrationStatusVmsWarm';

/**
 * VM Status
 *
 * @export
 */
export interface V1beta1MigrationStatusVms {
  /** completed
   * Completed timestamp.
   *
   * @required {false}
   * @format {date-time}
   */
  completed?: string;
  /** conditions
   * Condition
   *
   * @required {false}
   */
  conditions?: V1beta1MigrationStatusVmsConditions[];
  /** error
   * Errors
   *
   * @required {false}
   */
  error?: V1beta1MigrationStatusVmsError;
  /** hooks
   * Plan hook.
   *
   * @required {false}
   */
  hooks?: V1beta1MigrationStatusVmsHooks[];
  /** id
   * The object ID. vsphere: The managed object ID.
   *
   * @required {false}
   */
  id?: string;
  /** name
   * An object Name. vsphere: A qualified name.
   *
   * @required {false}
   */
  name?: string;
  /** phase
   * Phase
   *
   * @required {true}
   */
  phase: string;
  /** pipeline
   * Pipeline step.
   *
   * @required {false}
   */
  pipeline?: V1beta1MigrationStatusVmsPipeline[];
  /** restorePowerState
   * Source VM power state before migration.
   *
   * @required {false}
   */
  restorePowerState?: string;
  /** started
   * Started timestamp.
   *
   * @required {false}
   * @format {date-time}
   */
  started?: string;
  /** type
   * Type used to qualify the name.
   *
   * @required {false}
   */
  type?: string;
  /** warm
   * Warm migration status
   *
   * @required {false}
   */
  warm?: V1beta1MigrationStatusVmsWarm;
}
