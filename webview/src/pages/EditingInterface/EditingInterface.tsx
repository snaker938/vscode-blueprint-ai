import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import ComponentsTab from '../../components/ComponentsTab/ComponentsTab';
import './EditingInterface.css';

const EditingInterface: React.FC = () => {
  const [activeTab, setActiveTab] = useState('components');

  const renderActiveTabContent = () => {
    switch (activeTab) {
      case 'components':
        return <ComponentsTab />;
      default:
        return null;
    }
  };

  return (
    <div className="editing-interface">
      <Sidebar activeTab={activeTab} onTabClick={setActiveTab} />
      {renderActiveTabContent()}
      <div className="main-content">
        <h1>Main Content Area</h1>
      </div>
    </div>
  );
};

export default EditingInterface;
