import React, { FC, ReactNode } from 'react';

export interface SectionHeadingProps {
  text: ReactNode;
  className?: string;
  id?: string;
  'data-testid'?: string;
  children?: React.ReactNode;
}

/**
 * SectionHeading Component
 *
 * @param {SectionHeadingProps} props - Props for the component.
 * @returns {ReactNode} - The rendered h2 element.
 */
export const SectionHeading: FC<SectionHeadingProps> = ({
  children,
  className,
  'data-testid': dataTestid,
  id,
  text,
}) => (
  <h2 className={`co-section-heading ${className || ''}`} data-testid={dataTestid} id={id}>
    <span>{text}</span>
    {children}
  </h2>
);

export default SectionHeading;
