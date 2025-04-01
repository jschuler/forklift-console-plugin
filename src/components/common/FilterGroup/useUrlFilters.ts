import { useMemo, useState } from 'react';

import { useSearchParams } from '../hooks/useSearchParams';
import { UserSettings } from '../Page/types';
import { ResourceField } from '../utils/types';
import { GlobalFilters } from './types';

/**
 * Safely parses a JSON string.
 * @param {string} jsonString - The JSON string to parse.
 * @returns {any} - The parsed JSON object or null if parsing fails.
 */
const safeParse = (str: string) => {
  try {
    return JSON.parse(str);
  } catch (e) {
    return undefined;
  }
};

/**
 * Filters and validates the search parameters.
 * @param {Array} fields - The fields containing resourceFieldId.
 * @param {Object} searchParams - The search parameters to filter and validate.
 * @returns {Object} - An object with valid filters.
 */
function getValidFilters(fields, searchParams) {
  const validFilters = fields
    .map(({ resourceFieldId }) => {
      const params = safeParse(searchParams[`${resourceFieldId}`]);
      return { resourceFieldId, params };
    })
    // Valid filter values are arrays
    .filter(({ params }) => Array.isArray(params) && params.length)
    .map(({ resourceFieldId, params }) => [resourceFieldId, params]);

  return Object.fromEntries(validFilters);
}

/**
 * Converts filters to search parameters.
 * @param {Array} fields - The fields containing resourceFieldId.
 * @param {Object} filters - The filters to convert.
 * @returns {Object} - The search parameters.
 */
function convertFiltersToSearchParams(fields, filters) {
  const searchParams = fields
    .map(({ resourceFieldId }) => ({ resourceFieldId, filters: filters[resourceFieldId] }))
    .map(({ resourceFieldId, filters }) => [
      resourceFieldId,
      Array.isArray(filters) && filters.length ? JSON.stringify(filters) : undefined,
    ]);

  return Object.fromEntries(searchParams);
}

/**
 * Sets the state and updates the URL search parameters.
 * @param {Function} setSelectedFilters - The function to set selected filters.
 * @param {Function} updateSearchParams - The function to update search parameters.
 * @param {Array} fields - The fields containing resourceFieldId.
 * @returns {Function} - The function to set state and update URL.
 */
function createSetStateAndUrl(setSelectedFilters, updateSearchParams, updateUserSettings, fields) {
  const persistentFieldIds = fields.filter((f) => f?.isPersistent).map((f) => f.resourceFieldId);

  return (filters) => {
    if (updateUserSettings) {
      const persistentFilters = Object.fromEntries(
        Object.entries(filters || {}).filter(([key]) => persistentFieldIds.includes(key)),
      );

      updateUserSettings(persistentFilters);
    }
    setSelectedFilters(filters);
    updateSearchParams(convertFiltersToSearchParams(fields, filters));
  };
}

/**
 * Init and maintain a set of filters on the search part of the URL.
 *
 *  1. filters are displayed in the URL as URL-encoded JSON array of strings. The use of intermediate JSON encoding ensures that we can encode arbitrary data.
 *  2. params in the URL are parsed only during initialization, afterwards they are a read-only side effect
 *  3. the single source of truth is the internal filter state maintained by the hook
 *
 * @param fields list of supported fields(read-only meta-data)
 * @returns [selectedFilters, setSelectedFilters]
 */
export const useUrlFilters = ({
  fields,
  userSettings,
}: {
  fields: ResourceField[];
  userSettings?: UserSettings;
}): [GlobalFilters, (filters: GlobalFilters) => void] => {
  const persistentFieldIds = fields.filter((f) => f?.isPersistent).map((f) => f.resourceFieldId);
  const persistentFilters = Object.fromEntries(
    Object.entries(userSettings?.filters.data || {}).filter(([key]) =>
      persistentFieldIds.includes(key),
    ),
  );

  const [searchParams, updateSearchParams] = useSearchParams();
  const [selectedFilters, setSelectedFilters] = useState(() => ({
    ...persistentFilters,
    ...getValidFilters(fields, searchParams),
  }));
  const updateUserSettings = userSettings?.filters.save;

  const setStateAndUrl = useMemo(
    () => createSetStateAndUrl(setSelectedFilters, updateSearchParams, updateUserSettings, fields),
    [setSelectedFilters, updateSearchParams, fields],
  );

  return [selectedFilters, setStateAndUrl];
};
