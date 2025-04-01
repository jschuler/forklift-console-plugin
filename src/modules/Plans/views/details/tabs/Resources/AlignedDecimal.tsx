import React from 'react';
import { useForkliftTranslation } from 'src/utils/i18n';

export type AlignedDecimalProps = {
  /**
   * The number to align.
   */
  value: number;
  /**
   * (optional) units to be displayed next to the number. E.g 'MB', 'Cores'.
   */
  unit?: string;
  /**
   * (optional) The number fractional part precision, I.e, number of fractional digits to leave.
   */
  fractionalPrecision?: number;
};

export const AlignedDecimal: React.FC<AlignedDecimalProps> = ({
  value,
  unit = '',
  fractionalPrecision = 2,
}) => {
  const { t } = useForkliftTranslation();

  const [integerPart, fractionalPart] = value.toFixed(fractionalPrecision).split('.');
  const formattedFractionalPart = fractionalPrecision === 0 ? ' ' : '.' + fractionalPart;

  return (
    <div>
      <div className="forklift-page-plan-resources-td-integer">{integerPart}</div>
      <div className="forklift-page-plan-resources-td-fractional">
        {formattedFractionalPart}&nbsp;&nbsp;{t(unit)}
      </div>
    </div>
  );
};
