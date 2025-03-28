import type { Mapping, MappingSource } from '../types';

export const addMapping = (sources: MappingSource[], targets: string[], mappings: Mapping[]) => {
  const firstUsedByVms = sources.find(
    ({ isMapped, usedBySelectedVms }) => usedBySelectedVms && !isMapped,
  );
  const firstGeneral = sources.find(
    ({ isMapped, usedBySelectedVms }) => !usedBySelectedVms && !isMapped,
  );
  const nextSource = firstUsedByVms || firstGeneral;
  const nextDest = targets[0];

  return nextDest && nextSource
    ? {
        mappings: [...mappings, { destination: nextDest, source: nextSource.label }],
        sources: sources.map((m) => ({
          ...m,
          isMapped: m.label === nextSource.label ? true : m.isMapped,
        })),
      }
    : {};
};

export const deleteMapping = (
  sources: MappingSource[],
  selectedSource: string,
  mappings: Mapping[],
) => {
  const currentSource = sources.find(({ isMapped, label }) => label === selectedSource && isMapped);

  return currentSource
    ? {
        mappings: mappings.filter(({ source }) => source !== currentSource.label),
        sources: sources.map((m) => ({
          ...m,
          isMapped: m.label === selectedSource ? false : m.isMapped,
        })),
      }
    : {};
};

export const replaceMapping = (
  sources: MappingSource[],
  current: Mapping,
  next: Mapping,
  targets: string[],
  mappings: Mapping[],
) => {
  const currentSource = sources.find(({ isMapped, label }) => label === current.source && isMapped);
  const nextSource = sources.find(({ label }) => label === next.source);
  const nextDest = targets.find((label) => label === next.destination);
  const sourceChanged = currentSource?.label !== nextSource?.label;
  const destinationChanged = current.destination !== nextDest;

  if (!currentSource || !nextSource || !nextDest || (!sourceChanged && !destinationChanged)) {
    return {};
  }

  const updatedSources = sourceChanged
    ? sources.map((m) => ({
        ...m,
        isMapped: [currentSource.label, nextSource.label].includes(m.label)
          ? !m.isMapped
          : m.isMapped,
      }))
    : undefined;

  return {
    mappings: updateMappingsIfNeeded(mappings, current.source, next),
    sources: updatedSources,
  };
};

const updateMappingsIfNeeded = (mappings, currentSource, next) => {
  const mappingIndex = mappings.findIndex(({ source }) => source === currentSource);
  if (mappingIndex < 0) {
    return undefined;
  }
  const updatedMappings = [...mappings];
  updatedMappings.splice(mappingIndex, 1, next);
  return updatedMappings;
};
