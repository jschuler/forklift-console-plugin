import React from 'react';
import { Base64 } from 'js-base64';
import { ForkliftTrans, useForkliftTranslation } from 'src/utils/i18n';

import { Text, TextVariants } from '@patternfly/react-core';

import { FieldWithClipboardCopy } from '../../FieldWithClipboardCopy';
import { MaskedField } from '../../MaskedField';
import { ListComponentProps } from '../BaseCredentialsSection';
import { Fields } from './Fields';

export const EsxiCredentialsList: React.FC<ListComponentProps> = ({ secret, reveal }) => {
  const { t } = useForkliftTranslation();

  const items = [];

  const insecureSkipVerifyHelperTextPopover = (
    <ForkliftTrans>
      <p>
        Select <strong>Skip certificate validation</strong> to skip certificate verification, which
        proceeds with an insecure migration and then the certificate is not required. Insecure
        migration means that the transferred data is sent over an insecure connection and
        potentially sensitive data could be exposed.
      </p>
    </ForkliftTrans>
  );

  const cacertHelperTextPopover = (
    <ForkliftTrans>
      <p>
        Use the CA certificate of the Manager unless it was replaced by a third-party certificate,
        in which case enter the Manager Apache CA certificate.
      </p>
      <p>When left empty the system CA certificate is used.</p>
      <p>
        The certificate is not verified when <strong>Skip certificate validation</strong> is set.
      </p>
    </ForkliftTrans>
  );

  const fields: Fields = {
    user: {
      label: t('Username'),
      description: (
        <div className="forklift-page-provider-field-default-validation">
          <ForkliftTrans>
            A username and domain for connecting to the ESXi API endpoint. For example:{' '}
            <strong>user</strong>.
          </ForkliftTrans>
        </div>
      ),
    },
    password: {
      label: t('Password'),
      description: 'A user password for connecting to the ESXi API endpoint.',
    },
    insecureSkipVerify: {
      label: t('Skip certificate validation'),
      description: t("If true, the provider's TLS certificate won't be validated."),
      cacertHelperTextPopover: insecureSkipVerifyHelperTextPopover,
      displayType: 'switch',
    },
    cacert: {
      label: t('CA certificate'),
      description: t(
        'A CA certificate to be trusted when connecting to the ESXi API endpoint. Ensure the CA certificate format is in a PEM encoded X.509 format. To use a CA certificate, drag the file to the text box or browse for it. To use the system CA certificate, leave the field empty.',
      ),
      helperTextPopover: cacertHelperTextPopover,
      displayType: 'textArea',
    },
  };

  for (const key in fields) {
    const field = fields[key];
    const base64Value = secret.data?.[key];
    const value = base64Value ? Base64.decode(secret.data[key]) : undefined;

    items.push(
      <>
        <div className="forklift-page-secret-title-div">
          <Text component={TextVariants.h6} className="forklift-page-secret-title">
            {field.label}
          </Text>
          <Text component={TextVariants.small} className="forklift-page-secret-subtitle">
            {field.description}
          </Text>
        </div>
        <div className="forklift-page-secret-content-div">
          {reveal ? <FieldWithClipboardCopy field={field} value={value} /> : <MaskedField />}
        </div>
      </>,
    );
  }

  return <>{items}</>;
};
