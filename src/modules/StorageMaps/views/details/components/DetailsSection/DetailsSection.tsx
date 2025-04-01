import React from 'react';
import { ModalHOC } from 'src/modules/Providers/modals/ModalHOC/ModalHOC';

import { V1beta1StorageMap } from '@kubev2v/types';
import { DescriptionList } from '@patternfly/react-core';

import { CreatedAtDetailsItem } from './components/CreatedAtDetailsItem';
import { NameDetailsItem } from './components/NameDetailsItem';
import { NamespaceDetailsItem } from './components/NamespaceDetailsItem';
import { OwnerDetailsItem } from './components/OwnerDetailsItem';

export const DetailsSection: React.FC<DetailsSectionProps> = (props) => (
  <ModalHOC>
    <DetailsSectionInternal {...props} />
  </ModalHOC>
);

export type DetailsSectionProps = {
  obj: V1beta1StorageMap;
};

export const DetailsSectionInternal: React.FC<DetailsSectionProps> = ({ obj }) => {
  return (
    <DescriptionList
      columnModifier={{
        default: '1Col',
      }}
    >
      <NameDetailsItem resource={obj} />

      <NamespaceDetailsItem resource={obj} />

      <CreatedAtDetailsItem resource={obj} />

      <OwnerDetailsItem resource={obj} />
    </DescriptionList>
  );
};
