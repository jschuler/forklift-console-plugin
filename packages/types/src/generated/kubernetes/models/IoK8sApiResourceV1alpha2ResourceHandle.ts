/* tslint:disable */
/* eslint-disable */
/**
 * Kubernetes
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: unversioned
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { exists, mapValues } from '../../runtime';
/**
 * ResourceHandle holds opaque resource data for processing by a specific kubelet plugin.
 * @export
 * @interface IoK8sApiResourceV1alpha2ResourceHandle
 */
export interface IoK8sApiResourceV1alpha2ResourceHandle {
    /**
     * Data contains the opaque data associated with this ResourceHandle. It is set by the controller component of the resource driver whose name matches the DriverName set in the ResourceClaimStatus this ResourceHandle is embedded in. It is set at allocation time and is intended for processing by the kubelet plugin whose name matches the DriverName set in this ResourceHandle.
     * 
     * The maximum size of this field is 16KiB. This may get increased in the future, but not reduced.
     * @type {string}
     * @memberof IoK8sApiResourceV1alpha2ResourceHandle
     */
    data?: string;
    /**
     * DriverName specifies the name of the resource driver whose kubelet plugin should be invoked to process this ResourceHandle's data once it lands on a node. This may differ from the DriverName set in ResourceClaimStatus this ResourceHandle is embedded in.
     * @type {string}
     * @memberof IoK8sApiResourceV1alpha2ResourceHandle
     */
    driverName?: string;
}

/**
 * Check if a given object implements the IoK8sApiResourceV1alpha2ResourceHandle interface.
 */
export function instanceOfIoK8sApiResourceV1alpha2ResourceHandle(value: object): boolean {
    let isInstance = true;

    return isInstance;
}

export function IoK8sApiResourceV1alpha2ResourceHandleFromJSON(json: any): IoK8sApiResourceV1alpha2ResourceHandle {
    return IoK8sApiResourceV1alpha2ResourceHandleFromJSONTyped(json, false);
}

export function IoK8sApiResourceV1alpha2ResourceHandleFromJSONTyped(json: any, ignoreDiscriminator: boolean): IoK8sApiResourceV1alpha2ResourceHandle {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'data': !exists(json, 'data') ? undefined : json['data'],
        'driverName': !exists(json, 'driverName') ? undefined : json['driverName'],
    };
}

export function IoK8sApiResourceV1alpha2ResourceHandleToJSON(value?: IoK8sApiResourceV1alpha2ResourceHandle | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'data': value.data,
        'driverName': value.driverName,
    };
}
