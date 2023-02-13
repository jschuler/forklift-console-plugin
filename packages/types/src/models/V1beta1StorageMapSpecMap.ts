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

import { V1beta1StorageMapSpecMapDestination } from './V1beta1StorageMapSpecMapDestination';
import { V1beta1StorageMapSpecMapSource } from './V1beta1StorageMapSpecMapSource';

/**
 * Mapped storage.
 *
 * @export
 */
export interface V1beta1StorageMapSpecMap {
  /** destination
   * Destination storage.
   *
   * @required {false}
   */
  destination?: V1beta1StorageMapSpecMapDestination;
  /** source
   * Source storage.
   *
   * @required {false}
   */
  source?: V1beta1StorageMapSpecMapSource;
}
