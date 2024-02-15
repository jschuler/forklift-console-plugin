/* tslint:disable */
/* eslint-disable */
/**
 * KubeVirt API
 * This is KubeVirt API an add-on for Kubernetes.
 *
 * The version of the OpenAPI document: 1.0.0
 * Contact: kubevirt-dev@googlegroups.com
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { exists, mapValues } from '../../runtime';
/**
 * SnapshotVolumesLists includes the list of volumes which were included in the snapshot and volumes which were excluded from the snapshot
 * @export
 * @interface V1alpha1SnapshotVolumesLists
 */
export interface V1alpha1SnapshotVolumesLists {
    /**
     * 
     * @type {Array<string>}
     * @memberof V1alpha1SnapshotVolumesLists
     */
    excludedVolumes?: Array<string>;
    /**
     * 
     * @type {Array<string>}
     * @memberof V1alpha1SnapshotVolumesLists
     */
    includedVolumes?: Array<string>;
}

/**
 * Check if a given object implements the V1alpha1SnapshotVolumesLists interface.
 */
export function instanceOfV1alpha1SnapshotVolumesLists(value: object): boolean {
    let isInstance = true;

    return isInstance;
}

export function V1alpha1SnapshotVolumesListsFromJSON(json: any): V1alpha1SnapshotVolumesLists {
    return V1alpha1SnapshotVolumesListsFromJSONTyped(json, false);
}

export function V1alpha1SnapshotVolumesListsFromJSONTyped(json: any, ignoreDiscriminator: boolean): V1alpha1SnapshotVolumesLists {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'excludedVolumes': !exists(json, 'excludedVolumes') ? undefined : json['excludedVolumes'],
        'includedVolumes': !exists(json, 'includedVolumes') ? undefined : json['includedVolumes'],
    };
}

export function V1alpha1SnapshotVolumesListsToJSON(value?: V1alpha1SnapshotVolumesLists | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'excludedVolumes': value.excludedVolumes,
        'includedVolumes': value.includedVolumes,
    };
}
