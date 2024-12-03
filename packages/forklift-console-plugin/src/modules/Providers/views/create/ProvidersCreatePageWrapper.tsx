import * as React from 'react';
// import { ForkliftTrans, useForkliftTranslation } from 'src/utils/i18n';

import { /*NamespaceBar,*/ useActiveNamespace } from '@openshift-console/dynamic-plugin-sdk';
// import * as ALL from '@openshift-console/dynamic-plugin-sdk';
// import {
//   Card,
//   CardBody,
//   Flex,
//   Page,
//   PageSection,
//   PageSectionVariants,
//   Title,
// } from '@patternfly/react-core';
// import { Alert } from '@patternfly/react-core';

import { ProvidersCreatePage } from './ProvidersCreatePage';

// const NamespacePageContent = ({ namespace }: { namespace?: string }) => {
//   return (
//     <Page>
//       <PageSection variant={PageSectionVariants.light}>
//         <Title headingLevel="h1">Example page with a namespace bar</Title>
//       </PageSection>
//       <PageSection>
//         <Card>
//           <CardBody>
//             <Flex
//               alignItems={{ default: 'alignItemsCenter' }}
//               justifyContent={{ default: 'justifyContentCenter' }}
//               grow={{ default: 'grow' }}
//               direction={{ default: 'column' }}
//             >
//               <h1>Currently selected namespace</h1>
//               <h2>{namespace}</h2>
//             </Flex>
//           </CardBody>
//         </Card>
//       </PageSection>
//     </Page>
//   );
// };

export const ProvidersCreatePageWrapper: React.FC<{
  namespace: string;
}> = ({ namespace }) => {
  //   console.log(ALL);
  console.log(namespace);
  // eslint-disable-next-line no-debugger
  debugger;
  // const { t } = useForkliftTranslation();
  const [activeNamespace] = useActiveNamespace();

  // const defaultNamespace = process?.env?.DEFAULT_NAMESPACE || 'default';

  return (
    <>
      {/* <NamespaceBar />
      {activeNamespace === '#ALL_NS#' && (
        <Alert className="co-alert" isInline variant="warning" title={t('Select a namespace')}>
          <ForkliftTrans>
            This provider will be created in the <strong>{defaultNamespace}</strong> namespace, if
            you wish to choose another namespace, choose a namespace from the top bar.
          </ForkliftTrans>
        </Alert>
      )} */}
      <ProvidersCreatePage namespace={activeNamespace === '#ALL_NS#' ? '' : activeNamespace} />
    </>
  );
};

export default ProvidersCreatePageWrapper;
