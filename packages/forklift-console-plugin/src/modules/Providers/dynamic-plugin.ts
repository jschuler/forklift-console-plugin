import { ProviderModel, ProviderModelGroupVersionKind } from '@kubev2v/types';
import { EncodedExtension } from '@openshift/dynamic-plugin-sdk-webpack';
import {
  ContextProvider,
  CreateResource,
  HrefNavItem,
  ModelMetadata,
  ResourceDetailsPage,
  ResourceListPage,
  ResourceNSNavItem,
  RoutePage,
} from '@openshift-console/dynamic-plugin-sdk';
import type { ConsolePluginBuildMetadata } from '@openshift-console/dynamic-plugin-sdk-webpack';

export const exposedModules: ConsolePluginBuildMetadata['exposedModules'] = {
  ProvidersListPage: './modules/Providers/views/list/ProvidersListPage',
  ProviderDetailsPage: './modules/Providers/views/details/ProviderDetailsPage',
  ProvidersCreatePage: './modules/Providers/views/create/ProvidersCreatePage',
  ProvidersCreateVmMigrationContext:
    './modules/Providers/views/migrate/ProvidersCreateVmMigrationContext',
  ExampleNamespacedPage: './modules/Providers/views/create/ExampleNamespacedPage',
};

export const extensions: EncodedExtension[] = [
  {
    type: 'console.navigation/resource-ns',
    properties: {
      id: 'providers-ng',
      insertAfter: ['forkliftSettings', 'importSeparator'],
      perspective: 'admin',
      section: 'migration',
      // t('plugin__forklift-console-plugin~Providers for virtualization')
      name: '%plugin__forklift-console-plugin~Providers for virtualization%',
      model: ProviderModelGroupVersionKind,
      dataAttributes: {
        'data-quickstart-id': 'qs-nav-providers',
        'data-testid': 'providers-nav-item',
      },
    },
  } as EncodedExtension<ResourceNSNavItem>,

  {
    type: 'console.page/resource/list',
    properties: {
      component: {
        $codeRef: 'ProvidersListPage',
      },
      model: ProviderModelGroupVersionKind,
    },
  } as EncodedExtension<ResourceListPage>,

  {
    type: 'console.page/resource/details',
    properties: {
      component: {
        $codeRef: 'ProviderDetailsPage',
      },
      model: ProviderModelGroupVersionKind,
    },
  } as EncodedExtension<ResourceDetailsPage>,

  {
    type: 'console.model-metadata',
    properties: {
      model: ProviderModelGroupVersionKind,
      ...ProviderModel,
    },
  } as EncodedExtension<ModelMetadata>,

  {
    type: 'console.resource/create',
    properties: {
      component: {
        $codeRef: 'ProvidersCreatePage',
      },
      model: ProviderModelGroupVersionKind,
      ...ProviderModel,
    },
  } as EncodedExtension<CreateResource>,

  {
    type: 'console.page/route',
    properties: {
      component: {
        $codeRef: 'ExampleNamespacedPage',
      },
      path: ['/mtv/example/ns/:ns', '/mtv/example/all-namespaces'],
      exact: false,
    },
    flags: {
      required: ['CAN_LIST_NS'],
    },
  } as EncodedExtension<RoutePage>,
  {
    type: 'console.navigation/href',
    properties: {
      id: 'exampleNamespacedPage',
      insertAfter: 'importSeparator',
      perspective: 'admin',
      section: 'migration',
      href: '/mtv/example',
      namespaced: true,
      name: 'ExampleNamespacedPage',
    },
    flags: {
      required: ['CAN_LIST_NS'],
    },
  } as EncodedExtension<HrefNavItem>,

  {
    type: 'console.context-provider',
    properties: {
      provider: { $codeRef: 'ProvidersCreateVmMigrationContext.CreateVmMigrationProvider' },
      useValueHook: {
        $codeRef: 'ProvidersCreateVmMigrationContext.useCreateVmMigrationContextValue',
      },
    },
  } as EncodedExtension<ContextProvider>,
];
