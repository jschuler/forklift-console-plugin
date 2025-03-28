import React from 'react';

import { Chip, ChipGroup, Toolbar, ToolbarContent, ToolbarItem } from '@patternfly/react-core';

import { type PlanCreatePageState } from '../states';

export interface ChipsToolbarProvidersProps {
  filterState: PlanCreatePageState;
  filterDispatch: React.Dispatch<{
    type: string;
    payload?: string | string[];
  }>;
}

export const ChipsToolbarProviders: React.FunctionComponent<ChipsToolbarProvidersProps> = ({
  filterDispatch,
  filterState,
}) => {
  const deleteNameFilter = (_) => {
    filterDispatch({ payload: '', type: 'SET_NAME_FILTER' });
  };

  const deleteTypeFilter = (type: string) => {
    filterDispatch({
      payload: filterState.typeFilters.filter((t) => t !== type),
      type: 'UPDATE_TYPE_FILTERS',
    });
  };

  const name = filterState.nameFilter;
  const types = filterState.typeFilters;

  return (
    <Toolbar id="toolbar-with-chip-groups">
      <ToolbarContent>
        {name && (
          <ToolbarItem>
            <ChipGroup categoryName="Name">
              <Chip key={name} onClick={() => deleteNameFilter(name)}>
                {name}
              </Chip>
            </ChipGroup>
          </ToolbarItem>
        )}
        {types && types.length > 0 && (
          <ToolbarItem>
            <ChipGroup categoryName="Types">
              {types.map((type, index) => (
                <Chip key={index} onClick={() => deleteTypeFilter(type)}>
                  {type}
                </Chip>
              ))}
            </ChipGroup>
          </ToolbarItem>
        )}
      </ToolbarContent>
    </Toolbar>
  );
};
