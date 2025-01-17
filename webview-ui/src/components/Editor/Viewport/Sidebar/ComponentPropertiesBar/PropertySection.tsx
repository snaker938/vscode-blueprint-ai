import React from 'react';

interface PropertySectionProps {
  title?: string;
  summary?: (values: any) => string | JSX.Element;
  props?: string[];
  children?: React.ReactNode;
}

export const PropertySection: React.FC<PropertySectionProps> = ({
  title,
  children,
}) => {
  return (
    <div
      style={{
        marginBottom: '15px',
        padding: '10px',
        border: '1px solid #ddd',
        borderRadius: '4px',
      }}
    >
      {title && (
        <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>{title}</div>
      )}
      {children}
    </div>
  );
};
