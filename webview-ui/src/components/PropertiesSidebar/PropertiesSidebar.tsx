import React from 'react';
import './propertiesSidebarStyles.css';

export const PropertiesSidebar: React.FC = () => {
  return (
    <div className="properties-bar-container">
      {/* Title at top */}
      <div className="properties-bar-header">Component Properties</div>

      {/* Main empty content area */}
      <div className="properties-bar-content">{/* no content for now */}</div>
    </div>
  );
};
